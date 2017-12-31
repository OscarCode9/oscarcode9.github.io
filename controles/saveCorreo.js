const mysql = require('mysql2/promise');


async function saveCorreo(datos){

  const myquery = `insert into Emails values (null,'${datos.requerim}', '${datos.email}', '${datos.nombre}');`;
  
  try {

    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    conn.connect();
    const [rows, fields] = await conn.execute(myquery);
    conn.end();
    return rows.insertId;
    
  } catch (error) {

    conn.end();
    return false;
    
  };


}


module.exports = saveCorreo;