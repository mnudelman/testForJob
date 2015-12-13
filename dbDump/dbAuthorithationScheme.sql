-- Создание схемы БД authorization
-- --------------------------------------
-- CREATE DATABASE IF NOT EXISTS authorization ;
-- --------------------------------------
-- users - список пользователей
--drop table users ;
CREATE TABLE IF NOT EXISTS users (
  userid   INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  login    VARCHAR(20) UNIQUE,
  password CHAR(255)                  -- использование password_hash(password,PASSWORD_DEFAULT)
)DEFAULT CHARSET=utf8 ;
-- --------------------------------------
-- userprofile - Профиль пользователя
--drop table userprofile ;
CREATE TABLE IF NOT EXISTS userprofile (
  id         INTEGER NOT NULL  AUTO_INCREMENT PRIMARY KEY,
  userid     INTEGER
             REFERENCES users (userid)
             ON DELETE CASCADE,
  surname    VARCHAR(40) DEFAULT '',
  name       VARCHAR(40) DEFAULT '',
  patronymic VARCHAR(40) DEFAULT '',
  filePhoto   VARCHAR(100) DEFAULT '', -- файл с фотографией
  tel        VARCHAR(15) DEFAULT '',
  email      VARCHAR(40) DEFAULT '',
  sex        CHAR(1)           DEFAULT 'm',
  birthday   DATE DEFAULT '2001-01-01',
  info       VARCHAR(200) DEFAULT '',
  CHECK (sex IN ('m', 'w'))
) DEFAULT CHARSET=utf8;
-- --------------------------------------
-- строка в userprofile появляется вместе с users
CREATE TRIGGER  insert_user AFTER INSERT ON users
FOR EACH ROW
  INSERT INTO userprofile (userid) VALUES (new.userId);
-- --------------------------------------
-- sessions - сессии пользователей
drop table sessions ;
CREATE TABLE IF NOT EXISTS sessions (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
sid VARCHAR (30) ,
userid  INTEGER
       REFERENCES users (userid),
begtime TIMESTAMP,
endtime TIMESTAMP,
passwordsave INTEGER default  0
)DEFAULT CHARSET=utf8 ;
