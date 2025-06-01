import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import unilibreLogo from '../../assets/unilibre-logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#f6f8f9]">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-full max-w-3xl overflow-hidden border border-gray-200">
        {/* Left: University branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-unilibre-red to-[#a80e12] text-white px-12 py-14 w-1/2">
          <img
            src={unilibreLogo}
            alt="Universidad"
            className="w-28 h-28 mb-8 rounded-full shadow-lg border-4 border-white bg-white"
          />
          <h1 className="text-4xl font-extrabold mb-3 tracking-wide drop-shadow">Universidad</h1>
          <p className="text-lg font-medium opacity-90">Portal de Matrícula</p>
        </div>
        {/* Right: Login form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-8 md:p-10 flex flex-col gap-7 justify-center bg-white"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-2">Iniciar Sesión</h2>
          <p className="text-center text-gray-700 mb-4 text-sm">
            Ingresa tus credenciales institucionales para acceder al sistema.
          </p>
          {error && (
            <p className="bg-red-100 text-unilibre-red px-3 py-2 rounded text-sm text-center border border-red-300">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-semibold">Correo institucional</label>
            <input
              type="email"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-unilibre-red bg-[#f6f8f9] text-black transition placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="usuario@libre.co"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-semibold">Contraseña</label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-unilibre-red bg-[#f6f8f9] text-black transition placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-unilibre-red text-white py-3 rounded-lg cursor-pointer font-bold hover:bg-unilibre-yellow transition shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Entrar
          </button>
          <p className="text-xs text-gray-700 text-center mt-2">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-unilibre-red hover:underline font-semibold">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}