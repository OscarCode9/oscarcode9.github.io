
async function deleteEmailByid(id) {
    const mysql = require('mysql2/promise');
    const mysqlConfig = require('../config/db');

    try {
        const conn = await mysql.createConnection(mysqlConfig);
        const sql = "DELETE FROM Emails WHERE ID = ?";
        const [rows, fields] = await conn.execute(sql, [id]);
        console.log(rows, fields);
        return rows;
    } catch (error) {
        return error;
    }
}

module.exports = deleteEmailByid;