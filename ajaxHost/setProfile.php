<?php
/**
 * Получить список пользователей по фрагменту имени
 */
session_start();
ini_set('display_errors', 1);
//error_reporting(E_ALL) ;
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
/////////////////////////////////////////////////////////////////////////////////////////
class Db_setprofile extends Db_base
{
    /**
     * по схеме БД запись в табл userprofile есть (!)
     * Запроос разбиваем на 2 части: 1.  userprofile.id  2. UPDATE полей
     * @param $login
     * @param $profile
     * @return array
     */
    public function setProfile($login,$profile) {
        $sql = 'SELECT * FROM userprofile
                WHERE userid IN (SELECT userid FROM users WHERE login = :login)' ;
        $subst = ['login' => $login];
        $rows = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false === $rows) {
            return [
                'successful' => false,
                'sql' => $sql,
                'subst' => $subst,
                'message' => $this->msg->getMessages() ] ;
        }
        $row = $rows[0] ;
        $id = $row['id'] ;
        $setList = '' ;

        foreach ($profile as $key => $value) {
              if (empty($key)) {
                  continue ;
              }
              $setList .= ((strlen($setList) > 0 ) ? ',':'').$key.' = "'.$value.'"' ;
        }
        $sql = 'UPDATE userprofile SET '.$setList.
               ' WHERE id = :id'  ;
        $subst = ['id' => $id];
        $result = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false === $result || 0 === $result ) {
            return [
                'successful' => false,
                'sql' => $sql,
                'subst' => $subst,
                'result' => $result,
                'message' => $this->msg->getMessages() ] ;
        }
        return ['successful' => true,
                 'sql' => $sql,
                 'subst' => $subst,
                 'rofile' => $profile,
                'result' => $result ] ;
    }
}
function setProfile() {
    $taskPar = TaskParameters::getInstance() ;

    $dbProfile = new Db_setprofile() ;
    $login = $taskPar->getParameter('login') ;              // $_GET['name'] ;
    $fields = $taskPar->getParameter('fields') ;   // список полей
     // формируем массив-профиль по списку полей
    $profile = [] ;
    $fldList = mb_split(',',$fields) ;
    foreach ($fldList as $fldName) {
        $profile[$fldName] = $taskPar->getParameter($fldName) ;   // переданное значение
    }

    return $dbProfile->setProfile($login,$profile) ;
}