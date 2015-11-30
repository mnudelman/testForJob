/**
 * Created by mnudelman@yandex.ru on 22.11.15.
 * ОБщие параметры задачи
 */
function ParamSet() {

    this.winLocation ;           // относительный адрес директории запуска
    this.windowLocationHost ;    // http - адрес для доступа к php-модулям БД
    this.dirImages ;
    this.dirHtmlFotos ;              //

    this.ajaxExecute ;   // исполнитель запросов к БД

    this.PHOTO_PEOPLE ;  // пустое фото
    //-------------формы----------------------------- //
    this.topMenu  ;        // главное меню
    this.authorization  ;  // авторизация
    this.enterForm  ;        // авторизация ;
    this.registrationForm ;  // регистрация
    this.profileForm  ;      // профиль
    this.langControl ;       // управление языком вывода
    //-------------------------------------------------//
    this.user = {
        login : 'guest',
        password : '',
        status : 5 ,
        successfulEnter : false
    } ;
    /** статус определяет функциональные возможности */
    this.USER_STAT_ADMIN = 99;  // создание новых разделов, групповое добавление картинок
    this.USER_STAT_USER = 10;        // добавление картинок по одной
    this.USER_STAT_GUEST = 5;      // только просмотр

    this.userProfile = {} ;
    //------ параметры языка отображения --------//
    this.LANG_RU = 'RU' ;
    this.LANG_EN = 'EN' ;
    this.LANG_IMG_RU ;               // пиктограмма языка
    this.LANG_IMG_EN ;
    this.currentLang = 'RU' ;        // текущий язык(начальное значение)
    this.currentForm = '' ;          // текущая активная форма
    //------------------------------------------ //
    var _this = this ;

    this.init = function() {
        // параметры варианта и уровня //
        var arr = window.location.pathname.split('/') ;
        var path = '' ;
        for (var i = 1; i < arr.length - 1; i++) {
            path += '/'+arr[i] ;
        }
        _this.winLocation = path ;
        var str = window.location.href ;
        _this.windowLocationHost = str.replace('/index.html','') ;
        var url = _this.windowLocationHost+'/ajaxHost' ;
        _this.ajaxExecute = new AjaxExecutor(url) ;
//       ---Формы ---------
        _this.topMenu = new TopMenu() ;     // главное меню
        _this.authorization = new Authorization() ;  // авторизация
        _this.enterForm = new EnterForm();                 // авторизация ;
        _this.registrationForm = new RegistrationForm();  // регистрация
        _this.profileForm  = new ProfileForm() ;          // профиль
        _this.langControl = new LangControl() ;
//
        _this.dirImages = _this.winLocation+'/images' ;
        _this.dirHtmlFotos = _this.winLocation+'/photos' ;
        _this.PHOTO_PEOPLE = paramSet.dirImages + '/people.png' ;   // пустое фото
        _this.LANG_IMG_RU  = _this.dirImages+'/ru.png';               // пиктограмма языка
        _this.LANG_IMG_EN = _this.dirImages+'/en.png';

    } ;
    this.setUser = function(userVect) {
        _this.user['login'] = userVect['login'] ;
        _this.user['password'] = userVect['password'] ;
        _this.user['successfulEnter'] = userVect['successful'] ;
        _this.user['status'] = (_this.user['successfulEnter']) ?
            _this.USER_STAT_USER : _this.USER_STAT_GUEST ;

    } ;
    /**
     * сохранить profile для доступа
     * @param profile
     */
    this.setProfile = function(profile) {
        for (var key in profile) {
            _this.userProfile[key] = profile[key] ;
        }

    } ;

}
