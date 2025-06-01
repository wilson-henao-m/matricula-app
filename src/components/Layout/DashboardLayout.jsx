import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Materias', icon: '🏠' },
    { to: '/dashboard/matricula', label: 'Matricular', icon: '📝' },
    { to: '/dashboard/horario', label: 'Ver Horario', icon: '📅' },
    { to: '/dashboard/profile', label: 'Perfil', icon: '👤' },
  ];

  // Cálculo de créditos y materias
  const creditosRestantes = 18 - (user?.creditosMatriculados || 0);
  const materiasMatriculadas = user?.matriculas?.length || 0;

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Botón hamburguesa solo en mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-0 bg-white text-unilibre-red p-2 rounded shadow-lg focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Overlay para sombreado y cierre al hacer click fuera */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 opacity-50 z-10 md:hidden animate-fadein"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg flex flex-col p-6 min-h-screen fixed left-0 top-0 bottom-0 z-20 w-4/5 max-w-xs md:w-64 md:min-h-screen md:translate-x-0 md:fixed md:left-0 md:top-0 md:bottom-0 transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ willChange: 'transform' }}
      >
        {/* Botón cerrar sidebar en mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-unilibre-red text-2xl"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 text-black">Bienvenido</h1>
          <p className="text-lg font-semibold text-black">{user?.nombre}</p>
          <div className="mt-6 space-y-2">
            <div className="bg-[#f6f8f9] rounded p-3 flex flex-col items-start border border-gray-200 transition-shadow duration-200 hover:shadow-xl">
              <span className="text-xs font-semibold text-gray-700">Créditos disponibles</span>
              <span className="text-base font-normal text-black">{creditosRestantes}</span>
            </div>
            <div className="bg-[#f6f8f9] rounded p-3 flex flex-col items-start border border-gray-200 transition-shadow duration-200 hover:shadow-xl">
              <span className="text-xs font-semibold text-gray-700">Materias matriculadas</span>
              <span className="text-base font-normal text-black">{materiasMatriculadas}</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-4 py-2 rounded transition font-medium text-black hover:bg-[#f6f8f9] hover:text-unilibre-red ${location.pathname === item.to ? 'bg-[#f6f8f9] text-unilibre-red font-bold' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="bg-unilibre-red text-white py-2 rounded hover:bg-unilibre-yellow transition cursor-pointer w-full mb-2 px-6 font-semibold text-base"
        >
          Cerrar sesión
        </button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-4 md:p-10 md:ml-64 ml-0 transition-all duration-200">
        <Outlet />
      </main>
    </div>
  );
}
