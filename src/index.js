import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';

import apiRoutes from './routes/apiroutes.js';
import webRoutes from './routes/webroutes.js';

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

//   EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// MIDDLEWARES 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// LOGIN
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));


//  RUTAS
app.use('/api', apiRoutes);
app.use('/', webRoutes);


//  RUTA RAÍZ
app.get('/', (req, res) => {
  res.redirect('/login');
});

//  ERRORES
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Error del servidor");
});

//  SERVIDOR
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});