-- users - список пользователей
INSERT INTO  users (login,password) VALUES  ('Pit',md5('12345')) ;
INSERT INTO  users (login,password) VALUES  ('Jek',md5('12345')) ;
INSERT INTO  users (login,password) VALUES  ('Jim',md5('12345')) ;
INSERT INTO  users (login,password) VALUES  ('Galina',md5('12345')) ;
INSERT INTO  users (login,password) VALUES  ('Marina',md5('12345')) ;
INSERT INTO  users (login,password) VALUES  ('Ivan',md5('12345')) ;
INSERT INTO  users (login,password) VALUES  ('Michael',md5('12345')) ;
--
INSERT INTO games (gname) VALUES ('snake') ;
INSERT INTO games (gname) VALUES ('seaBattle') ;

INSERT INTO attributes (gid, attrname) VALUES (1,'matrixSize') ;
INSERT INTO attributes (gid, attrname) VALUES (1,'targetsNumber') ;
INSERT INTO attributes (gid, attrname) VALUES (1,'targetLifetime') ;
INSERT INTO attributes (gid, attrname) VALUES (1,'gameLength') ;

-- INSERT INTO results (gid,userid,timeid       ,points,rating) VALUES
--                    (1   ,1    ,'2015-07-20 00:00:00'	,50    ,100) ;

INSERT INTO results (gid,userid,timeid       ,points,rating) VALUES
                    (1   ,1    ,1437062066836,40    ,88) ;

INSERT INTO results (gid,userid,timeid       ,points,rating) VALUES
                    (1   ,4    ,1437062444647,60    ,112) ;

INSERT INTO results (gid,userid,timeid       ,points,rating) VALUES
                    (1   ,4    ,1437062776753,200    ,112) ;

INSERT INTO results (gid,userid,timeid       ,points,rating) VALUES
                    (1   ,5    ,1437147951837,50    ,100) ;

INSERT INTO results (gid,userid,timeid       ,points,rating) VALUES
                    (1   ,5    ,1437159241004,120    ,105) ;


SELECT * FROM users ;
SELECT * FROM games ;
SELECT * FROM attributes ;
SELECT * FROM results ;