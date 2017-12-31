const mysql = require('mysql2/promise');

async function postExist(postName) {
  const myquery = `select * from Post where namePost like '${postName}';`;
  console.log(typeof (postName));
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    conn.connect();
    const [rows, fields] = await conn.execute(myquery);
    if (rows.length === 0) {
      conn.end();
      return true;
    }

    if (rows.length > 0) {
      conn.end();
      return false;
    }

  } catch (error) {
    return true;
  }
}


module.exports = { postExist };