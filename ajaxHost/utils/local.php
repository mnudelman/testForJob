<?php
/**
* Привязка текущейДиректории к корневойПроекта
*/
?>
<?php

// определяем верхний уровень
$topDir = realpath(__DIR__ .'/..' ) ;
$pi = pathinfo($_SERVER['PHP_SELF']) ;
$currentHtmlDir = $pi['dirname'] ; // относительный адрес для HTML-ссылок
$topHtmlDir = $currentHtmlDir ;
$arr = explode('/',$topHtmlDir) ;
$n = count($arr) ;
$topHtmlDir = '' ;
for ($i = 0 ; $i < $n-1; $i++) {
    $topHtmlDir .= ((0 ==$i) ? '':'/').$arr[$i] ;
}
$firstSymb = $topHtmlDir[0] ;
if ( '/' !== $firstSymb ) {
    $topHtmlDir = '/'.$topHtmlDir ;
}


// подключаем класс TaskStore - общие параметры
$dirService = $topDir .'/service' ;
include_once $dirService . '/TaskStore.php' ;
include_once $dirService . '/DbConnector.php' ;
//------ подключение БД -------------//
TaskStore::init($topDir,$topHtmlDir) ;
//  подключаем autoLoad  - авт подключение классов
include_once $dirService . '/autoload.php' ;
//-------------------------------------------//
