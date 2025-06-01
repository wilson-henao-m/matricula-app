import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataContext } from '../context/DataContext.js';

// Días de la semana que nos interesan
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

// Paleta de colores para las materias (se asigna un color distinto por cursoId)
const coloresPorCurso = {};
function getColor(cursoId) {
  if (coloresPorCurso[cursoId]) return coloresPorCurso[cursoId];
  const paleta = [
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-indigo-400',
    'bg-teal-400'
  ];
  const idx = Object.keys(coloresPorCurso).length % paleta.length;
  coloresPorCurso[cursoId] = paleta[idx];
  return paleta[idx];
}

// Convierte "HH:mm" a minutos desde medianoche (ej. "07:30" -> 450)
function horaAMinutos(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

// Definimos los límites del calendario: 07:00 (420') a 18:00 (1080')
const MIN_MINUTOS = horaAMinutos('07:00');
const MAX_MINUTOS = horaAMinutos('18:00');

// Altura total en píxeles de la grilla (11 franjas de 1 hora cada una * 64px)
// Puedes ajustar si cambias "h-16" por otra medida de Tailwind
const TOTAL_HORAS = 14;
const ALTO_POR_HORA = 64; // h-16 en Tailwind equivale a 4rem = 64px
const ALTURA_HEADER = 48; // h-12 en Tailwind equivale a 3rem = 48px
const ALTURA_TOTAL = TOTAL_HORAS * ALTO_POR_HORA; // 11 * 64 = 704px

export default function Horario() {
  const { user, loadingAuth } = useAuth();
  const { cursos, horarios, profesores, salones, loading, error } = useContext(DataContext);

  const [bloques, setBloques] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const cargarBloques = () => {
      if (!user || loadingAuth || loading || error) {
        setBloques([]);
        setLocalLoading(true);
        return;
      }
      if (!cursos.length || !horarios.length) {
        // Aún no llegaron datos de DataContext
        setBloques([]);
        setLocalLoading(true);
        return;
      }

      // 2. Recorremos cada matrícula del usuario
      const temp = [];
      user.matriculas.forEach((mat) => {
        const { cursoId, horarioId } = mat;
        // 2a. Buscamos el curso correspondiente
        const curso = cursos.find((c) => Number(c.id) === Number(cursoId));
        if (!curso) return; // salteamos si no existe
        // 2b. Buscamos el horario en la colección "horarios" aplanada
        const horario = horarios.find((h) => Number(h.id) === Number(horarioId));
        if (!horario) return;
        // 2c. Asignamos un color consistente según el cursoId
        const colorClase = getColor(cursoId);

        // 2d. Buscamos profesor y salón para mostrar en tooltip o detalles
        const nombreProfesor = profesores.find((p) => Number(p.id) === Number(horario.profesorId))?.nombre || '';
        const codigoSalon = salones.find((s) => Number(s.id) === Number(horario.salonId))?.codigo || '';

        // 2e. Armamos el objeto de bloque para renderizar
        temp.push({
          cursoId,
          codigo: curso.codigo,
          dia: horario.dia,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          salon: codigoSalon,
          profesor: nombreProfesor,
          color: colorClase
        });
      });

      setBloques(temp);
      setLocalLoading(false);
    };

    cargarBloques();
  }, [user, loadingAuth, cursos, horarios, profesores, salones, loading, error]);

  // Mientras cargan datos, mostramos un spinner o mensaje
  if (loading || localLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Cargando horario...</span>
      </div>
    );
  }

  // Si hay un error, mostramos mensaje institucional
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4 text-unilibre-red">Error de conexión</h1>
        <p className="text-gray-700 mb-2">{error}</p>
        <p className="text-gray-500">Por favor, verifica tu conexión o intenta más tarde.</p>
      </div>
    );
  }

  // Si el usuario no tiene matrículas, mostramos un mensaje
  if (!user?.matriculas?.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-600">
        <h1 className="text-2xl font-bold mb-6 text-black">Horario</h1>
        <p>No tienes materias matriculadas aún.</p>
        <p className="mt-2">Ve a la sección de <a href="/dashboard/matricula" className="text-unilibre-red hover:underline">Matricular Materias</a> para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Horario</h1>
      <div className="grid grid-cols-6 gap-2">
        {/* Primera columna: etiquetas de hora */}
        <div className="flex flex-col">
          <div className="h-12 border-b"></div>
          {Array.from({ length: TOTAL_HORAS }).map((_, idx) => {
            const hora = 7 + idx; // 7, 8, ..., 17
            return (
              <div
                key={idx}
                className="h-16 border-b border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500"
              >
                {hora}:00
              </div>
            );
          })}
        </div>

        {/* Columnas para cada día */}
        {diasSemana.map((dia) => (
          <div key={dia} className="border-l border-gray-200 relative">
            {/* Encabezado de día */}
            <div className="h-12 border-b flex items-center justify-center bg-gray-100 font-medium">
              {dia}
            </div>
            {/* Celdas vacías (para la grilla de fondo) */}
            {Array.from({ length: TOTAL_HORAS }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 border-b border-gray-200"
              ></div>
            ))}

            {/* Superponer los bloques de clase */}
            {bloques
              .filter((b) => b.dia === dia)
              .map((b, idx) => {
                const inicioMin = horaAMinutos(b.horaInicio);
                const finMin = horaAMinutos(b.horaFin);
                // Sumar ALTURA_HEADER para alinear con la grilla
                const topPixeles = ALTURA_HEADER + (inicioMin - MIN_MINUTOS) * (ALTO_POR_HORA / 60);
                const alturaPixeles = (finMin - inicioMin) * (ALTO_POR_HORA / 60);
                return (
                  <div
                    key={idx}
                    className={`absolute left-0 right-0 mx-1 rounded text-white p-1 text-xs overflow-hidden ${b.color}`}
                    style={{
                      top: topPixeles,
                      height: alturaPixeles
                    }}
                  >
                    <p className="font-bold">{b.codigo}</p>
                    <p>
                      {b.horaInicio} - {b.horaFin}
                    </p>
                    <p className="text-[10px]">{b.salon}</p>
                    <p className="text-[10px] italic">{b.profesor}</p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
