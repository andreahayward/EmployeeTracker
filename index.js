require('dotenv').config()
const inquirer = require("inquirer");
//const dbManage = require("./dbManage");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.SQL_PASSWORD,
    database: "employee_db"

});