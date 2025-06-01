import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import {
  getUsuarioByEmailFirebase,
  addUsuarioFirebase,
  getUsuarioByIdFirebase,
  updateUsuarioFirebase
} from '../api-firebase';

export function useAuth() {
  const { user, setUser, logout, loadingAuth } = useContext(AuthContext);

  // Login usando Firestore
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

  // Registro usando Firestore
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

  // Refrescar usuario desde Firestore
  const refreshUser = async () => {
    if (!user) return;
    try {
      const updated = await getUsuarioByIdFirebase(user.id);
      localStorage.setItem('miAppUsuario', JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch (err) {
      console.error('No se pudo refrescar usuario:', err, 'userId:', user.id, 'typeof userId:', typeof user.id);
      if (err && err.stack) {
        console.error('Stack trace:', err.stack);
      }
      throw err;
    }
  };

  // Actualizar usuario en Firestore
  const updateUser = async (updatedFields) => {
    if (!user) return null;
    await updateUsuarioFirebase(user.id, updatedFields);
    await refreshUser();
  };

  return {
    user,
    login,
    register,
    updateUser,
    refreshUser,
    logout,
    loadingAuth
  };
}
