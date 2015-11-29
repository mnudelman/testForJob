<?php
/**
 * Класс содержит текущий список параметров задачи
 * реализует  singleton - список параметров единый
 * - это аналог совокупности $_GET,$_POST
 * Для контроллера или модели, параметры различаются по именам, а не по источнику
 * Если потребуется контролировать источник параметра, то добавлю атрибут
 * В задаче все параметры равнозначны не зависимо от источника
 * Time: 16:18
 */

class TaskParameters {
    private $msg ;
    private $taskParameters ;
    private static $instance = null ;
    private $NOT_DEFINED_VALUE = false ;
    private $ACTION_DEFAULT = 'viewGo' ;
    private function __construct() {
       $this->msg = Message::getInstace() ;
    }

    public static function getInstance() {
        if (is_null(self::$instance) ) {
            self::$instance = new self()  ;
        }
        return self::$instance ;
    }

    public function setParameters($parameters,$parameters2 = false) {
        if (is_array($parameters)) {
            $this->taskParameters = $parameters;
        }else {
            $this->taskParameters = [] ;
        }
        if (is_array($parameters2)) {
            $this->addParameters($parameters2) ;

        }
    }

    /**
     * разложение ЧПУ на составляющие:
     * контроллер/параметр/значение/параметр/.....
     * по умолчанию метод = "viewGo"
     * Т.е. action берется по умолчанию
     * если будет по другому, то ввести явно
     */
    public function addClearUrlParameters($getParms) {
        $parArray = explode('/',$getParms) ;
        $controller = $parArray[0] ;
        //$action = $parArray[1] ;
        $action = $this->ACTION_DEFAULT ;
        $this->setParameter('controller',$controller) ;
        $this->setParameter('action',$action) ;
        $n = sizeof($parArray) ;
        if ($n > 1) {
            if (0 == $n % 2 ) {
                $parArray[$n] = $this->NOT_DEFINED_VALUE ;
            }
        }
        for ($i = 1; $i <= sizeof($parArray)-2; $i+=2) {
            $this->setParameter($parArray[$i],$parArray[$i+1]) ;
        }
        $error = false ;
        if ('Cnt_' !== mb_substr($controller,0,4) ) {
            $this->msg->addMessage('ERROR:'.__METHOD__.':Ошибка определенения контроллера в строке:'.$getParms) ;
            $error = true ;
        }

        return !$error ;
    }
    public function addParameters($newParameters) {
        if (is_array($newParameters)) {
            foreach ($newParameters as $var => $value ) {
                $this->taskParameters[$var] = $value ;
            }
        }
        return $this->taskParameters ;
    }

    public function getParameters() {
        return $this->taskParameters ;
    }

    public function setParameter($parName,$parMean) {
        $this->taskParameters[$parName] = $parMean ;
    }

    public function getParameter($parName) {
        return( ($this->isDefined($parName))  ?
                  $this->taskParameters[$parName] : $this->NOT_DEFINED_VALUE ) ;
    }

    public function isDefined($parName) {
        return isset($this->taskParameters[$parName]) ;
    }
}