const mysql = require('mysql2');

const db = mysql.createPool({
    hostname: 'localhost',
    user: 'root',
    password: 'password',
    database: 'banco_dados',
})

db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Conectado com sucesso com o pool!');
    connection.release(); 
});

db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) throw err;
    console.log(results);
});

module.exports = db;