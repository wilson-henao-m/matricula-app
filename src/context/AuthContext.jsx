import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext.js';
import {
  getUsuarioByEmailFirebase,
  addUsuarioFirebase,
  getUsuarioByIdFirebase,
  updateUsuarioFirebase
} from '../api-firebase';
import Swal from 'sweetalert2';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Al montar, vemos si hay un usuario “guardado” en localStorage
    const stored = localStorage.getItem('miAppUsuario');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoadingAuth(false);
  }, []);

  // 1. Login
  const login = async (email, password) => {
    try {
      const found = await getUsuarioByEmailFirebase(email);
      if (found && found.password === password) {
        setUser(found);
        localStorage.setItem('miAppUsuario', JSON.stringify(found));
        return { success: true };
      } else {
        return { success: false, message: 'Credenciales inválidas.' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Error al intentar iniciar sesión.' };
    }
  };

  // 2. Register
  const register = async ({ nombre, email, password, carrera }) => {
    try {
      const existing = await getUsuarioByEmailFirebase(email);
      if (existing) {
        return { success: false, message: 'Ya existe un usuario con ese correo.' };
      }
      const userData = {
        nombre,
        email,
        password,
        rol: 'estudiante',
        carrera,
        creditosMatriculados: 0,
        matriculas: []
      };
      const newId = await addUsuarioFirebase(userData);
      const newUser = { id: newId, ...userData };
      setUser(newUser);
      localStorage.setItem('miAppUsuario', JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Error al registrarse.' };
    }
  };

  // 3. Logout
  const logout = () => {
    Swal.fire({
      title: '¿Seguro que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setUser(null);
        localStorage.removeItem('miAppUsuario');
      }
    });
  };

  // 4. Una función para refrescar los datos del usuario (por si cambian en el servidor)
  const refreshUser = async () => {
    if (!user) return;
    try {
      const updated = await getUsuarioByIdFirebase(user.id);
      setUser(updated);
      localStorage.setItem('miAppUsuario', JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('No se pudo refrescar usuario:', err);
      throw err;
    }
  };

  // 5. Actualizar usuario (opcional, para exponerlo en el contexto)
  const updateUser = async (updatedFields) => {
    if (!user) return null;
    await updateUsuarioFirebase(user.id, updatedFields);
    await refreshUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, refreshUser, updateUser, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
