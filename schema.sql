DROP DATABASE IF EXISTS employee_trackerSumm_db;

CREATE DATABASE employee_trackerSumm_db;

USE employee_trackerSumm_db;

CREATE TABLE departments (
  dept_id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (dept_id)
);

CREATE TABLE roles (
  roles_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary VARCHAR(30) NOT NULL,
  dept_id INT NOT NULL,
  PRIMARY KEY (roles_id),
  FOREIGN KEY (dept_id) 
     REFERENCES departments(dept_id)
);

CREATE TABLE employee (
   employee_id INT NOT NULL AUTO_INCREMENT,
   first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
   roles_id INT NOT NULL,
   PRIMARY KEY (employee_id),
   FOREIGN KEY (roles_id)
      REFERENCES roles(roles_id)
)