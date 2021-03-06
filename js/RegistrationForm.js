/**
 *  форма регистрации на сайте
 *  только login,password
 */

function RegistrationForm(authorizationObj) {
    var ajaxExecute = paramSet.ajaxExecute;
    var profileForm ;           // профиль
    // --- объекты jQuery ввода пароля
    var $loginElem = $('#regLogin');
    var $passwordElem = $('#regPassword');
    var $passwordDublElem = $('#regRepeatPassword');          // дублированный ввод пароля
    var $descriptionText = $('#regDescriptionText');
    var $messageText = $('#regMessageText');


    var fieldErrors = {
        'login' : true ,
        'password' : true,
        'passwordRepeat' : true
    } ;
    var _this = this;
    var currentAction = '' ;
    var ACTION_REGISTRATION = 'registration';
    var ACTION_CHANGE_PASSWORD = 'changePassword' ;
    var regSuccessful = false ;
    // атрибуты авторизации
    var authorizationVect = {
        typ: 'userLogin',
        login: '',
        password: '',
        newName: true,
        newPassword : true,
        guest: false,
        successful: false
    };
    this.currentDialog =  $('#regDialog') ;
    this.formModule = new RegistrationFormModule() ;     // модуль описателей формы
    var checkService  ;          // объект контроля полей
   // открыть
    // ---------------------
    this.edit = function (action) {
        regSuccessful = false ;
        action = (action == undefined) ? ACTION_REGISTRATION : action ;
        currentAction = action ;
        profileForm  = paramSet.profileForm ;          // профиль
        paramSet.currentForm = _this ;                // сохраняем текущую форму
        checkService = paramSet.checkService ;          // объект контроля полей
        checkService.init(_this.formModule,$descriptionText,$messageText) ;
        // при замене пароля login не редактируется
        if (currentAction == ACTION_CHANGE_PASSWORD ) {
            var log = paramSet.user['login'] ;
            authorizationVect['login'] = log ;
            authorizationVect['newName'] = false ;
            $loginElem.val(log) ;
            $loginElem.attr('readonly','readonly') ;
            $passwordElem.removeAttr('readonly') ;
            fieldErrors['login'] = false ;

        }
        $('#regDialog').dialog({
            title: 'registration',
            width: 500,
            modal: true,
            beforeClose: function (event, ui) {
                paramSet.currentForm = '' ;                // текущую форма - пусто
                var name = authorizationVect['login'];
                if (!regSuccessful && (currentAction !== ACTION_CHANGE_PASSWORD)) {
                    authorizationVect['login'] = 'noName';
                    authorizationVect['guest'] = true;
                    paramSet.setUser(authorizationVect);
                }
            }
        });
//        $($descriptionText).accordion();
        // закрыть поля кроме login
        $loginElem.removeAttr('readonly') ;
        $passwordElem.attr('readonly','readonly') ;
        $passwordDublElem.attr('readonly','readonly') ;


        $loginElem.autocomplete({
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
            if (regSuccessful || currentAction == ACTION_CHANGE_PASSWORD ) {
                $loginElem.attr('readonly','readonly') ;
                return ;
            }
            $loginElem.removeAttr('readonly') ;
            $passwordElem.attr('readonly','readonly') ;
            $passwordDublElem.attr('readonly','readonly') ;
        }) ;
        $loginElem.blur(function(){
            if (regSuccessful || currentAction == ACTION_CHANGE_PASSWORD) {
                $loginElem.attr('readonly','readonly') ;
                if (currentAction == ACTION_CHANGE_PASSWORD) {
                    $passwordElem.removeAttr('readonly') ;
                    $passwordElem.focus() ;
                }
                return ;
            }
            var syntaxErr = checkService.syntaxChecking('login') ;


            if (!syntaxErr) {
                $loginElem.attr('readonly','readonly') ;
                $passwordElem.removeAttr('readonly') ;
                $passwordElem.focus() ;
            }else {
                $loginElem.focus();
            }
            fieldErrors['login'] = syntaxErr ;
        }) ;

        $passwordElem.focus(function() {
            if (regSuccessful) {
                $passwordElem.attr('readonly','readonly') ;
                return ;
            }
            $passwordDublElem.attr('readonly','readonly') ;
        }) ;
        $passwordElem.blur(function(){
            if (regSuccessful) {
                $passwordElem.attr('readonly','readonly') ;
                return ;
            }
            var syntaxErr = checkService.syntaxChecking('password') ;

            if (!syntaxErr) {
                $passwordDublElem.removeAttr('readonly') ;
                $passwordDublElem.focus() ;
            }else {
                $passwordElem.focus() ;
            }
            fieldErrors['password'] = syntaxErr ;

        }) ;
        $passwordDublElem.focus(function() {
            if (regSuccessful) {
                $passwordDublElem.attr('readonly','readonly') ;
                return ;
            }
        }) ;
        $passwordDublElem.blur(function(){
            if (regSuccessful) {
                $passwordDublElem.attr('readonly','readonly') ;
                return ;
            }
            var err = checkService.syntaxChecking('passwordRepeat') ;

            fieldErrors['passwordRepeat'] = err ;
            if (!err) {
                dbValidate() ;
            }
        }) ;
        _this.formShow() ;        // выводит элементы по текущему языку
        if (currentAction == ACTION_CHANGE_PASSWORD) {
            $passwordElem.removeAttr('readonly') ;
            $passwordElem.focus() ;
        } else {
            $loginElem.focus();
        }
    };
    /**
     * вычисляет набор командных кнопок в зависимости от полноты заполнения
     */
    var  commandSet = function() {

        var langMod = _this.formModule ;
        var lang = paramSet.currentLang.toLowerCase() ;
        var cmdTab = langMod.cmdTab ;
        var cmdName = cmdTab['cmdProfile'][lang] ;

        var cmdProfile = {
            text: cmdName,
            click: function () {
                $('#regDialog').dialog('close') ;
                profileForm.edit() ;
            }
        } ;
        cmdName = cmdTab['cmdBreak'][lang] ;
        var cmdBreak = {
            text: cmdName,
            click: function () {
                $('#regDialog').dialog('close') ;
            }
        } ;

        cmdName = cmdTab['cmdOk'][lang] ;

        var cmdOk = {
            text: cmdName,
            click: function () {
                $('#regDialog').dialog('close') ;
            }
        } ;


        if (regSuccessful) {
            $('#regDialog').dialog("option", "buttons", [
                cmdProfile,                                  // добавляется кнопка profile
                cmdOk
            ]) ;

        }else {
            $('#regDialog').dialog("option", "buttons", [
                cmdBreak
            ]) ;
        }
    } ;
    /**
     * проверяет по БД допустимость login как нового имени пользователя
     */
    var dbValidate = function() {
        var error = false ;
        var messages = [] ;
        var messI = 0 ;
        var subst = {} ;
        var directText = false ;
        for (var key in fieldErrors) {              // ошибки заполнения
            error = error || fieldErrors[key] ;
        }
        if (error) {
            return ;
        }
        // ошибок заполнения нет !! -> контроль в БД 
        authorizationVect['newName'] = (currentAction == ACTION_REGISTRATION) ;
        authorizationVect['newPassword'] = (currentAction == ACTION_CHANGE_PASSWORD) ;
        authorizationVect['guest'] = false ;
        authorizationVect['login'] = $loginElem.val();
        authorizationVect['password'] = $passwordElem.val();
        ajaxExecute.getData(authorizationVect, true);
        var message = '' ;
        var fldName = '' ;
        var subst = {} ;
        var tmpTimer = setInterval(function () {
            var answ = ajaxExecute.getRequestResult();
            if (false == answ || undefined == answ) {
                message = 'ERROR:Нет ответа от БД';
                regSuccessful = false;
            } else {
                clearInterval(tmpTimer);
                message = answ['message'];



                if (answ['successful'] == true) {
                    authorizationVect['successful'] = true;
                    paramSet.setUser(authorizationVect);
                    message = answ['message'];
                    regSuccessful = true;

                } else {
                    regSuccessful = false;
                    message = answ['message'];
                }
         }
            if (regSuccessful) {
                var messId = (currentAction == ACTION_CHANGE_PASSWORD) ? 'changePasswordCompleted' :
                                                                           'registrationCompleted' ;
                var message = {'registrationComplete' : {
                        messageId: messId
                    }
                };

                checkService.setFieldId('') ;    // чистить полеИд
                checkService.checkMessage(message,error = false) ;  // сообщение о регистрации
                $loginElem.attr('readonly','readonly') ;
                $passwordElem.attr('readonly','readonly') ;
                $passwordDublElem.attr('readonly','readonly') ;
                // обновить меню //
                 var topMenu = paramSet.topMenu ;
                topMenu.showUser() ;
            }else {                         // сообщения БД прямой текст
                var err = true ;
                checkService.dbMessageShow(message,err) ;
                $loginElem.removeAttr('readonly') ;
                $loginElem.focus() ;
            }
            commandSet() ;

        }, 300);
    } ;
    /**
     * Вывод формы целиком
     */
   this.formShow = function() {
       checkService.changeLang() ;         // установить язык
       var title = checkService.getFormTitle(currentAction) ;
       showTitle(title) ;                     // заголовок формы
       checkService.fieldsLabelShow() ;            // имена полей
       checkService.descriptionShow(currentAction) ;      // описатель
       commandSet() ;
       checkService.checkMessage() ;
       checkService.dbMessageShow() ;
    } ;
    /**
     * Вывод заголовка
      * @param title
     */
    var showTitle = function(title) {
        _this.currentDialog.dialog('option','title',title) ;
    } ;

}

