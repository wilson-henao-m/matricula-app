import { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataContext } from '../context/DataContext.js';
import CustomSwal from '../utils/CustomSwal';

export default function Profile() {
  const { user } = useAuth();
  const { error, loading } = useContext(DataContext);
  const [nombre, setNombre] = useState(user.nombre);
  const [password, setPassword] = useState(user.password);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Cargando perfil...</span>
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

  const handleUpdate = (e) => {
    e.preventDefault();
    // Dado que no tenemos un backend real, podrías simplemente actualizar en localStorage
    const updatedUser = { ...user, nombre, password };
    localStorage.setItem('miAppUsuario', JSON.stringify(updatedUser));
    CustomSwal.fire({
      icon: 'success',
      title: 'Datos actualizados',
      text: 'Se han guardado tus cambios en perfil.',
    });
    // Para efectos de demo, no manejamos sincronización con dataJSON
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-10 md:mt-0">
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow border border-gray-200">
        <h2 className="text-xl text-center font-bold mb-4 text-black">Información personal</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm text-gray-700">Nombre completo</label>
          <input
            type="text"
            className="w-full border border-gray-200 px-3 py-2 rounded bg-[#f6f8f9] text-black"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm text-gray-700">Correo electrónico</label>
          <input
            type="email"
            className="w-full border border-gray-200 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-black"
            value={user.email}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm text-gray-700">Carrera</label>
          <input
            type="text"
            className="w-full border border-gray-200 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-black"
            value={user.carrera === 'ingenieria_sistemas' ? 'Ingeniería de Sistemas' : user.carrera}
            disabled
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-sm text-gray-700">Contraseña</label>
          <input
            type="password"
            className="w-full border border-gray-200 px-3 py-2 rounded bg-[#f6f8f9] text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-unilibre-red text-white px-4 py-2 cursor-pointer rounded hover:bg-unilibre-yellow transition font-semibold"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
