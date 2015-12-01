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
        'textDirect' : false                // true - прямое задание текста(от БД), иначе через таблицу
        } ;
    var MESSAGE_ERROR_CSS = 'messageError' ;   //  класс для вывода ошибок
    var MESSAGE_INFO_CSS = 'messageInfo' ;     //  класс для вывода информационных сообщений

    var USER_TYP_GUEST = 'guest';
    var USER_TYP_USER = 'user';
    this.currentDialog = $('#enterDialog') ;
    var readyStat = '' ;                   // состояние готовности (определяет набор командных кнопок)
    var STAT_INIT = 'init' ;        // начальное состояние
    var STAT_GUEST = 'guest' ;      // определён как гость
    var STAT_USER = 'user' ;        // определён как пользователь
    this.langModule = new EnterFormLangModule() ;     // языковый модуль формы
    var _this = this;

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
        readyStat = STAT_INIT ;                       // начальное состояние
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
            }
        }) ;

        _this.formShow() ;        // выводит элементы по текущему языку
        $messageText.empty();

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
    };

    /**
     * вычисляет набор командных кнопок в зависимости от полноты заполнения
     */
    var  commandSet = function() {
        var langMod = _this.langModule ;
        var lang = paramSet.currentLang ;
        lang = lang.toLowerCase() ;
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
            messageShow('loggedAsGuest',error) ;      // 'INFO:Вы вошли на сайт как ГОСТЬ' ;
            ready = true;
            enterReady(ready,message,userTyp) ;
        } else {
            var log = authorizationVect['login'];
            var passw = authorizationVect['password'];
            if (log.length == 0 || passw.length == 0) {
                messageShow('fieldsMustBeFilled',error = true) ;      // ''ERROR:поля login,password должны быть заполнены!';' ;
            } else {

                ajaxExecute.getData(authorizationVect, true);
                var tmpTimer = setInterval(function () {
                    var answ = ajaxExecute.getRequestResult();
                    if (false == answ || undefined == answ) {
                        messageShow('noAnswerFromDB',error = true) ;      // 'ERROR:Нет ответа от БД';


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
        $messageText.empty();
        var error ;
        var directText ;
        if (ready) {
            messageShow(message,error = false,directText = true) ;      // ответ БД
// переопределяем кнопки при отсутствии ошибок
            if (userTyp == USER_TYP_GUEST) {

                $('#loginFields').empty() ;
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
            messageShow(message,error = true,directText = true) ;      // ответ БД - прямой текст
        }

    } ;
     this.formShow = function() {
        var lang = paramSet.currentLang.toLowerCase() ;
       // lang = lang.toLowerCase() ;
        var langMod = _this.langModule ;
        var titleTab = langMod.titleTab ;
        var fieldTab = langMod.fieldTab ;
        var cmdTab = langMod.cmdTab ;
        var messageTab = langMod.messageTab ;
        var title = titleTab[lang] ;
        showTitle(title) ;
        for (var fldId in fieldTab) {
            var fldName = fieldTab[fldId][lang] ;
            fieldShow(fldId,fldName) ;
        }
        commandSet() ;
        var descript = messageTab['description'][lang] ;
        $descriptionText.empty();
        $descriptionText.append( descript);
         $descriptionText.removeClass() ;
         $messageText.addClass(MESSAGE_INFO_CSS) ;
         if(currentMessage['id'].length > 0) {            // перевывод текущего сообщения
             messageShow(currentMessage['id'],currentMessage['error'],currentMessage['directText']) ;
         }
//        $descriptionText.css({'border': ' 2px solid green'});
    } ;

    var fieldShow = function(fldId,fldName) {
        $('#'+fldId).text(fldName) ;
    } ;

    var showTitle = function(title) {
        _this.currentDialog.dialog('option','title',title) ;
    } ;
    var messageShow = function(messageId,error,directText) {
        currentMessage['id'] = messageId ; // запомнить тек сообщение
        currentMessage['error']= error ;

        directText = (typeof(directText) !== 'boolean') ? false : directText ;
        currentMessage['directText']= directText ;
        var langMod = _this.langModule ;
        var message = '' ;
        if (directText) {
            message = messageId ;      // прямой текст
        }else {
            var lang = paramSet.currentLang.toLowerCase();
            var messageTab = langMod.messageTab;
            message = (typeof(messageTab[messageId][lang]) !== 'string') ? messageId : messageTab[messageId][lang];
        }
        var cssClass = (error) ? MESSAGE_ERROR_CSS : MESSAGE_INFO_CSS ;
        $messageText.empty() ;
        $messageText.removeClass() ;
        $messageText.addClass(cssClass) ;
        $messageText.append(message) ;
    } ;
    var messageClear = function() {
        currentMessage = '' ;
        $messageText.empty() ;
        $messageText.removeClass() ;
    }

}