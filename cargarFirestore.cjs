const admin = require('firebase-admin');
const fs = require('fs');

// Reemplaza la ruta por la de tu archivo de credenciales
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Lee tu archivo db.json
const data = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

// Función para cargar una colección
async function cargarColeccion(nombre, docs) {
  for (const docu of docs) {
    const id = docu.id ? String(docu.id) : undefined;
    const ref = id ? db.collection(nombre).doc(id) : db.collection(nombre).doc();
    await ref.set(docu);
    console.log(`Agregado a ${nombre}:`, id || ref.id);
  }
}

async function main() {
  if (data.usuarios) await cargarColeccion('usuarios', data.usuarios);
  if (data.cursos) await cargarColeccion('cursos', data.cursos);
  if (data.horarios) await cargarColeccion('horarios', data.horarios);
  if (data.profesores) await cargarColeccion('profesores', data.profesores);
  if (data.salones) await cargarColeccion('salones', data.salones);
  console.log('Carga inicial completada.');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
