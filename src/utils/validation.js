// Convierte “HH:mm” a entero de minutos
export function horaAMinutos(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

// Valida que un horario esté entre 07:00 y 18:00
export function validarRangoHorario(horaInicio, horaFin) {
  const inicio = horaAMinutos(horaInicio);
  const fin = horaAMinutos(horaFin);
  const min = horaAMinutos('07:00');
  const max = horaAMinutos('18:00');
  if (inicio < min || fin > max || inicio >= fin) {
    return false;
  }
  // Duración entre 60 y 120 min
  const duracion = fin - inicio;
  return duracion >= 60 && duracion <= 120;
}

// Valida choque entre dos franjas en un mismo día
// Devuelve true si chocan
export function chocanHorario(h1Inicio, h1Fin, h2Inicio, h2Fin) {
  const i1 = horaAMinutos(h1Inicio);
  const f1 = horaAMinutos(h1Fin);
  const i2 = horaAMinutos(h2Inicio);
  const f2 = horaAMinutos(h2Fin);
  // Si se traslapan:
  if (!(f1 <= i2 || f2 <= i1)) {
    return true;
  }
  return false;
}

// Revisa si un nuevo bloque (dia, inicio, fin) choca con un array de bloques {dia, horaInicio, horaFin}
export function revisarChoques(bloquesUsuario, dia, horaInicio, horaFin) {
  for (let b of bloquesUsuario) {
    if (b.dia === dia && chocanHorario(b.horaInicio, b.horaFin, horaInicio, horaFin)) {
      return true;
    }
  }
  return false;
}
