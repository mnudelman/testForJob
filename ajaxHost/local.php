<?php
/**
* Привязка текущейДиректории к корневойПроекта
*/
?>
<?php
$currentDir = __DIR__ ;
// определяем верхний уровень
$topDir = realpath($currentDir) ;
$pi = pathinfo($_SERVER['PHP_SELF']) ;
$currentHtmlDir = $pi['dirname'] ; // относительный адрес для HTML-ссылок
$topHtmlDir = $currentHtmlDir ;
$firstSymb = $topHtmlDir[0] ;
if ('/' !== $firstSymb) {
    $topHtmlDir = '/'.$topHtmlDir ;
}

// подключаем класс TaskStore - общие параметры
$dirService = $topDir .'/service' ;
include_once $dirService . '/TaskStore.php' ;
include_once $dirService . '/DbConnector.php' ;
include_once $dirService . '/Message.php' ;
include_once $dirService . '/TaskParameters.php' ;
//------ подключение БД -------------//
$pdo = DbConnector::getConnect() ;
if (!DbConnector::$isSuccessful) {
    die('EXIT');
}
TaskStore::init($topDir,$topHtmlDir) ;
//  подключаем autoLoad  - авт подключение классов
include_once $dirService . '/autoload.php' ;
//-------------------------------------------//

