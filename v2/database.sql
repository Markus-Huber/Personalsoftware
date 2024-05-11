CREATE DATABASE shiftScheduler;
CREATE USER 'shiftscheduler'@'localhost' IDENTIFIED BY 'todoChange';
GRANT INSERT, UPDATE, DELETE, SELECT, RELOAD on *.* TO 'shiftscheduler'@'localhost' WITH GRANT OPTION;

USE shiftScheduler;

CREATE TABLE division(
	id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
	name 			varchar(255) 	NOT NULL,
  color     varchar(255) NULL,
	isActive 		tinyint 					DEFAULT '1'
);

CREATE TABLE shift (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  isTemplate 		tinyint 					DEFAULT '0',
  isActive 			tinyint 					DEFAULT '1',
  startH 			time 			NOT NULL,
  endH 				time 			NOT NULL,
  breakIncluded 	tinyint 					DEFAULT '0',
  breakH 			time 			NULL      DEFAULT '0.0',
  scheduledDate 	date 			NULL,
  division 			int	 			NULL,
  
  FOREIGN KEY (division) 		REFERENCES division(id)  
);

CREATE TABLE workinghours (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  name 				varchar(255) 	NOT NULL,
  isActive 			tinyint 					DEFAULT '1',
  hours 			decimal(4,2) 			NOT NULL
);

create table standort(
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  name    varchar(255) 	NOT NULL
);

CREATE TABLE employee (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  isAdmin 			tinyint 					DEFAULT '0',
  isActive 			tinyint 					DEFAULT '1',
  loginCounter 		int 						DEFAULT '0',
  workingHours 		int 			NULL,
  password 			varchar(4000)	NOT NULL,
  email	 			varchar(255) 	NULL,
  firstName 		varchar(255) 	NOT NULL,
  lastName 			varchar(255) 	NULL,
  
  FOREIGN KEY (workingHours) 		REFERENCES workinghours(id)
);

CREATE TABLE employeestandort (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  employee 			int	 			NOT NULL,
  standort 			int 			NOT NULL,

  FOREIGN KEY (employee) 			REFERENCES employee (id),
  FOREIGN KEY (standort) 				REFERENCES standort (id)
);

CREATE TABLE employeeshift (
  id 				int 			NOT NULL 	PRIMARY KEY AUTO_INCREMENT,
  shift 			int 			NOT NULL,
  employee 			int	 			NOT NULL,

  FOREIGN KEY (shift) 				REFERENCES shift (id),
  FOREIGN KEY (employee) 			REFERENCES employee (id)
);

CREATE TABLE employeeswitchedshift (
  id 				int 			NOT NULL PRIMARY KEY AUTO_INCREMENT,
  shift 			int	 			NOT NULL,
  originalEmployee 	int 			NOT NULL,
  newEmployee 		int 			NOT NULL,

  FOREIGN KEY (shift) 				REFERENCES shift (id),
  FOREIGN KEY (originalEmployee) 	REFERENCES employee (id),
  FOREIGN KEY (newEmployee) 		REFERENCES employee (id)
);

INSERT INTO employee (isAdmin, firstName, password)
VALUES (1,'HUM','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),(1,'Bernhard','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m');
INSERT INTO employee (firstName, password)
VALUES ('Bianca', '$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m');
INSERT INTO employee (firstName, lastName, password)
VALUES ('Jessica','T', '$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m');
INSERT INTO employee (firstName, password)
VALUES ('Alili','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Mikolaj','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Sophia','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Joel','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Sina','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Haack','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Monika','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Kevin','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Wimberger','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m'),('Kostorz','$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m');

INSERT INTO division(name, color)
VALUES('Kasse 1', '#006400'),('Kasse 2','#556B2F'),('Kasse 3','#C0FF3E'),('Kasse 4', '#CAFF70'),('Zureicher','#FFA500'),('TL','#FAFAD2'),('Reingigung 1', '#104E8B'),('Reingigung 2','#6495ED');

INSERT INTO standort(name)
VALUES('Dingolfing'), ('München');

INSERT INTO employeestandort(employee, standort)
SELECT id, 1 from employee;

INSERT INTO workingHours (name, hours)
VALUES("Vollzeit (40h)", 40.0),
("Teilzeit (20h)", 20.0),
("Teilzeit (32h)", 20.0),
("Sonderregelung (flex)", 99.0);

/*INSERT INTO shift (isTemplate, isActive, startH, endH, division)
VALUES (1, 1, "14:45", "23:30", 1);
*/