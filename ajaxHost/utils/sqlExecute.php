<?php
/**
 * Исполнитель sql-запросов из текстовых файлов
 */
session_start();
ini_set('display_errors', 1);
//error_reporting(E_ALL) ;
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
include_once __DIR__ . '/dbService.php';
/////////////////////////////////////////////////////////////////////////////////////////
class SqlExecute extends Db_base {
    private $sqlLines = false;         // sql - запросы
    private $sqlScript = false ;        // файл - тексты запросов
    public static $STAT_PREPARE = 1;  // подготовка текста из скрипта
    public static  $STAT_GO      = 2;   // исполнить запрос
    public static  $STAT_EXIT   =  9;   // прервать
    private $stat = 0 ;

    //--------------------------//
    private function storeParameters() {
        $_SESSION['sqlLines'] = $this->sqlLines ;
    }
    private function restoreParameters() {
         $this->sqlLines  = $_SESSION['sqlLines'] ;
    }
    public function prepare()
    {
        if (isset($_POST['refuse'])) {
            $this->stat = self::$STAT_EXIT;
            die('EXIT');
        }
        if (isset($_POST['sqlPrepare'])) {    // подготовка: файл --> списокЗапросов
            $this->stat = self::$STAT_PREPARE;
            $this->sqlScript = $_FILES['sqlScript']['tmp_name'];  // файл с текстами запросов
            $this->sqlLines = scriptParser($this->sqlScript);
            $this->storeParameters();
        }
        if (isset($_POST['sqlExample'])) {    // подготовка: файл --> списокЗапросов
            $this->prepareExample();
        }
        if (isset($_POST['sqlGo'])) {   // Выполнение запросов
            $this->sqlGo() ;
        }

    }
    private function sqlGo() {
        $this->stat = self::$STAT_GO ;
        $this->restoreParameters() ;
        if (is_array($this->sqlLines)) {
            foreach ($this->sqlLines as $key => $l) {
                $sql = $l['text'];
                $result = $this->sqlExecute($sql, [], __METHOD__);
                if (false === $result) {
                    $messages = $this->msg->getMessages();
                    $this->sqlLines[$key]['error'] = $messages[0];
                    foreach ($messages as $text) {
                        echo $text . TaskStore::LINE_FEED;
                    }
                }
                $this->sqlLines[$key]['result'] = $result ;
                $this->sqlLines[$key]['count'] = $this->getRowCount();
                $this->sqlLines[$key]['cap']   = $this->getCaption();
                echo '<br>' ;
            }
        }

    }
    private function prepareExample() {
        $this->stat = STAT_PREPARE;
        $this->sqlScript = 'example' ;
        $sqlLines = [] ;
        $sqlLines[] = [
            'text'   => 'SHOW TABLES',
            'name'   => 'SHOW']   ;
        $sqlLines[] = [
            'text'   => 'SELECT * FROM users',
            'name'   => 'SELECT']   ;
        $sqlLines[] = [
            'text'   => 'SELECT * FROM userprofile',
            'name'   => 'SELECT']   ;
        $this->sqlLines = $sqlLines ;
        $this->storeParameters() ;

    }
    public function getStat() {
        return $this->stat ;
    }
    public function getSqlLines() {
        return $this->sqlLines ;
    }
    public function getSqlScript() {
        return $this->sqlScript ;
    }

}

$sqlExec = new SqlExecute() ;
$sqlExec->prepare() ;
//-- параметры формы ----//
$htmlDirTop = TaskStore::$htmlDirTop ;
$stat = $sqlExec->getStat() ;
$sqlLines = $sqlExec->getSqlLines() ;
$sqlScript = $sqlExec->getSqlScript() ;
$STAT_GO = SqlExecute::$STAT_GO ;
$res = $sqlExec->getResult() ;
$urlSqlExecute = TaskStore::$htmlDirTop.'/utils/sqlExecute.php' ;

include_once __DIR__ .'/sqlExecShow.php' ;