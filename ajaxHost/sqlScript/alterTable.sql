update attributes set attrname = 'gameTime' where attrid = 4 ;
select * from attributes ;
-- timeid должен быть уникальным ( по нему надо будет выбирать атрибуты игры)
-- на самом деле это не обязательно, но удобно для работы
alter TABLE results ADD UNIQUE  (timeid)  ;