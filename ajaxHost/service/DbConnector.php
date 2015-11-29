<?php
/**
 *   Подключение к БД
 * singleton - подключение единое для всех
 */

class DbConnector {
private $HOST = 'localhost' ;
private $DB_NAME = 'authorization' ; // 'blog_test'
private $USER = 'root' ;
private $PASSWORD = 'root' ;
public static $isSuccessful = false ; // успех подключения к БД
private static $instance = null ;
private  static $connect = null ;
private $OPT = [
PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO:: FETCH_ASSOC ] ;
//-----------------------------------------------------//
    private function __construct() {
        self::$isSuccessful = true ;
        $this->connectExe() ;
    }
    public static function getConnect() {
        if(is_null(self::$instance)) {
           self::$instance= new self() ;
        }
        return self::$connect ;
    }
    private function connectExe()
    {
        $dsn = 'mysql:host=' . $this->HOST . ';dbname=' . $this->DB_NAME;
        try {
            self::$connect = new PDO($dsn, $this->USER, $this->PASSWORD, $this->OPT);
        } catch (PDOException $e) {
            self::$isSuccessful = false;
            echo 'ERROR:подключение:' . $e->getMessage() . '<br>';
        }
    }

}