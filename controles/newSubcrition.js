const mysql = require('mysql2/promise');
const mysqlConnection = require('../config/db');

const newSubcrition = async (endPoint, publicKey, auth) => {
  try {
    const connection = await mysql.createConnection(mysqlConnection);
    const sql = "INSERT INTO `subscribers` (`idSubscriber`,`endPoint`,`publicKey`,`auth`) VALUES (null,?,?,?)";
    try {
      const [rows, fields] = await connection.execute(sql, [endPoint, publicKey, auth]);
      console.log('Rows', rows);
      return rows;
    } catch (error) {
      console.log('Error when the server tried to execute sql statement: ', error);
      return error;
    }
  } catch (error) {
    console.log('Error in the connection: ', error);
    return error;
  }
}

module.exports = newSubcrition;


