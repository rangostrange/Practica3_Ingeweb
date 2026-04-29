/*peticion de la API  a la BD con fetch
    fetch(ruta).then(response || object).then(data)   //permite acceder a las respuestas encadenadas
*/

/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 * 
 * Form
 *   ruta
 *     controlador (procesa petición)
 *       servicio (logica de negocio) 
 *         modelo
 *           data (JSON)
 * 
 
 */

import bcrypt from 'bcrypt';
import {writeUser, findUserByEmail} from "../models/usersSQLServer.js"

export const processForm = async (datos) => {
  const { nombre, contrasena, preguntarc, respuestarc, correo } = datos;
  const errores = {};

  /**
   * Validaciones adicionales de los datos a registrar
   * */
  if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
    errores.nombre = "El nombre solo debe contener letras";
  }
  if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
    errores.correo = "Correo inválido";
  }
  if (!contrasena || contrasena.length < 6) {
    errores.contrasena = "La contraseña debe tener al menos 6 caracteres";
  }
  if (!respuestarc || respuestarc.length < 2) {
    errores.respuestarc = "Respuesta de seguridad inválida";
  }

  // Si hay errores de formato, cortamos aquí
  if (Object.keys(errores).length > 0) {
    return { success: false, errors: errores };
  }

  try {
    /**
     * Verificación si el correo a r...egistrar ya existe en el archivo
     */
      
    const usuarioExiste = await findUserByEmail(correo);

    if (usuarioExiste) {
      return {
        success: false,
        errors: { correo: "Este correo electrónico ya está registrado" }
      };
    }

    /**
     * Proceso de registro solamente si el correo no existe previamiente
    */    
    const saltRounds = 12;
    const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);
    const respuestarcHash = await bcrypt.hash(respuestarc, saltRounds);

    const datosProcesados = {
      nombre,
      contrasena: contrasenaHash,
      preguntarc,
      respuestarc: respuestarcHash,
      correo,
      fecha: new Date().toISOString() // Formato de fecha más estándar
    };

    // Se guarda en el archivo
    await writeUser(datosProcesados);
    
    // IMPORTANTE: Por seguridad, no devolvemos los hashes al frontend
    const { contrasena: c, respuestarc: r, dataSegura } = datosProcesados;

    return {
      success: true,
      errors: null,
      data: dataSegura 
    };

  } catch (err) {
    console.error("Error en el proceso:", err.message);
    return {
      success: false,
      errors: { general: "Error interno del servidor" }
    };
  }
};


export const validateUser = async (correo, contrasena) => {
     try {
      /*const user = await findUserByEmail(correo);      */
      /**
       * Petición a la API de la BD
       */

      try {
        const response = await fetch(`http://localhost:5000/api/sqlserver/getByEmail/${correo}`);
        console.log(response)
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        const user = await response.json();
        console.log(user);
        
    } catch (error) {
        console.error("Hubo un problema:", error.message);
    }
      
     
      if (!user) {
          return ({
              success: false,
              errors: { correo: 'Usuario no encontrado' }              
          }); 
      }
      
      const match = await bcrypt.compare(contrasena, user.contrasena);
      
      if (!match) {
        return ({
          success: false,
          errors: { contrasena: 'Contraseña incorrecta' }
        });
      }

      return ({
        success: true,
        errors: null,
        data: user
      });
    } catch(err){
       console.error(err);
       return ({
          success: false,
          errors: { general: 'Error del servidor' }
       });
    }  

};