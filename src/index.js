/* 

API arquitectura básica
consiste en capas
  Models - Operaciones CRUD en la tabla users (select, insert)
  Routes - Cada ruta accede a una operación en la BD
  Controllers - Gestiona la peticion  y determina que operacion
                debe ejecutarse y retrona los datos
  
  Config -  Configurar las conexiones a las BD
            MySQL y SQLServer
  
  
  Métodos HTTP: GET | POST | PUT modificacion | DELETE ->metodos http 

  Requerimientos

  Conector a BD - MySQL y SQLServer
    -Nombre y dirección del servidor
  extensión configurable Thunderclient ->permite realizar peticiones a un servidor
*/

import express from 'express';
import dotenv from 'dotenv';
import usersRoutes from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', usersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});