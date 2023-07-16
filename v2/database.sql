CREATE DATABASE shiftScheduler;

USE shiftScheduler;

CREATE TABLE division(
	id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
	name 			varchar(255) 	NOT NULL,
	isActive 		tinyint 					DEFAULT '1'
);

CREATE TABLE shift (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  isTemplate 		tinyint 					DEFAULT '0',
  isActive 			tinyint 					DEFAULT '1',
  startH 			time 			NOT NULL,
  endH 				time 			NOT NULL,
  breakIncluded 	tinyint 					DEFAULT '0',
  breakH 			time 			NOT NULL,
  scheduledDate 	date 			NULL,
  division			int				NULL,
  
  FOREIGN KEY (division) 		REFERENCES division(id)  
);

CREATE TABLE workinghours (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  name 				varchar(255) 	NOT NULL,
  isActive 			tinyint 					DEFAULT '1',
  hours 			time 			NOT NULL
);

CREATE TABLE employee (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  isAdmin 			tinyint 					DEFAULT '0',
  isActive			tinyint 					DEFAULT '1',
  loginCounter		int 						DEFAULT '0',
  workingHours 		int 			NULL,
  firstName 		varchar(255) 	NULL,
  lastName 			varchar(255) 	NOT NULL,
  
  FOREIGN KEY (workingHours) 		REFERENCES workinghours(id)
);

CREATE TABLE employeeshift (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  shift 			int 			NOT NULL,
  employee 			int				NOT NULL,

  FOREIGN KEY (shift) 				REFERENCES shift (id),
  FOREIGN KEY (employee) 			REFERENCES employee (id)
);

CREATE TABLE employeeswitchedshift (
  id 				int 			NOT NULL PRIMARY KEY AUTO_INCREMENT,
  shift				int				NOT NULL,
  originalEmployee 	int 			NOT NULL,
  newEmployee 		int 			NOT NULL,

  FOREIGN KEY (shift) 				REFERENCES shift (id),
  FOREIGN KEY (originalEmployee) 	REFERENCES employee (id),
  FOREIGN KEY (newEmployee) 		REFERENCES employee (id)
);

INSERT INTO employee (isAdmin, firstName, lastName)
VALUES (1,NULL,'HUM'),(0,'Max','Mustermann');