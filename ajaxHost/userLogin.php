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
// Замена старой кодировки md5 на новую password_hash($password,PASSWORD_DEFAULT)
const CODE_LENGTH_MD5 = 32 ;      // длина кода, генерируемая md5(password)
const CODE_LENGTH_HASH = 60 ;     // длина кода, генерируемая password_hash(password,PASSWORD_DEFAULT)
function checkPassword($password,$dbPassword) {
    $len = strlen($dbPassword) ;
    $success = false ;
    if ($len <= CODE_LENGTH_MD5) {     // кодировка md5
        $success = ($dbPassword == md5($password)) ;
    }else {
        $success = password_verify($password,$dbPassword) ;
    }
    return $success ;

}
function getNewHashPassword($password,$dbPassword) {
    $len = strlen($dbPassword) ;
    if ($len >= CODE_LENGTH_HASH) {                // новый уже установлен
        return false ;
    }else {
        return password_hash($password,PASSWORD_DEFAULT) ;
    }
}

/**
 * @return array - все сообщения программы
 */
function getUserLoginMessages() {

    return [
      'newUserAdded' => ['ru' => 'oK!: Новый пользователь добавлен в БД.',
                         'en' => 'oK! New user is added to Data Base'] ,
      'userIsUndefined' =>   ['ru' => 'ERROR:  В БД не определён пользователь:{login}',
                              'en' => 'ERROR:In the database is undefined, the user:{login}'] ,
      'databaseThereIsUser' =>   ['ru' => 'ERROR: ERROR:  В БД уже есть пользователь:{login}',
                                  'en' => 'ERROR:in the database there is the user:{login}'] ,
      'authorizationComplete' =>   ['ru' => 'oK!: Авторизация выполнена',
                                    'en' => 'oK! Authorization is completed'] ,
      'passwordNotCorrect' =>   ['ru' => 'ERROR: Пароль не верен',
                                 'en' => 'ERROR:the password is not correct'] ,
      'passwordReplacementMade' =>   ['ru' => 'oK!: Замена пароля выполнена',
                                      'en' => 'oK!:Password replacement is made'] ,
      'passwordReplacementNot' =>   ['ru' => 'ERROR: Замена пароля НЕ выполнена',
                                     'en' => 'ERROR:Password replacement not performed'] ,
    ] ;
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
    // готовим сообщения
    $messText = getUserLoginMessages() ;    // исходные тексты
    $subst = ['login' => $login] ;          // подстановка
    $messOut = new MessageOut($messText,$subst) ;

    if (false === $dbAnsw) {          // нет в БД
        if ($newNameFlag) {         // добавить в БД
            //$passCode = md5($password);
            $passCode = getNewHashPassword($password,'') ;
            $dbUser->putUser($login, $passCode);
            $successful = true;
            $mess = $messOut -> getMessage('newUserAdded') ;         // 'oK!: Новый пользователь добавлен в БД.');
            $msg->addMessage($mess);

        } else {        // должно быть, но нет
            $successful = false;
            $mess = $messOut -> getMessage('userIsUndefined') ;         // 'ERROR:  В БД не определён пользователь:' . $login
            $msg->addMessage($mess);
        }
    } else {      //  в БД есть
        $dbLogin = $dbAnsw['login'];
        $dbPassword = $dbAnsw['password'];
        if ($newNameFlag) {         // добавить в БД
            $successful = false;
            $mess = $messOut -> getMessage('databaseThereIsUser') ;  // 'ERROR:  В БД уже есть пользователь:' . $login
            $msg->addMessage($mess);
        } else {        // должно быть
            $passwordSuccess = checkPassword($password,$dbPassword) ;    // проверить password
            if ($passwordSuccess) {
                $successful = true;
                $mess = $messOut -> getMessage('authorizationComplete') ;  // 'oK!: Авторизация выполнена'
                $msg->addMessage($mess);
                $newHashPassword = getNewHashPassword($password,$dbPassword) ;
                if (is_string($newHashPassword)) {      //    надо заменить hashCode на новый
                    $successful = $dbUser->updatePassword($login,$newHashPassword) ;
                }

            } else {
                if (false === $newPasswordFlag) {
                    $successful = false;
                    $mess = $messOut -> getMessage('passwordNotCorrect') ;  // 'ERROR: Пароль не верен'
                    $msg->addMessage($mess);
                }else {
                    $passCode = getNewHashPassword($password,'') ;
                    $successful = $dbUser->updatePassword($login,$passCode) ;
                    if ($successful) {
                        $mess = $messOut -> getMessage('passwordReplacementMade') ;  // 'oK!: Замена пароля выполнена'
                        $msg->addMessage($mess);
                    }else {

                        $mess = $messOut -> getMessage('passwordReplacementNot') ;  // 'ERROR: Замена пароля НЕ выполнена'
                        $msg->addMessage($mess);
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