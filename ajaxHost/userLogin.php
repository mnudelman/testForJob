<?php
/**
 * обслуживает авторизацию
 */
session_start();
ini_set('display_errors', 1);
//error_reporting(E_ALL) ;
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
/////////////////////////////////////////////////////////////////////////////////////////
class Db_user extends Db_base {
    public function getUser($userLogin) {
        // $userPassw = [] ;  // ['login' => login, 'password' => $password ]
        $sql = 'SELECT * FROM users WHERE login = :login' ;
        $subst = ['login'=>$userLogin] ;
        $rows = $this->sqlExecute($sql,$subst,__METHOD__) ;
        if (false === $rows) {
            return false ;
        }
        $row = $rows[0] ;
        if (!empty($row)){
            return ['login   ' => $row['login'],
                'password' => $row['password'] ] ;
        }else {
            return false ;
        }
    }

    /**
     * запоминает пользователя в БД
     */
    public function putUser($userLogin,$password) {
        $logPassw = $this->getUser($userLogin) ;
        if (!(false === $logPassw)) {      // уже есть в БД
            return ($logPassw['password'] == $password) ;
        }
        $sql = 'INSERT INTO  users (login,password) VALUES (:login,:password)' ;
        $subst = [
            'login'=>$userLogin,
            'password'=>$password] ;
        $this->sqlExecute($sql,$subst,__METHOD__) ;
        return true ;
    }
    public function updatePassword($userLogin,$newPassword){
        $logPassw = $this->getUser($userLogin) ;
        if ( false === $logPassw ) {      // нет в БД - это ошибка !!
            return false ;
        }
        $sql = 'UPDATE  users set password = :password where login = :login' ;
        $subst = ['login'=>$userLogin,
            'password'=>$newPassword] ;
        $this->sqlExecute($sql,$subst,__METHOD__) ;
        return true ;
    }

}
// структура запроса
//var authorizationVect = {
//    login: '',
//        password: '',
//        newName: false,
//        guest: false,
//        successful: false
//    };
function checkPassword($password,$dbPassword) {
    $len = strlen($dbPassword) ;
    $success = false ;
    if ($len <= 32) {     // кодировка md5
        $success = ($dbPassword == md5($password)) ;
    }else {
        $success = password_verify($password,$dbPassword) ;
    }
    return $success ;

}
function getNewHashPassword($password,$dbPassword) {
    $len = strlen($dbPassword) ;
    if ($len >= 60) {                // новый уже установлен
        return false ;
    }else {
        return password_hash($password,PASSWORD_DEFAULT) ;
    }
}
function userLogin()
{
    $dbUser = new Db_user();
    $taskPar = TaskParameters::getInstance() ;
    $msg = Message::getInstace() ;

    $login = $taskPar->getParameter('login') ;             //   $_GET['login'];
    $password = $taskPar->getParameter('password') ;       // $_GET['password'];
    $newNameFlag = $taskPar->getParameter('newName') ;     // $_GET['newName'];
    $newPassword = $taskPar->getParameter('newPassword') ;
    $successful = false;
    $message = '';
    $newNameFlag = ("false" == $newNameFlag) ? false : true ;
    $newPasswordFlag = ("false" == $newPassword) ? false : true ;
    $dbAnsw = $dbUser->getUser($login);
    if (false === $dbAnsw) {          // нет в БД
        if ($newNameFlag) {         // добавить в БД
            //$passCode = md5($password);
            $passCode = getNewHashPassword($password,'') ;
            $dbUser->putUser($login, $passCode);
            $successful = true;
            $msg->addMessage('oK!: Новый пользователь добавлен в БД.');

        } else {        // должно быть, но нет
            $successful = false;
            $msg->addMessage('ERROR:  В БД не определён пользователь:' . $login) ;
        }
    } else {      //  в БД есть
        $dbLogin = $dbAnsw['login'];
        $dbPassword = $dbAnsw['password'];
        if ($newNameFlag) {         // добавить в БД
            $successful = false;
            $msg->addMessage('ERROR:  В БД уже есть пользователь:' . $login) ;
        } else {        // должно быть
            $passCode = md5($password);
            $passwordSuccess = checkPassword($password,$dbPassword) ;    // проверить password
            if ($passwordSuccess) {
                $successful = true;
                $msg->addMessage('oK!: Авторизация выполнена') ;
                $newHashPassword = getNewHashPassword($password,$dbPassword) ;
                if (is_string($newHashPassword)) {      //    надо заменить hashCode на новый
                    $successful = $dbUser->updatePassword($login,$newHashPassword) ;
                }

            } else {
                if (false === $newPasswordFlag) {
                    $successful = false;
                    $msg->addMessage('ERROR: Пароль не верен');
                }else {
//                    $passCode = md5($password) ;
                    $passCode = getNewHashPassword($password,'') ;
                    $successful = $dbUser->updatePassword($login,$passCode) ;
                    if ($successful) {
                        $msg->addMessage('oK!: Замена пароля выполнена');
                    }else {
                        $msg->addMessage('ERROR: Замена пароля НЕ выполнена');
                    }
                }
            }
        }
    }
    $answ = [
        'login' => $login,
        'password' => $password,
        'newName' => $newNameFlag,
        'newPassword' => $newPasswordFlag,
        'successful' => $successful,
        'message' => $msg->getMessages(),
    ];
    return $answ;
}