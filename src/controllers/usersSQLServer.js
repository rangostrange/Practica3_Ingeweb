import { getAllUsers, createUser } from '../models/usersSQLServer.js';
import { validateUser } from '../models/validator.js';


export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    validateUser(req.body);

    const id = await createUser(req.body);

    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input('correo', email)
    .query('SELECT * FROM users WHERE correo = @correo');

  return result.recordset;  
}


const crudSQL = { getUsers, registerUser, findByEmail };
