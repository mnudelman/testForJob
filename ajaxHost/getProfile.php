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
class Db_profile extends Db_base
{
    public function getProfile($login,$fields) {
       $profile = [] ;
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
        $fldList = mb_split(',',$fields) ;
        $row = $rows[0] ;
        $profile = [
            'successful' => true,
            'fields' => $fields,
            'rows' => $rows
        ] ;
//        foreach ($row as $key => $value ) {
//            $profile[$key] = $value ;
//        }
        foreach ($fldList as $fldName) {
            if (isset($row[$fldName])) {
                $profile[$fldName] = $row[$fldName] ;
            }
        }
        return $profile ;
    }
}
function getProfile() {
    $taskPar = TaskParameters::getInstance() ;

    $dbProfile = new Db_profile() ;
    $login = $taskPar->getParameter('login') ;              // $_GET['name'] ;
    $fields = $taskPar->getParameter('fields') ;   // список полей
    return $dbProfile->getProfile($login,$fields) ;
}