const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',   // Replace with your MySQL username
  password: 'MySQL@3166',   // Replace with your MySQL password
  database: 'registration_page'
});
// console.log("yes");

module.exports = pool.promise();
