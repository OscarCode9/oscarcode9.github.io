async function getSubscribers() {
  const mysql = require('mysql2/promise');
  const mysqlConnection = require('../config/db');
  try {
    const connection = await mysql.createConnection(mysqlConnection);
    const sql = "SELECT * FROM subscribers";
    const [rows, fields] = await connection.execute(sql);
    
    let subscribers = [];
    let pushSubscription = {};

    rows.forEach(subscribe => {

      const endPoint = subscribe.endPoint;
      const publicKey = subscribe.publicKey;
      const auth = subscribe.auth;

      pushSubscription = {
        endpoint: endPoint,
        keys: {
          p256dh: publicKey,
          auth: auth
        }
      }
      subscribers.push(pushSubscription);

    });

    
    return subscribers;

  } catch (error) {
    console.log('Error in the connection: ', error);
    return error;
  }
}

module.exports = getSubscribers;