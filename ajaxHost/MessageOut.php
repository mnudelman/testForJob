<?php
/**
 * Класс для формирования сообщений при передаче ajax
 * $messages = [messId1 => ['ru' => <messRu>,
 *                          'en' => <messEn>],
 *              messId2 => ........
 *             ]
 * строки messRu,messEn могут иметь фрагменты для вставки значений вида {par}
 * текущие значения par определяются из $subst = [par_i => val_i,....]
 */

class MessageOut {
    private $messages = [] ;      // исходный текст сообщений
    private $subst = [] ;         // подстановки
    private $messOut = [] ;       // сообщения после подстановки
    //---------------------------//
    public function __construct($mess,$subst) {
        $this->messages = $mess ;
        $this->subst = $subst ;
        $this->substDo() ;
    }

    /**
     * Выполнить подстановки
     */
    private function  substDo() {
        $enValue = '' ;    // сообщение на английском
        $ruValue = '' ;    // сообщение на русском
        foreach ($this->messages as $messId => $mesValue) {
            $enValue = $this->messageSubst($enValue) ;
            $ruValue = $this->messageSubst($ruValue) ;
            $this->messOut[$messId] =
                ['ru' => $ruValue,
                 'en' => $enValue] ;
        }
    }
    private function messageSubst($messText) {
        $leftBrace = '{' ;
        $rightBrace = '}' ;
        while (false !== strpos($messText, $leftBrace)) {
            $posBeg = strpos($messText, $leftBrace) ;
            $posEnd = strpos($messText, $rightBrace) ;
            $leftPart = substr($messText,0,$posBeg) ;
            if (false === $posEnd || $posEnd < $posBeg) {     // разбор прекращён
                break ;
            }
            $rightPart = substr($messText,$posEnd+1) ;

            $parName = trim(substr($messText,$posBeg + 1,$posEnd - $posBeg + 1)) ;
            $parValue = ((isset($subst[$parName])) ? $subst[$parName] : '!'.$parName.'!').''  ;
            $messText = $leftPart.$parValue.$rightPart ;
        }
        return $messText ;
    }

    /**
     * возвращает сформированное сообщение с сделанными подстановками
     * @param $messId
     * @return mixed
     */
    public function getMessage($messId) {
        return (isset($this->messOut[$messId])) ? $this->messOut[$messId] : $messId ;
    }
}