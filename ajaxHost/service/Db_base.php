<?php
/**
 * Базовый класс для работы с БД
 * Time: 16:16
 */

abstract class Db_base {
    protected $pdo;   // объект - подключение к БД
    protected $msg ;  // объект - вывод сообщений
    protected $SQL_SELECT = 'SELECT' ;
    protected $SQL_INSERT = 'INSERT' ;
    protected $SQL_UPDATE = 'UPDATE' ;
    protected $SQL_DELETE = 'DELETE' ;
    protected $SQL_SHOW   = 'SHOW' ;
    protected $smt ;                 // объект - результат операции
    protected $sqlType ;             // тип текущего оператора
    public function __construct() {
        $this->pdo = DbConnector::getConnect() ;
        $this->msg = Message::getInstace() ;
    }


    public function sqlExecute($sql,$substitute,$methodFrom) {
        $sql = trim($sql) ;
        $arr = explode(' ',$sql) ;
        $this->sqlType = strtoupper(trim($arr[0])) ;
        try {
            $this->smt = $this->pdo->prepare($sql) ;
            $this->smt->execute($substitute) ;

        }catch (PDOException  $e){

            $this->msg->addMessage('ERROR:'.$methodFrom .':' . $e->getMessage() ) ;
            return false ;
        }
        // возврат от типа операции
        switch($this->sqlType) {
            case $this->SQL_SELECT :
                return $this->returnSelect() ;
                break ;
            case $this->SQL_SHOW :
                return $this->returnSelect() ;
                break ;
            case $this->SQL_INSERT :
                return $this->returnInsert() ;
                break ;
            case $this->SQL_UPDATE :
                return $this->returnUpdate() ;
                break ;
            case $this->SQL_DELETE :
                return $this->returnUpdate() ;
                break ;
            default:
                echo 'ERROR:type-'.$this->sqlType.'!' ;
        }

    }
    protected function returnSelect() {
        $rows = $this->smt->fetchAll(PDO::FETCH_ASSOC);
        return $rows ;
    }
    protected function returnInsert() {
          return  $this->pdo->lastInsertId() ;
    }
    protected function returnUpdate() {
           return $this->smt->rowCount() ;
    }

    public function getRowCount() {
        if ($this->sqlType !== $this->SQL_INSERT) {
            return $this->smt->rowCount();
        }else {
            return false ;
        }
    }
   public function getColumnName($iColumn) {
     if ($this->sqlType == $this->SQL_SELECT ||
         $this->sqlType == $this->SQL_SHOW) {
         $meta_data = $this->smt->getColumnMeta($iColumn);
         return $meta_data['name'];
     }else {
         return false ;
     }
   }
    public function getColumnLen($iColumn) {
        if ($this->sqlType == $this->SQL_SELECT ||
            $this->sqlType == $this->SQL_SHOW ) {
            $meta_data = $this->smt->getColumnMeta($iColumn);
            return $meta_data['len'];
        }else {
            return false ;
        }
    }
    public function getColumnPrecision($iColumn) {
        if ($this->sqlType == $this->SQL_SELECT ||
            $this->sqlType == $this->SQL_SHOW)  {
            $meta_data = $this->smt->getColumnMeta($iColumn);
            return $meta_data['precision'];
        }else {
            return false ;
        }
    }
    public function getResult() {
        return $this->smt ;
    }
    public function getCaption() {
        $caption = false ;
        if ($this->sqlType == $this->SQL_SELECT ||
            $this->sqlType == $this->SQL_SHOW)  {
            $colCount = $this->smt->columncount() ;
            $caption = [] ;
            for ($i = 0; $i < $colCount ; $i++) {
                $caption[] = $this->getColumnName($i) ;
            }
        }
        return $caption  ;
    }

}