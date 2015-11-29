<?php
/**
 * Формирователь сообщений
 * класс реализует singleton
 * Все сообщения попадают в один список
 */
class Message {
    private $messages = [] ;
    private $title ='' ;
    private $name = '' ;
    private $keys ;
    private static $instance = null ;
    //--------------------------------//
    private function __construct() {
    }
    public static function getInstace() {
        if (is_null(self::$instance) ) {
            self::$instance = new self()  ;
        }
        return self::$instance ;
    }
    public function addMessage($text) {
            $this->messages[] = $text ;
    }
    public function getMessages() {
        return $this->messages ;
    }
    public function clear() {
        $this->messages = [] ;
    }
}