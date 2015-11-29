<?php
/**
 * Хранение  параметров задачи
 * Date: 22.05.15
 */
class TaskStore {
    public static $dirTop = false ;             // корневой директорий
    public static $htmlDirTop = false ;         // относительный адрес для html
    public static $dirService = false ;         // сервисные функции
   //-----------------------------------//

    //-- параметры состояния --//
    //-------Список сохраняемых параметров-------//
    //------ константы ------------//

    const LINE_FEED = '<br>';
    const LINE_END = '"\n"';

   const COOKIES_WORD = 'обучение в школе php' ;

    public static function init($dirTop, $htmlDirTop) {
        self::$dirTop = $dirTop;
        self::$htmlDirTop = $htmlDirTop;

        self::$dirService = self::$dirTop . '/service';
        // восстановить параметры //
    }

    /**
     * @return array -  список директорий для поиска классов по __autoload
     */
    public static function getClassDirs()
    {
        return [
            self::$dirService];
    }



}