import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { cursos, loading, error } = useContext(DataContext);
  if (!user) return null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Cargando materias...</span>
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

  // Filtrar materias de la carrera del usuario
  const materias = cursos.filter(c => c.carrera === user.carrera);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Materias Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((materia) => (
          <div
            key={materia.id}
            className="bg-white rounded shadow p-6 border border-gray-200 transition-shadow duration-200 hover:shadow-xl"
          >
            <h2 className="text-lg font-bold text-black mb-2">{materia.nombre}</h2>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Código:</span> <span className="font-normal">{materia.codigo}</span></p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Créditos:</span> <span className="font-normal">{materia.creditos}</span></p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Cupos max:</span> <span className="font-normal">{materia.cuposMax}</span></p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Matriculados:</span> <span className="font-normal">{materia.matriculados}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
