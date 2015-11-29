<?php
session_start() ;
/**
 * по $_GET определяет передачу управления
 *  параметр: typ имя программы-исполнителя запроса
 */
?>
<?php
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
include_once __DIR__ . '/userLogin.php';
include_once __DIR__ . '/nameList.php';
include_once __DIR__ . '/getProfile.php';
include_once __DIR__ . '/setProfile.php';
// загружаем параметры---//
$taskPar = TaskParameters::getInstance() ;
$taskPar->setParameters($_GET,$_POST) ;
$exeTyp = $taskPar->getParameter('typ')  ;

$answ = [
    'successful' => false,
    'message' => 'ERROR:тип запроса не распознан "'.$exeTyp.'"'
] ;
switch($exeTyp) {
    case 'userLogin' : {
        $answ = userLogin() ;
        break ;
    }
    case 'getProfile' : {
        $answ = getProfile() ;
        break ;
    }
    case 'setProfile' : {
        $answ = setProfile() ;
        break ;
    }
    case 'nameList' : {
        $answ = nameList() ;
        break ;

    }
    default : {    // весь $_GET отправиить обратно

    }
}

echo json_encode($answ) ;