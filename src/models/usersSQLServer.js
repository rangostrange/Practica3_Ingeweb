import { getConnection } from '../config/sqlserver.js';

// SQL Server
export const getAllUsers = async () => {  
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM users');
    return result.recordset;  
};

export const createUser = async (user) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc } = user;

  const pool = await getConnection();

const result = await pool.request()
  .input('Nombre', nombre)
  .input('Correo', correo)
  .input('Contrasena', contrasena)
  .input('Pregunta_rec', preguntarc)
  .input('Resp_rec', respuestarc)
  .query(`
    INSERT INTO users ([Nombre], [Correo], [Contraseña], [Pregunta_rec], [Resp_rec])
    VALUES (@Nombre, @Correo, @Contrasena, @Pregunta_rec, @Resp_rec);

    SELECT SCOPE_IDENTITY() AS id;
  `);
  
  return result.recordset[0].id;
};