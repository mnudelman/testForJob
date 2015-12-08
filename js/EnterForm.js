/**
 *  форма входа (авторизации)
 */

function EnterForm() {
    var ajaxExecute = paramSet.ajaxExecute;
    // формы авторизации
    var registrationForm ;  // регистрация
    var profileForm  ;      // профиль

    // ---  объекты jQuery ввода пароля
    var $loginElem = $('#login');
    var $passwordElem = $('#password');
    var $descriptionText = $('#descriptionText');
    var $messageText = $('#messageText');
    var currentMessage = {                  // текущее сообщение(нужно при обновлении формы)
        'id' : '',
        'error' : false,
        'textDirect' : false,                // true - прямое задание текста(от БД), иначе через таблицу
        'susbst' : {}
        } ;

    var USER_TYP_GUEST = 'guest';
    var USER_TYP_USER = 'user';
    this.currentDialog = $('#enterDialog') ;
    var readyStat = 0 ;                   // состояние готовности (определяет набор командных кнопок)
    var STAT_INIT = 0 ; //'init' ;        // начальное состояние
    var STAT_GUEST = 5 ; //'guest' ;      // определён как гость
    var STAT_USER = 10 ; // 'user' ;        // определён как пользователь
    this.formModule = new EnterFormModule() ;     // языковый модуль формы
    var _this = this;
    var isExistingDialog = false ;           // флаг существования диалога
    // атрибуты авторизации
    var authorizationVect = {
        typ: 'userLogin',
        login: '',
        password: '',
        newName: false,
        guest: true,
        successful: false
    };


    // открыть
    // ---------------------
    this.edit = function () {
        // формы автризации
        registrationForm = paramSet.registrationForm;  // регистрация
        profileForm  = paramSet.profileForm ;          // профиль
        paramSet.currentForm = _this ;                // сохраняем текущую форму
        checkService = paramSet.checkService ;          // объект контроля полей
        checkService.init(_this.formModule,$descriptionText,$messageText) ;

        readyStat = STAT_INIT ;                       // начальное состояние
        if (isExistingDialog)  {
            _this.currentDialog.dialog('open') ;
        }else {
            dialogInit();
            isExistingDialog = true;
        }
        _this.formShow() ;        // выводит элементы по текущему языку
        $loginElem.focus() ;
    };
    /**
     * определить диалог и его элементы
     */
    var dialogInit = function() {

        $('#enterDialog').dialog({
            title: 'authorization',
            width: 500,
            modal: true,
            beforeClose: function (event, ui) {
                paramSet.currentForm = '' ;            // чистить форму

                var name = authorizationVect['login'];
                if (name.length == 0) {
                    authorizationVect['login'] = 'noName';
                    authorizationVect['guest'] = true;
                    paramSet.setUser(authorizationVect);
                }
                if (authorizationVect['successful'] == true) {

                }
                var topMenu = paramSet.topMenu ;
                topMenu.menuShow() ;        // допустимые действия для пользователя
            }
        }) ;


        $("#login").autocomplete({
            source: function (request, response) {
                var nameFilter = {typ: 'nameList', name: request.term};
                ajaxExecute.getData(nameFilter);
                var tmpTimer = setInterval(function () {
                    var nameList = ajaxExecute.getRequestResult();
                    if (false !== nameList) {
                        clearInterval(tmpTimer);
                        response(nameList);

                    }
                }, 300);
            },
            minLength: 0
        });
        $loginElem.focus(function() {
            if (readyStat > STAT_INIT) {
                $loginElem.attr('readonly','readonly') ;
            }else {
                $loginElem.removeAttr('readonly') ;
            }
        }) ;
        $passwordElem.focus(function() {
            if (readyStat > STAT_INIT) {
                $passwordElem.attr('readonly','readonly') ;
            }else {
                $passwordElem.removeAttr('readonly') ;
            }

        }) ;



    } ;
    /**
     * вычисляет набор командных кнопок в зависимости от полноты заполнения
     */
    var  commandSet = function() {
        var langMod = _this.formModule ;
        var lang = paramSet.currentLang.toLowerCase() ;
        var cmdTab = langMod.cmdTab ;
        var cmdName = cmdTab['cmdGuest'][lang] ;
        var cmdGuest ={
            text: cmdName,                                        // "guest",
            click: function () {
                EnterFormClick(false, true, USER_TYP_GUEST);
            }
        } ;
        cmdName = cmdTab['cmdEnter'][lang] ;
        var cmdEnter =  {
            text: cmdName,                                        // "enter",
            click: function () {
                EnterFormClick(false, false, USER_TYP_USER);
            }
        } ;
        cmdName = cmdTab['cmdNewName'][lang] ;
        var cmdNewName = {
            text: cmdName,                                        // "new name",
            click: function () {
                _this.currentDialog.dialog('close');
                registrationForm.edit();
            }
        } ;
        cmdName = cmdTab['cmdOk'][lang] ;
        var cmdOk = {
            text: cmdName,                                        // "oK!",                        // для гостя только ok!
            click: function () {
                $('#enterDialog').dialog("close");

            }
        } ;
        cmdName = cmdTab['cmdProfile'][lang] ;
        var cmdProfile = {
            text: cmdName,                                        // "profile show/edit",      // добавляется кнопка перехода в профиль
            click: function () {
                $('#enterDialog').dialog("close");
                profileForm.edit();

            }
        } ;
//  командные кнопки в зависимости от состояния
        var curDialog = _this.currentDialog ;
        switch(readyStat) {
            case STAT_INIT :
            $(curDialog).dialog("option", "buttons", [
                cmdGuest, cmdEnter, cmdNewName
            ]) ;

                break ;
            case STAT_GUEST :
                $(curDialog).dialog("option", "buttons", [
                    cmdOk
                ]) ;

                break ;
            case STAT_USER :
                $(curDialog).dialog("option", "buttons", [
                    cmdOk, cmdProfile
                ]) ;
                break ;
        }

    } ;


    var EnterFormClick = function (newNameFlag, guestFlag, userTyp) {
        authorizationVect['newName'] = newNameFlag;
        authorizationVect['guest'] = guestFlag;
        authorizationVect['login'] = $loginElem.val();
        authorizationVect['password'] = $passwordElem.val();
        var message = '';
        var ready = false;
        if (userTyp == USER_TYP_GUEST) {
            var name = authorizationVect['login'];
            name = (name.length == 0 ) ? 'noName' : name;
            authorizationVect['login'] = name;

            paramSet.setUser(authorizationVect);           // сохранить профиль
            var error = false ;
            var mess = {
                'loggedAsGuest' : {
                    'messageId': 'loggedAsGuest'
                }
            } ;
            checkService.checkMessage(mess,error = false) ;  // 'INFO:Вы вошли на сайт как ГОСТЬ' ;
            ready = true;
            enterReady(ready,message = '',userTyp) ;
        } else {
            var log = authorizationVect['login'];
            var passw = authorizationVect['password'];
            if (log.length == 0 || passw.length == 0) {
                var mess = {
                    'fieldsMustBeFilled' : {
                    'messageId': 'fieldsMustBeFilled'
                     }
                } ;
                checkService.checkMessage(mess,error = true) ;
            } else {

                ajaxExecute.getData(authorizationVect, true);
                var tmpTimer = setInterval(function () {
                    var answ = ajaxExecute.getRequestResult();
                    if (false == answ || undefined == answ) {
                        var mess = {
                            'fieldsMustBeFilled' : {
                                'messageId': 'noAnswerFromDB'
                            }
                        } ;
                        checkService.checkMessage(mess,error = true) ;

                        //messageShow('noAnswerFromDB',error = true) ;      // 'ERROR:Нет ответа от БД';


                        ready = false;
                    } else {
                        clearInterval(tmpTimer);
                        message = answ['message'];



                        if (answ['successful'] == true) {
                            authorizationVect['successful'] = true;
                            paramSet.setUser(authorizationVect);
                            message = answ['message'];
                            ready = true;
                        } else {
                            ready = false;
                            message = answ['message'];
                        }
                        enterReady(ready,message,userTyp) ;

                    }


                }, 300);
            }

        }

    } ;
    /**
     * Нажата кнопка формы
     * @param ready
     * @param message
     * @param userTyp
     */
    var enterReady = function(ready,message,userTyp) {
//        $messageText.empty();
        var error ;
        var directText ;
        if (ready) {

            error = false;
            var messageLines = [] ;
            if (typeof(message) == 'string' && message.length > 0 ) {
                messageLines[0] = message;
                checkService.setFieldId('');    // чистить полеИд
                checkService.messagesShow(messageLines, error);   // ответ БД - прямой текст
            }
// переопределяем кнопки при отсутствии ошибок
            if (userTyp == USER_TYP_GUEST) {
                readyStat = STAT_GUEST ;
                commandSet() ;
            }
            if (userTyp == USER_TYP_USER) {
                var topMenu = paramSet.topMenu;       // модуль вывода меню
                // читаем profile
                profileForm.getProfile();     // profile в paramSet - запускает чтение profile
                var tmpTimer = setInterval(function () {
                    var isReady = profileForm.isRequestReady();  // готовность запроса
                    if (true == isReady) {
                        clearInterval(tmpTimer);
                        profileForm.profileAccess();     // доступ к profile через paramSet
                        topMenu.showUser();              // показать пользователя
                   }
                }, 300);

                readyStat = STAT_USER ;

                $loginElem.attr('readonly','readonly') ;
                $passwordElem.attr('readonly','readonly') ;
                commandSet() ;
            }

        } else {
            error = true;
            var messageLines = [] ;
            messageLines[0] = message ;
            checkService.setFieldId('') ;    // чистить полеИд
            checkService.messagesShow(messageLines,error) ;   // ответ БД - прямой текст
        }

    } ;
    /**
     * Вывод формы целиком
     */
    this.formShow = function() {
        checkService.changeLang() ;         // установить язык
        var title = checkService.getFormTitle() ;
        showTitle(title) ;                     // заголовок формы
        checkService.fieldsLabelShow() ;            // имена полей
        checkService.descriptionShow() ;      // описатель
        commandSet() ;
        checkService.checkMessage() ;
    } ;



    var showTitle = function(title) {
        _this.currentDialog.dialog('option','title',title) ;
    } ;
    var messageClear = function() {
        currentMessage = '' ;
        $messageText.empty() ;
        $messageText.removeClass() ;
    }

}