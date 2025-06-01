const API_BASE_URL = "http://localhost:4000"; // Cambia esto por la URL de tu JSON-Server

/**
 * Auth APIs
 */

// 1. Obtener un usuario por email y password (login)
export async function loginApi(email, password) {
  // JSON-Server no soporta búsquedas combinadas con AND directamente en la URL,
  // pero sí permite /usuarios?email=xxx&password=yyy
  const url = `${API_BASE_URL}/usuarios?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Error al consultar usuarios');
  const data = await resp.json();
  // data es un array; si coincide, debe tener al menos 1 elemento:
  if (Array.isArray(data) && data.length > 0) {
    return data[0]; // devolvemos el primer usuario que coincida
  } else {
    return null;
  }
}

// 2. Registrar un usuario nuevo
export async function registerApi({ nombre, email, password, carrera }) {
  // Primero verificamos que no exista otro con el mismo email:
  const checkUrl = `${API_BASE_URL}/usuarios?email=${encodeURIComponent(email)}`;
  const checkResp = await fetch(checkUrl);
  if (!checkResp.ok) throw new Error('Error al verificar usuario');
  const existing = await checkResp.json();
  if (existing.length > 0) {
    // Ya hay un usuario con ese email
    return { success: false, message: 'Ya existe un usuario con ese correo.' };
  }

  // Si no existe, lo creamos con POST
  const postUrl = `${API_BASE_URL}/usuarios`;
  const body = {
    nombre,
    email,
    password,
    rol: 'estudiante',
    carrera,
    creditosMatriculados: 0,
    matriculas: []
  };
  const createResp = await fetch(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!createResp.ok) {
    const errTxt = await createResp.text();
    throw new Error(`Error al crear usuario: ${errTxt}`);
  }
  const newUser = await createResp.json();
  return { success: true, user: newUser };
}

// 3. Obtener un usuario completo por ID
export async function getUserByIdApi(userId) {
  const url = `${API_BASE_URL}/usuarios/${String(userId)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Error al obtener usuario');
  return resp.json();
}

// 4. Actualizar datos de un usuario (ej. nombre, password, créditos, array matriculas, etc.)
export async function updateUserApi(userId, updatedFields) {
  const url = `${API_BASE_URL}/usuarios/${String(userId)}`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields)
  });
  if (!resp.ok) {
    const errTxt = await resp.text();
    throw new Error(`Error al actualizar usuario: ${errTxt}`);
  }
  return resp.json();
}

/**
 * Cursos y Horarios APIs
 */

// 5. Obtener lista de todos los cursos (posiblemente filtrados por carrera)
export async function getCursosApi(carrera = null) {
  let url = `${API_BASE_URL}/cursos`;
  if (carrera) {
    url += `?carrera=${encodeURIComponent(carrera)}`;
  }
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Error al obtener cursos');
  return resp.json();
}

// 6. Obtener un curso por su ID
export async function getCursoByIdApi(cursoId) {
  const url = `${API_BASE_URL}/cursos/${String(cursoId)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Error al obtener curso');
  return resp.json();
}

// 7. Actualizar campos de un curso (por ejemplo matriculados, arreglo horarios, etc.)
export async function updateCursoApi(cursoId, updatedFields) {
  const url = API_BASE_URL + '/cursos/' + String(cursoId);
  try {
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
    if (!resp.ok) {
      const errTxt = await resp.text();
      throw new Error('Error al actualizar curso: ' + errTxt);
    }
    return resp.json();
  } catch (err) {
    console.error('[updateCursoApi] Error:', err, 'url:', url, 'body:', updatedFields, 'typeof cursoId:', typeof cursoId, 'typeof updatedFields:', typeof updatedFields);
    throw err;
  }
}

// 8. Obtener todos los horarios (aplano todos los horarios de todos los cursos)
export async function getHorariosApi() {
  const url = `${API_BASE_URL}/horarios`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Error al obtener horarios');
  return resp.json();
}

// 9. Obtener un horario por su ID
export async function getHorarioByIdApi(horarioId) {
  const url = `${API_BASE_URL}/horarios/${String(horarioId)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Error al obtener horario');
  return resp.json();
}

// 10. Actualizar un horario (p. ej. cupoOcupado)
export async function updateHorarioApi(horarioId, updatedFields) {
  const url = `${API_BASE_URL}/horarios/${String(horarioId)}`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields)
  });
  if (!resp.ok) {
    const errTxt = await resp.text();
    throw new Error(`Error al actualizar horario: ${errTxt}`);
  }
  return resp.json();
}
