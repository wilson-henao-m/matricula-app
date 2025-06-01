import { useEffect, useState } from 'react';
import { DataContext } from './DataContext.js';
import {
  getCursosFirebase,
  getHorariosFirebase,
  getProfesoresFirebase,
  getSalonesFirebase,
  getCursoByIdFirebase,
  updateCursoFirebase,
  getHorarioByIdFirebase,
  updateHorarioFirebase
} from '../api-firebase';

export function DataProvider({ children }) {
  const [cursos, setCursos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const listaCursos = await getCursosFirebase();
        setCursos(Array.isArray(listaCursos) ? listaCursos : []);
        const listaHorarios = await getHorariosFirebase();
        setHorarios(Array.isArray(listaHorarios) ? listaHorarios : []);
        const listaProfesores = await getProfesoresFirebase();
        setProfesores(Array.isArray(listaProfesores) ? listaProfesores : []);
        const listaSalones = await getSalonesFirebase();
        setSalones(Array.isArray(listaSalones) ? listaSalones : []);
      } catch (err) {
        setError('No se pudo conectar con el servidor de datos. Intenta más tarde.');
        setCursos([]);
        setHorarios([]);
        setProfesores([]);
        setSalones([]);
        console.error('Error al cargar datos iniciales:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const matricularUsuario = async ({ cursoId, horarioId }) => {
    try {
      // 1. Obtener datos del curso y horario actualizado (desde Firestore)
      const curso = await getCursoByIdFirebase(String(cursoId));
      if (!curso) {
        return { success: false, message: 'Curso no encontrado.' };
      }
      const horario = await getHorarioByIdFirebase(String(horarioId));
      if (!horario) {
        return { success: false, message: 'Horario no encontrado.' };
      }
      // 2. Verificar cupos disponibles
      if (horario.cupoOcupado >= curso.cuposMax) {
        return { success: false, message: 'No hay cupos disponibles en este horario.' };
      }
      // 3. Actualizar cupoOcupado del horario
      await updateHorarioFirebase(String(horarioId), {
        cupoOcupado: Number(horario.cupoOcupado) + 1
      });
      // 4. Actualizar matriculados del curso
      await updateCursoFirebase(String(cursoId), {
        matriculados: Number(curso.matriculados) + 1
      });
      // 5. Refrescar datos locales
      const listaCursos = await getCursosFirebase();
      setCursos(listaCursos);
      const listaHorarios = await getHorariosFirebase();
      setHorarios(listaHorarios);
      return { success: true };
    } catch (err) {
      console.error('Error al matricular usuario:', err);
      return { success: false, message: 'Ocurrió un error al matricular.' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        cursos,
        horarios,
        profesores,
        salones,
        loading,
        error,
        matricularUsuario
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
