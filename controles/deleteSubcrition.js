const mysql = require('mysql2/promise');
const mysqlConnection = require('../config/db');

async function deleteSubcrition(endpoint) {
  const sql = "DELETE  FROM subscribers WHERE endPoint = ? ";
  try {
    const connection = await mysql.createConnection(mysqlConnection);
    const [rows, fields] = await connection.execute(sql, [endpoint]);
    return rows;

  } catch (error) {
    console.log('Error when te server tried to delete: ', error);
    return error;
  }
}

module.exports = deleteSubcrition;

