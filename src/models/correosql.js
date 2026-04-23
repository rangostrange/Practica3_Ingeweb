export const getByEmail = async (email) => {
  const result = await pool
    .request()
    .input('correo', email)
    .query('SELECT * FROM users WHERE correo = @correo');
 
  return result.recordset;  
}