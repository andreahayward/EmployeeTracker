const inq = require("inquirer");
const mysql = require("mysql");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Fall2020!!",
    database: "employee_trackerSumm_db"
 });

 connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
 });

 const questions = [
    {
       name: "startingQuestion",
       type: "list",
       message: "Select An Action",
       choices: [
          "Add departments",
          "Add roles",
          "Add employees",
          "View departments",
          "View roles",
          "View employees",
          "Update employee roles",
          "End program"
       ]
    },
    //add departments
    {
       name: "departmentName",
       type: "input",
       message: "Enter the Department Name"
    }
 ];

 function runProgram() {
    inq.prompt(questions[0]).then(function(res) {
       switch (res.startingQuestion) {
          case "Add departments":
             addDepartments();
             break;
          case "Add roles":
             addRoles();
             break;
          case "Add employees":
             addEmployees();
             break;
          case "View departments":
             viewDepartments();
             break;
          case "View roles":
             viewRoles();
             break;
          case "View employees":
             viewEmployees();
             break;
          case "Update employee roles":
             updateEmployeeRole();
             break;
          case "End program":
             connection.end();
       }
    });
 }

 function addDepartments() {
    inq.prompt(questions[1]).then(function(res) {
       let name = res.departmentName;
       let query = "INSERT INTO departments SET ?";
       connection.query(query, { dept_name: name }, function(err) {
          if (err) throw err;
          runProgram();
       });
    });
 }

 function viewDepartments() {
    let query = "SELECT * FROM departments";
    connection.query(query, function(err, res) {
       if (err) throw err;
       console.log("\nHere are the departments\n\n======================\n");
       console.table(res);
       console.log("======================\n");
       runProgram();
    });
 }

 function addRoles() {
    let query = "SELECT * FROM departments";
    connection.query(query, function(err, departmentTable) {
       if (err) throw err;
       let allDepartments = [];
 
       departmentTable.forEach(department => {
          allDepartments.push(department.dept_name);
       });
 
       const rolesQuestions = [
          //new role dept
          {
             name: "whichDpt",
             type: "list",
             message: "Pick a Department for the New Role",
             choices: allDepartments
          },
          //new role title
          {
             name: "roleTitle",
             type: "input",
             message: "Enter the Title of the New Role"
          },
          //new role salary
          {
             name: "roleSalary",
             type: "input",
             message: "Enter the Salary of the New Role"
          }
       ];
 
       inq.prompt(rolesQuestions).then(function(fullResult) {
          let deptID = "";
          let title = fullResult.roleTitle;
          let salary = fullResult.roleSalary;
 
          for (let i = 0; i < allDepartments.length; i++) {
             if (fullResult.whichDpt === departmentTable[i].dept_name) {
                deptID = departmentTable[i].dept_id;
             }
          }
 
          connection.query(
             "INSERT INTO roles SET ?",
             { title: title, salary: salary, dept_id: deptID },
             function(err) {
                if (err) throw err;
                runProgram();
             }
          );
       });
    });
 }

 function viewRoles() {
    let query =
       "SELECT roles.roles_id, roles.title, roles.salary, departments.dept_name FROM roles INNER JOIN departments ON (roles.dept_id = departments.dept_id)";
    connection.query(query, function(err, res) {
       if (err) throw err;
       console.log("\nHere are the roles\n\n======================\n");
       console.table(res);
       console.log("======================\n");
       runProgram();
    });
 }

 function addEmployees() {
    let query = "SELECT * FROM roles";
    connection.query(query, function(err, rolesTable) {
       if (err) throw err;
       let allRoles = [];
 
       rolesTable.forEach(role => {
          allRoles.push(role.title);
       });
 
       const employeeQuestions = [
          //new employee role
          {
             name: "whichRole",
             type: "list",
             message: "Select the Role for this Employee",
             choices: allRoles
          },
          //employee first name
          {
             name: "employeeFirstName",
             type: "input",
             message: "Enter the Employee's First Name"
          },
          //employee last name
          {
             name: "employeeLastName",
             type: "input",
             message: "Enter the Employee's Last Name"
          }
       ];
 
       inq.prompt(employeeQuestions).then(function(employee) {
          let roleID;
          let firstName = employee.employeeFirstName;
          let lastName = employee.employeeLastName;
 
          for (let i = 0; i < allRoles.length; i++) {
             if (employee.whichRole === rolesTable[i].title) {
                roleID = rolesTable[i].roles_id;
             }
          }
 
          connection.query(
             "INSERT INTO employee SET ?",
             {
                first_name: firstName,
                last_name: lastName,
                roles_id: roleID
             },
             function(err) {
                if (err) throw err;
                runProgram();
             }
          );
       });
    });
 }

 function viewEmployees() {
    let query =
       "SELECT employee.employee_id, employee.first_name, employee.last_name, roles.title, roles.salary, departments.dept_name FROM employee INNER JOIN roles ON (employee.roles_id = roles.roles_id) INNER JOIN departments ON (roles.dept_id = departments.dept_id)";
    connection.query(query, function(err, res) {
       if (err) throw err;
       console.log("\nHere are the employees\n\n======================\n");
       console.table(res);
       console.log("======================\n");
       runProgram();
    });
 }

 function updateEmployeeRole() {
    let query = "SELECT * FROM roles";
    connection.query(query, function(err, rolesTable) {
       if (err) throw err;
       let allRoles = [];
       rolesTable.forEach(role => {
          allRoles.push(role.title);
       });
       const updateQuestions = [
          //updated role
          {
             name: "whichRole",
             type: "list",
             message: "Select Which Role You'd Like to Update",
             choices: allRoles
          },
          //update salary or title
          {
             name: "whichUpdate",
             type: "list",
             message: "Select Which You'd Like to Update",
             choices: ["Salary", "Title"]
          }
       ];
       inq.prompt(updateQuestions).then(function(role) {
          let roleID;
          for (let i = 0; i < allRoles.length; i++) {
             if (role.whichRole === rolesTable[i].title) {
                roleID = rolesTable[i].roles_id;
             }
          }
 
          if (role.whichUpdate === "Salary") {
             inq.prompt({
                name: "newSalary",
                type: "input",
                message: "Enter the New Salary"
             }).then(function(response) {
                let newSalary = response.newSalary;
                newSalary = parseInt(newSalary);
 
                let query = `UPDATE roles SET ? WHERE roles_id = ${roleID}`;
                connection.query(query, { salary: newSalary }, function(err) {
                   if (err) throw err;
                   runProgram();
                });
             });
          } else {
             inq.prompt({
                name: "newTitle",
                type: "input",
                message: "Enter the New Title"
             }).then(function(response) {
                let newTitle = response.newTitle;
                let query = `UPDATE roles SET ? WHERE roles_id = ${roleID}`;
                connection.query(query, { title: newTitle }, function(err) {
                   if (err) throw err;
                   runProgram();
                });
             });
          }
       });
    });
 }
 
 runProgram();