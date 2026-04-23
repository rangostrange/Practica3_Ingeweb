import { mysqlPool } from '../config/mysql.js';

// MySQL
export const getAllUsers = async () => {
  const [rows] = await mysqlPool.query('SELECT * FROM users');
  return rows;
};


export const createUser = async (user) => {
  const { nombre, correo, contrasena, preguntarc, Resp_rec } = user;

  const [result] = await mysqlPool.query(
    `INSERT INTO users (nombre, correo, contrasena, preguntarc, Resp_rec)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, correo, contrasena, preguntarc, Resp_rec]
  );

  return result.insertId;
};

