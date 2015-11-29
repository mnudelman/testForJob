<?php
/**
 * статистика игры
 */
session_start();
ini_set('display_errors', 1);
//error_reporting(E_ALL) ;
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
/////////////////////////////////////////////////////////////////////////////////////////
class Db_statistic extends Db_base {
    private $GAME_SNAKE_ID = 1 ;

    public function getStatistic($records,$name,$points,$total) {
        $sql = 'SELECT results.timeid as gameId,
                       results.points,
                       results.rating as total,
                       users.login as gamerName
                       FROM results,users
                       WHERE results.gid = :GAME_ID AND
                             results.userid = users.userid ' ;
        $subst = [] ;
        $subst['GAME_ID'] = $this->GAME_SNAKE_ID ;
        $addName = '' ;
        if (!empty($name)) {
           $addName = ' AND UPPER(users.login) LIKE UPPER( :login) ' ;
           $subst['login'] = '%'.$name.'%' ;
       }
        $addPoints = '' ;
        if ($points > 0)  {
            $addPoints = ' AND results.points >= :points ' ;
            $subst['points'] = $points ;
        }
        $addTotal = '' ;
        if ($total > 0)  {
            $addTotal = 'AND results.rating  >= :total ' ;
            $subst['total'] = $total + 0 ;
        }
        $addRecords = '' ;
        if ($records > 0)  {
            $addRecords = ' LIMIT '.$records  ;
         //   $addRecords = ' LIMIT 3 ' ;
        //    $subst['records'] = $records + 0 ;
        }
        $sql .= $addName.$addPoints.$addTotal.$addRecords ;

        $rows = $this->sqlExecute($sql, $subst, __METHOD__);
        if (false === $rows) {
            return ['successful' => false,
                    'message' => $this->msg->getMessages(),
                    'sql' => $sql,
                    'subst' => $subst] ;
        }
        $statistic = [] ;
        foreach ($rows as $row) {
            $statistic[] =[
              'gameId'    => $row['gameId'],
              'gamerName' => $row['gamerName'],
              'points'    => $row['points'],
              'total'     => $row['total']
            ]  ;
        }
        return $statistic ;
    }
}
function getStatistic() {
    $taskPar = TaskParameters::getInstance() ;
    $dbStatistic = new Db_statistic() ;
    $records = $taskPar->getParameter('records') ;      // $_GET['records'];
    $name = $taskPar->getParameter('name') ;            // $_GET['name'];
    $points = $taskPar->getParameter('points') ;        //$_GET['points'];
    $total = $taskPar->getParameter('total') ;          // $_GET['total'];
    return $dbStatistic->getStatistic($records,$name,$points,$total) ;
}
