import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataContext } from '../context/DataContext.js';
import CustomSwal from '../utils/CustomSwal';

export default function Matricula() {
  const { user, updateUser, refreshUser } = useAuth();
  const { cursos, profesores, salones, matricularUsuario, loading, error } = useContext(DataContext);

  const [listaCursos, setListaCursos] = useState([]);
  const [loadingMatricula, setLoadingMatricula] = useState(false);

  useEffect(() => {
    if (!user) {
      setListaCursos([]);
      return;
    }
    // Filtrar todos los cursos del contexto por la carrera del usuario:
    const filtrados = cursos.filter(c => c.carrera === user.carrera);
    setListaCursos(filtrados);
  }, [user, cursos]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Cargando cursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4 text-unilibre-red">Error de conexión</h1>
        <p className="text-gray-700 mb-2">{error}</p>
        <p className="text-gray-500">Por favor, verifica tu conexión o intenta más tarde.</p>
      </div>
    );
  }

  const creditosRestantes = 18 - user.creditosMatriculados;

  const horarioChoca = (dia, horaInicio, horaFin) => {
    for (let mat of user.matriculas) {
      // Buscamos el curso ya matriculado en la lista actual de cursos
      const cursoMat = listaCursos.find(c => Number(c.id) === Number(mat.cursoId));
      if (!cursoMat) continue;
      const horarioMat = cursoMat.horarios.find(h => Number(h.id) === Number(mat.horarioId));
      if (!horarioMat) continue;
      if (horarioMat.dia === dia) {
        const [hI1, mI1] = horarioMat.horaInicio.split(':').map(Number);
        const [hF1, mF1] = horarioMat.horaFin.split(':').map(Number);
        const [hI2, mI2] = horaInicio.split(':').map(Number);
        const [hF2, mF2] = horaFin.split(':').map(Number);
        const ini1 = hI1 * 60 + mI1;
        const fin1 = hF1 * 60 + mF1;
        const ini2 = hI2 * 60 + mI2;
        const fin2 = hF2 * 60 + mF2;
        if (!(fin2 <= ini1 || ini2 >= fin1)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleMatricular = async (ev, curso, horario) => {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
    if (loadingMatricula) return;
    setLoadingMatricula(true);
    try {
      // 1) Validaciones locales
      if (horarioChoca(horario.dia, horario.horaInicio, horario.horaFin)) {
        await CustomSwal.fire({
          icon: 'error',
          title: 'Horario en conflicto',
          text: 'Este horario coincide con una clase que ya tienes matriculada.',
        });
        return;
      }
      if (user.creditosMatriculados + curso.creditos > 18) {
        await CustomSwal.fire({
          icon: 'error',
          title: 'Límite de créditos excedido',
          text: `No tienes suficientes créditos disponibles. Te quedan ${creditosRestantes}.`,
        });
        return;
      }
      const cuposRestantes = curso.cuposMax - horario.cupoOcupado;
      if (cuposRestantes <= 0) {
        await CustomSwal.fire({
          icon: 'error',
          title: 'Cupos agotados',
          text: 'Ya no hay cupos disponibles en este horario.',
        });
        return;
      }
      // Validación adicional: no permitir matrícula si el curso está lleno
      if (curso.matriculados >= curso.cuposMax) {
        await CustomSwal.fire({
          icon: 'error',
          title: 'Curso lleno',
          text: 'Este curso ya alcanzó el máximo de matriculados permitidos.',
        });
        return;
      }

      // Validación: no permitir matricular el mismo curso en otro horario
      const yaMatriculadoEnCurso = user.matriculas.some(m => String(m.cursoId) === String(curso.id));
      if (yaMatriculadoEnCurso) {
        await CustomSwal.fire({
          icon: 'warning',
          title: 'Ya tienes este curso matriculado',
          text: 'No puedes matricular el mismo curso en más de un horario. Si deseas cambiar de horario, primero elimina la matrícula actual.',
        });
        return;
      }

      // 2) Mostrar SweetAlert2 de confirmación
      const result = await CustomSwal.fire({
        title: `¿Confirmas matrícula?`,
        html: `
          <p><strong>Materia:</strong> ${curso.nombre} (${curso.codigo})</p>
          <p><strong>Horario:</strong> ${horario.dia} ${horario.horaInicio} - ${horario.horaFin}</p>
          <p><strong>Créditos:</strong> ${curso.creditos}</p>
          <p><strong>Profesor:</strong> ${profesores.find(p => Number(p.id) === Number(horario.profesorId))?.nombre || '-'}</p>
          <p><strong>Salón:</strong> ${salones.find(s => Number(s.id) === Number(horario.salonId))?.codigo || '-'}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, matricular',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;

      // 3) Llamamos a matricularUsuario (se encarga de PATCH /horarios y PATCH /cursos)
      const res = await matricularUsuario({ cursoId: curso.id, horarioId: horario.id });
      if (!res.success) {
        await CustomSwal.fire({ icon: 'error', title: 'Error', text: res.message });
        return;
      }

      // Ahora actualizamos el usuario
      const nuevosCampos = {
        creditosMatriculados: user.creditosMatriculados + curso.creditos,
        matriculas: [
          ...user.matriculas,
          { cursoId: curso.id, horarioId: horario.id }
        ]
      };
      await updateUser(nuevosCampos);
      // Refresca la info del usuario desde GET /usuarios/:id y espera a que termine
      try {
        await refreshUser();
      } catch (refreshErr) {
        console.error('Error al refrescar usuario:', refreshErr);
        await CustomSwal.fire({
          icon: 'warning',
          title: 'Matrícula realizada, pero no se pudo refrescar usuario',
          text: 'La matrícula fue exitosa, pero hubo un problema al actualizar tus datos. Por favor, vuelve a iniciar sesión si no ves los cambios.'
        });
        setLoadingMatricula(false);
        return;
      }
      await CustomSwal.fire({
        icon: 'success',
        title: '¡Matriculado!',
        text: `Te matriculaste en ${curso.nombre}.`
      });
    } catch (err) {
      console.error('Error en handleMatricular:', err);
      await CustomSwal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Revisa la consola para más detalles.'
      });
    } finally {
      setLoadingMatricula(false);
    }
  };

  // Eliminar matrícula de un curso
//   const handleEliminarMatricula = async (curso, horario) => {
//     const result = await CustomSwal.fire({
//       title: '¿Eliminar matrícula?',
//       html: `<p>¿Estás seguro de que deseas eliminar la matrícula de <strong>${curso.nombre}</strong> (${curso.codigo})<br/>Horario: <strong>${horario.dia} ${horario.horaInicio} - ${horario.horaFin}</strong>?</p>`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//     });
//     if (!result.isConfirmed) return;
//     try {
//       // 1. Actualizar usuario
//       const nuevasMatriculas = user.matriculas.filter(m => !(String(m.cursoId) === String(curso.id) && String(m.horarioId) === String(horario.id)));
//       const nuevosCreditos = user.creditosMatriculados - curso.creditos;
//       await updateUser({
//         matriculas: nuevasMatriculas,
//         creditosMatriculados: nuevosCreditos < 0 ? 0 : nuevosCreditos
//       });
//       // 2. Liberar cupo en Firestore para el horario y curso
//       if (typeof horario.id !== 'undefined' && typeof curso.id !== 'undefined') {
//         const { getHorarioByIdFirebase, updateHorarioFirebase, getCursoByIdFirebase, updateCursoFirebase } = await import('../api-firebase');
//         // Obtener valores actualizados
//         const horarioActual = await getHorarioByIdFirebase(String(horario.id));
//         const cursoActual = await getCursoByIdFirebase(String(curso.id));
//         const cupoOcupadoActual = typeof horarioActual.cupoOcupado === 'number' ? horarioActual.cupoOcupado : 1;
//         const matriculadosActual = typeof cursoActual.matriculados === 'number' ? cursoActual.matriculados : 1;
//         await updateHorarioFirebase(String(horario.id), { cupoOcupado: Math.max(0, cupoOcupadoActual - 1) });
//         await updateCursoFirebase(String(curso.id), { matriculados: Math.max(0, matriculadosActual - 1) });
//       }
//       await refreshUser();
//       await CustomSwal.fire({
//         icon: 'success',
//         title: 'Matrícula eliminada',
//         text: `Se eliminó la matrícula de ${curso.nombre}.`
//       });
//     } catch (err) {
//       console.error('Error al eliminar matrícula:', err);
//       await CustomSwal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'No se pudo eliminar la matrícula. Intenta de nuevo.'
//       });
//     }
//   };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Matricular Materias</h1>
      <p className="text-black text-center mb-4 md:hidden font-bold">
        Créditos disponibles: <span className="text-gray-700 font-bold">{creditosRestantes}</span>
      </p>

      {listaCursos.map((curso) => (
        <div
          key={curso.id}
          className="bg-white rounded shadow p-6 mb-6 flex flex-col md:flex-row md:justify-between border border-gray-200"
        >
          <div>
            <h2 className="text-xl font-bold text-black">
              {curso.nombre} <span className="text-gray-700 font-normal">({curso.codigo})</span>
            </h2>
            <p className="text-gray-700"><span className="font-semibold text-sm">Créditos:</span> <span className="font-normal text-black">{curso.creditos}</span></p>
            <p className="text-gray-700">
              <span className="font-semibold text-sm">Profesor(es):</span>{' '}
              <span className="font-normal text-black">{curso.horarios
                .map(h => profesores.find(p => Number(p.id) === Number(h.profesorId))?.nombre)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(', ')}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-sm">Cupos max:</span> <span className="font-normal text-black">{curso.cuposMax}</span> &nbsp;|&nbsp; <span className="font-semibold text-sm">Matriculados:</span> <span className="font-normal text-black">{curso.matriculados}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col space-y-2 w-full md:w-80">
            {curso.horarios.map(h => {
              const cuposRestantes = curso.cuposMax - h.cupoOcupado;
              const yaMat = user.matriculas.find(m => Number(m.horarioId) == Number(h.id));
              return (
                <div
                  key={h.id}
                  className="border border-gray-200 p-3 rounded flex justify-between items-center bg-[#f6f8f9] w-full md:w-80 transition-shadow duration-200 hover:shadow-lg"
                >
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold text-sm">{h.dia}</span> <span className="font-normal text-gray-800">{h.horaInicio} - {h.horaFin}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-sm">Salón:</span>{' '}
                      <span className="font-normal text-black">{salones.find(s => Number(s.id) === Number(h.salonId))?.codigo}</span>
                    </p>
                    <p><span className="font-semibold text-sm">Cupos:</span> <span className="font-normal text-black">{cuposRestantes}</span></p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={!!yaMat || cuposRestantes <= 0 || loadingMatricula}
                      onClick={(ev) => handleMatricular(ev, curso, h)}
                      className={`px-4 py-2 rounded font-semibold border transition
                        ${yaMat || cuposRestantes <= 0 || loadingMatricula
                          ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white cursor-pointer text-unilibre-red border-unilibre-red hover:bg-unilibre-yellow hover:text-white hover:border-unilibre-yellow'}
                      `}
                    >
                      {loadingMatricula ? 'Procesando...' : yaMat ? 'Ya matriculado' : 'Matricular'}
                    </button>
                    {/* {yaMat && (
                      <button
                        type="button"
                        className="ml-2 p-2 rounded-full border border-red-400 text-red-600 bg-white hover:bg-red-100 transition cursor-pointer"
                        disabled={loadingMatricula}
                        onClick={() => handleEliminarMatricula(curso, h)}
                        title="Eliminar matrícula"
                        aria-label="Eliminar matrícula"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )} */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
