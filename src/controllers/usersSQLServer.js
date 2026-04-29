import { getAllUsers, createUser,findUserByEmail } from '../models/usersSQLServer.js';
import { validateUser } from '../models/validator.js';
import { getConnection } from '../config/sqlserver.js';
import bcrypt from 'bcrypt'

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const showFormLogin = (req, res) => {
  res.render('pages/login', {
    errorCorreo: null,
    errorPass: null,
    errorGeneral: null,
    correo: ''   // para mantener el valor en el input
  });
};

export const showFormRegister = async (req, res) => {
    res.render('pages/registro');
};

export const showPrincipal = async(req,res) => {
     if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('pages/principal', {
    nombre: req.session.user.nombre
  });
};


///procesos

export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await findUserByEmail(correo);

    if (!user) {
      return res.send("Usuario no existe");
    }

    const match = await bcrypt.compare(contrasena, user.Contraseña);

    if (!match) {
      return res.send("Contraseña incorrecta");
    }

    req.session.user = {
      id: user.Id,
      nombre: user.Nombre,
      correo: user.Correo
    };

    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    res.send("Error en login");
  }
};


// Dashboard protegido
export const showDashboard = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('pages/bienvenida', {
    nombre: req.session.user.nombre
  });
};

// Logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};



export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
//registrar usuario
export const registerUser = async (req, res) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc } = req.body;

  try {
    if (!nombre || !correo || !contrasena) {
      return res.send("Datos incompletos");
    }

    const existe = await findUserByEmail(correo);

    if (existe) {
      return res.send("El correo ya está registrado");
    }

    const hashPass = await bcrypt.hash(contrasena, 10);
      const hashResp = await bcrypt.hash(respuestarc, 10);

    await createUser({
      nombre,
      correo,
      contrasena: hashPass,
      preguntarc,
      respuestarc: hashResp
    });

    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    res.send("Error en el servidor");
  }
};

export const showRecovery = (req, res) => {
  res.render('pages/recuperar');
};



//recuperar contraseña
export const recoveryHandler = async (req, res) => {
  const { accion, correo, respuesta, nuevaContrasena } = req.body;

  try {
    console.log("ACCION:", accion);

    // 🔹 PASO 1
    if (accion === "pregunta") {
      const user = await findUserByEmail(correo);

      if (!user) {
        return res.render('pages/recuperar', {
          error: "Correo no encontrado",
          correo: '',
          pregunta: ''
        });
      }

      return res.render('pages/recuperar', {
        correo,
        pregunta: user.Pregunta_rec,
        error: null
      });
    }

    // 🔹 PASO 2
    if (accion === "reset") {

      if (!correo || !respuesta || !nuevaContrasena) {
        return res.render('pages/recuperar', {
          error: "Datos incompletos",
          correo,
          pregunta: ''
        });
      }

      const user = await findUserByEmail(correo);

      if (!user) {
        return res.render('pages/recuperar', {
          error: "Usuario no encontrado",
          correo: '',
          pregunta: ''
        });
      }

      console.log("USER:", user);

      const match = await bcrypt.compare(respuesta, user.Resp_rec);

      if (!match) {
        return res.render('pages/recuperar', {
          correo,
          pregunta: user.Pregunta_rec,
          error: "Respuesta incorrecta"
        });
      }

      const hash = await bcrypt.hash(nuevaContrasena, 10);

      const pool = await getConnection();

      await pool.request()
        .input('correo', correo)
        .input('contrasena', hash)
        .query(`
          UPDATE users 
          SET [Contraseña] = @contrasena 
          WHERE Correo = @correo
        `);

      console.log("CONTRASEÑA ACTUALIZADA");

      return res.redirect('/login');
    }

  } catch (error) {
    console.error("ERROR REAL:", error);
    res.render('pages/recuperar', {
      error: "Error del servidor",
      correo: '',
      pregunta: ''
    });
  }
};

const crudSQL = { showFormRegister, loginUser, registerUser,showDashboard,logout,showFormLogin,showRecovery,
    showPrincipal,recoveryHandler};
