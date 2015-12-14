<?php
/*
 * получить атрибуты игры
 */
session_start();
ini_set('display_errors', 1);
//error_reporting(E_ALL) ;
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
/////////////////////////////////////////////////////////////////////////////////////////
class Db_getAttr extends Db_base
{
    private $GAME_SNAKE_ID = 1;
// IN (SELECT rid FROM results WHERE timeid = :timeId)
    public function getAtrr($timeId) {
        $rId = $this->getRId($timeId) ;
        if (false == $rId ) {
            $this->msg->addMessage('ERORR:Не найден rid для timeid='.$timeId) ;
            return ['successful' => false,
                'message' => $this->msg->getMessages()] ;
        }
        $sql  = 'SELECT attributes.attrid,
                        attributes.attrname,
                        tabTest.attrvalue
                        FROM attributes
                        LEFT JOIN (SELECT *  FROM gameattr   WHERE
                                  gameattr.rid = :rId ) AS tabTest
                        ON  tabTest.attrid = attributes.attrid   ' ;
        $subst = ['rId' => $rId] ;

        $rows = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false === $rows) {
            return ['successful' => false,
                'message' => $this->msg->getMessages(),
                'sql' => $sql,
                'subst' => $subst] ;
        }
        $result = ['successful' => true ] ;



        foreach ($rows as $row) {
            $key = $row['attrname'] ;
            $result[$key] = $row['attrvalue'] ;
        }
        return $result ;

    }
    private function getRId($timeId) {
        $sql = 'SELECT rid FROM results WHERE timeid = :timeId' ;
        $subst = ['timeId' => $timeId] ;
        $rows = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false == $rows) {
            return false ;
        }
        $row = $rows[0] ;
        return $row['rid'] ;

    }
    public function getGameResult($timeId) {
        $sql = 'SELECT * FROM results WHERE timeid = :timeId' ;
        $subst = ['timeId' => $timeId ] ;
        $rows = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false === $rows) {
            return [
                'successful_1' => false,
                'message_1' => $this->msg->getMessages(),
                'sql_1' => $sql,
                'subst_1' => $subst] ;
        }
        $row = $rows[0] ;
        return [
            'timId' => $row['timeid'],
            'points' => $row['points'],
            'total'  => $row['rating'],
        ] ;
    }
}
function getGameAttr() {
    $msg = Message::getInstace() ;
    $taskPar = TaskParameters::getInstance() ;
    $db = new Db_getAttr() ;
    $timeId = $taskPar->getParameter('gameId') ;
    $attrVect =  $db->getAtrr($timeId) ;
    // добавить поля из табл results
    $resVect =  $db->getGameResult($timeId) ;
    foreach ($resVect as $key=>$value) {
        $attrVect[$key] = $value ;

    }
    return $attrVect ;
}