-- Создание схемы БД games
-- --------------------------------------
-- CREATE DATABASE IF NOT EXISTS games ;
-- --------------------------------------
-- users - список пользователей
CREATE TABLE IF NOT EXISTS users (
  userid   INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  login    VARCHAR(20) UNIQUE,
  password VARCHAR(40)
);
-- --------------------------------------
-- games - Список игр
CREATE TABLE IF NOT EXISTS games (
  gid        INTEGER NOT NULL  AUTO_INCREMENT PRIMARY KEY,
  gname      VARCHAR(50) UNIQUE
);
-- --------------------------------------
-- attributes - Список атрибутов игры
 CREATE TABLE IF NOT EXISTS attributes (
  attrid INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  gid    INTEGER REFERENCES games (gid),
  attrname  VARCHAR (60),
  UNIQUE (gid, attrname)   -- пара:  игра-атрибут - единственная
);
-- --------------------------------------
-- results - результаты игры
CREATE TABLE IF NOT EXISTS results (
  rid INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  gid    INTEGER REFERENCES games (gid),
  userid INTEGER                          -- пользователь
         REFERENCES users (userid),
  timeid BIGINT UNIQUE ,
  points INTEGER ,
  rating FLOAT
);

-- --------------------------------------
-- gameattr - атрибуты игры
CREATE TABLE IF NOT EXISTS gameattr (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
rid    INTEGER REFERENCES results (rid),
attrid INTEGER
        REFERENCES attributs (attrid) ON DELETE CASCADE,
attrvalue INTEGER
) ;
--  --------------------------------------
