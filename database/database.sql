DROP DATABASE IF EXISTS database_tfg;
CREATE DATABASE database_tfg;

USE database_tfg;

CREATE TABLE usuarios(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    gmail VARCHAR(100) NOT NULL,
    contraseña VARCHAR(20) NOT NULL,
    edad INT NOT NULL
);

CREATE TABLE productos(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL
    descrip TEXT NOT NULL
    cantidad INT
    user_id INT
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usuarios(id)
)