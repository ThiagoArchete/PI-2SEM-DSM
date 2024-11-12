const express = require('express');
const app = express();
const mysql = require('mysql2');
const port = 3000;

const db = mysql.createPool({
    hostname: 'localhost',
    user: 'root',
    password: 'password',
    database: 'banco_dados',
})


app.listen(port, () => {
    console.log('rodando na porta 3000');
});