import { db } from './firebase';
import {
  collection, doc, getDoc, getDocs, updateDoc, addDoc, query, where
} from 'firebase/firestore';

// Obtener todos los cursos
export async function getCursosFirebase() {
  const cursosCol = collection(db, 'cursos');
  const snapshot = await getDocs(cursosCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener un curso por ID
export async function getCursoByIdFirebase(id) {
  const ref = doc(db, 'cursos', id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Actualizar curso (ej: matriculados)
export async function updateCursoFirebase(id, data) {
  const ref = doc(db, 'cursos', id);
  await updateDoc(ref, data);
}

// Obtener todos los usuarios
export async function getUsuariosFirebase() {
  const usuariosCol = collection(db, 'usuarios');
  const snapshot = await getDocs(usuariosCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener usuario por ID
export async function getUsuarioByIdFirebase(id) {
  const ref = doc(db, 'usuarios', id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Obtener usuario por email (login)
export async function getUsuarioByEmailFirebase(email) {
  const usuariosCol = collection(db, 'usuarios');
  const q = query(usuariosCol, where('email', '==', email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

// Registrar usuario nuevo
export async function addUsuarioFirebase(data) {
  const usuariosCol = collection(db, 'usuarios');
  const docRef = await addDoc(usuariosCol, data);
  return docRef.id;
}

// Actualizar usuario
export async function updateUsuarioFirebase(id, data) {
  const ref = doc(db, 'usuarios', id);
  await updateDoc(ref, data);
}

// HORARIOS
export async function getHorariosFirebase() {
  const horariosCol = collection(db, 'horarios');
  const snapshot = await getDocs(horariosCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
export async function getHorarioByIdFirebase(id) {
  const ref = doc(db, 'horarios', id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function updateHorarioFirebase(id, data) {
  const ref = doc(db, 'horarios', id);
  await updateDoc(ref, data);
}

// PROFESORES
export async function getProfesoresFirebase() {
  const profesoresCol = collection(db, 'profesores');
  const snapshot = await getDocs(profesoresCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// SALONES
export async function getSalonesFirebase() {
  const salonesCol = collection(db, 'salones');
  const snapshot = await getDocs(salonesCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
