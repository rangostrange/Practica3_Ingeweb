
//validacion a nivel de API antes de insertarlo a la BD
export const validateUser = (user) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc } = user;

  if (!nombre || nombre.length < 2) {
    throw new Error('Nombre inválido');
  }

  if (!correo || !correo.includes('@')) {
    throw new Error('Correo inválido');
  }

  if (!contrasena || contrasena.length < 20) {
    throw new Error('Hash de contraseña inválido');
  }

  if (!preguntarc) {
    throw new Error('Pregunta de recuperación requerida');
  }

  if (!respuestarc) {
    throw new Error('Respuesta de recuperación requerida');
  }
};