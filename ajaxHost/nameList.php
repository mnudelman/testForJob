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
class Db_nameList extends Db_base
{
    public function getNameList($name) {
        $sql = 'SELECT login FROM users  ' ;
        $where = '' ;
        $subst = [] ;
        if(!empty($name)) {
            $where = 'WHERE UPPER(login) LIKE UPPER(:name)' ;
            $subst = ['name' => '%'.$name.'%'];
        }
        $sql .= $where ;
        $rows = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false === $rows) {
            return [
                'successful' => false,
                'sql' => $sql,
                'subst' => $subst,
                'message' => $this->msg->getMessages() ] ;
        }
        $nameList = [] ;
        foreach ($rows as $row) {
            $nameList[] = $row['login'] ;
        }
        return $nameList ;
    }
}
function nameList() {
  $taskPar = TaskParameters::getInstance() ;

  $dbNameList = new Db_nameList() ;
  $name = $taskPar->getParameter('name') ;              // $_GET['name'] ;
  return $dbNameList->getNameList($name) ;
}