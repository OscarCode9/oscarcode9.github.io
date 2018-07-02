async function getEmails() {
    const mysql = require('mysql2/promise');
    const mysqlConnection = require('../config/db');
    try {
      const connection = await mysql.createConnection(mysqlConnection);
      const sql = "SELECT * FROM Emails";
      
      const [rows, fields] = await connection.execute(sql);
      
       let Emails = rows;
       
       console.log(Emails);
       connection.close();
       return Emails;
  
    } catch (error) {
      console.log('Error in the connection: ', error);
      return error;
    }
  }
  
  module.exports = getEmails;