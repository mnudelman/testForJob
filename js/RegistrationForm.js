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
    var LENGTH_MIN_LOGIN = 6 ;
    var LENGTH_MAX_LOGIN = 20 ;
    var LENGTH_MIN_PASSW = 8 ;
    var LENGTH_MAX_PASSW = 20 ;

    var MESSAGE_ERROR_CSS = 'messageError' ;   //  класс для вывода ошибок
    var MESSAGE_INFO_CSS = 'messageInfo' ;     //  класс для вывода информационных сообщений

    var currentMessage = {                  // текущее сообщение(нужно при обновлении формы)
        'fldName' : '' ,                    //
        'messages' : [] ,                   // массив сообщений
        'error' : false,
        'textDirect' : false,                // true - прямое задание текста(от БД), иначе через таблицу
        'susbst' : {}
    } ;




    var _this = this;
    var regSuccessful = false ;
    // атрибуты авторизации
    var authorizationVect = {
        typ: 'userLogin',
        login: '',
        password: '',
        newName: true,
        guest: false,
        successful: false
    };
    this.currentDialog =  $('#regDialog') ;
    this.langModule = new RegistrationFormLangModule() ;     // языковый модуль формы

   // открыть
    // ---------------------
    this.edit = function () {
        profileForm  = paramSet.profileForm ;          // профиль
        paramSet.currentForm = _this ;                // сохраняем текущую форму
        $('#regDialog').dialog({
            title: 'registration',
            width: 500,
            modal: true,
            beforeClose: function (event, ui) {
                paramSet.currentForm = '' ;                // текущую форма - пусто
                var name = authorizationVect['login'];
                if (!regSuccessful) {
                    authorizationVect['login'] = 'noName';
                    authorizationVect['guest'] = true;
                    paramSet.setUser(authorizationVect);
                }
            }
        });
        commandSet() ;       // командные кнопки
        var messages = [] ;

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
            if (regSuccessful) {
                $loginElem.attr('readonly','readonly') ;
                return ;
            }
            $loginElem.removeAttr('readonly') ;
            $passwordElem.attr('readonly','readonly') ;
            $passwordDublElem.attr('readonly','readonly') ;
        }) ;
        $loginElem.blur(function(){
            if (regSuccessful) {
                $loginElem.attr('readonly','readonly') ;
                return ;
            }
            var val = $loginElem.val() ;


            var syntaxErr = fieldValidate('login',val,LENGTH_MIN_LOGIN,LENGTH_MAX_LOGIN) ;
            var dbError = false ;
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
            var val = $passwordElem.val() ;

            var letterDigitControl = true ;
            var syntaxErr = fieldValidate('password',val,LENGTH_MIN_PASSW,LENGTH_MAX_PASSW,letterDigitControl) ;
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
            var valDubl = $passwordDublElem.val() ;
            var valPassw = $passwordElem.val() ;
            var messages = [] ;
            var err = false ;
            var messI = 0 ;
            if (valPassw !== valDubl ) {
                err = true ;
                messages[messI++] = 'Нет совпадения полей: password и passwordRepeat' ;
            }
            messageOut('passwordRepeat',err,messages) ;
            fieldErrors['passwordRepeat'] = err ;
            if (!err) {
                dbValidate() ;
            }
        }) ;
        _this.formShow() ;        // выводит элементы по текущему языку
        $messageText.empty();
        $loginElem.focus() ;
    };
    /**
     * вычисляет набор командных кнопок в зависимости от полноты заполнения
     */
    var  commandSet = function() {

        var langMod = _this.langModule ;
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

        cmdName = cmdTab['cmOk'][lang] ;

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
        authorizationVect['newName'] = true;
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
                messages[0] = 'registrationCompleted' ; // сообщение об  успехе

                messagesShow(fldName='',error=false,messages) ;

                $loginElem.attr('readonly','readonly') ;
                $passwordElem.attr('readonly','readonly') ;
                $passwordDublElem.attr('readonly','readonly') ;
                // обновить меню //
                 var topMenu = paramSet.topMenu ;
                topMenu.showUser() ;
            }else {                         // сообщения БД прямой текст
                var err = true ;
                messages[0] = message ;
                messagesShow(fldName = 'login',err,messages,subst,directText = true) ;
                $loginElem.removeAttr('readonly') ;
                $loginElem.focus() ;
            }
            commandSet() ;

        }, 300);
    } ;
    /**
     *  проверяет допустимость заполнения конкретного поля
     *  формирует массив сообщений об ошибках
     * @param fldName          -  имя поля
     * @param fldVal           - значение
     * @param lengthMin        - мин число символов
     * @param lengthMax        - мах число символов
     * @param letterDigitFlag  - наличие букв и цифр в значении
     * @returns {boolean}      - ошибка
     */
    var fieldValidate = function(fldName,fldVal,lengthMin,lengthMax,letterDigitFlag) {
        var val = fldVal ;
        var error = false ;
        var messages = [] ;
        var messI = 0 ;
        var errorSymbols = '' ;
        var errorMessage = '' ;
        var letterFlag = false ;     // наличие буквы
        var digitFlag = false ;      // наличие цифры
        var directText = false ;     // прямой текст без перевода
        var subst = {} ;             // вектор подстановок
        var br = '<br>' ;
        if (val.length < lengthMin || val.length > lengthMax) {
            error = true ;
            subst['lengthMin'] = lengthMin ;
            subst['lengthMax'] = lengthMax ;
            messages[messI++] = 'fieldLengthRange' ; // 'Длина поля должна быть в интервале: от '+ lengthMin+ ' до '+lengthMax ;
        }

        for (var i = 0; i < val.length ; i++) {
            var ch = val[i] ;
            if ( !(ch >= 'a' && ch <='z' || ch >= 'A' && ch <='Z' || ch >= '0' && ch <='9' || ch == '_') ) {
                errorSymbols += ch ;
            }
            letterFlag = (letterFlag || (ch >= 'a' && ch <='z' || ch >= 'A' && ch <='Z')) ;
            digitFlag = (digitFlag || (ch >= '0' && ch <='9')) ;
        }
        error = (error || errorSymbols.length > 0) ;


        if (letterDigitFlag) {       // наличие буквы - цыфры
            if (!(letterFlag && digitFlag)) {
                error = true ;
                // 'Обязательно наличие одной буквы и одной цифры.' ;
                messages[messI++] = 'obligatoryPresenceLetterDigit' ;
            }
        }
        if (errorSymbols.length > 0) {
            // 'Недопустимые символы:  ' + errorSymbols;
            subst['errorSymbols'] = errorSymbols ;
            message[messI++] = 'invalidCharacters' ;
        }
        messagesShow(fldName,error,messages,subst) ;
        return error ;
    } ;
    var messagesShow = function(fldName,error,messages,subst,directText) {
        // Оборачиваем в массив (если не массив)
        if (typeof(messages) == 'string') {
            messages =  [messages] ;
        }
        directText = (typeof(directText) !== 'boolean') ? false : directText ;
        subst = (typeof(subst) == undefined) ? {} : subst ;

        // сохранить на случай перевывода при изменении языка
        currentMessage['fldName'] = fldName ;
        currentMessage['messages'] = messages ;
        currentMessage['error'] = error ;
        currentMessage['subst'] = subst ;
        currentMessage['directText'] = directText ;
        //------------------------------
        var lang = paramSet.currentLang.toLowerCase() ; // тек язык
        var langMod = _this.langModule ;
        var messageTab = langMod.messageTab ;
        var br = '<br>' ;
        $messageText.empty() ;
        var messageLine = '' ;
        if (typeof(fldName) == 'string' && fldName.length > 0 ) {
            subst['fieldName'] = fldName ;
            messageLine = messageLineBuild('fieldName',subst,directText) ;
            $messageText.append(messageLine+br);
        }
        for (var i = 0; i < messages.length; i++) {
            messageLine = messageLineBuild(messages[i],subst,directText) ;
            $messageText.append(messageLine+br);
        }
        var cssClass = (error) ? MESSAGE_ERROR_CSS : MESSAGE_INFO_CSS ;
        $messageText.removeClass() ;
        $messageText.addClass(cssClass) ;


    } ;
    /**
     * Построить строку сообщений
     * в строке возможны подстановки вида '{parameter}'
     * @param message   - текст
     * @param subst     - вектор подстановок
     */
    var messageLineBuild = function(message,subst) {
        while (message.indexOf('{') >= 0 )
        {
            var posBeg = message.indexOf('{');
            var posEnd = message.indexOf('}');
            if (posBeg >=0 && posEnd >= 0) {
                var param = message.substr(posBeg,posEnd - posBeg +1) ;
                param = param.substr(1,param.length - 2) ;
                if (typeof(subst[param]) !== undefined ) {
                    var val = subst[param] ;
                    var leftPart = message.substr(0,posBeg - 1) ;
                    var rightPart = message.substr(posEnd +1) ;
                    message = leftPart + val + rightPart ;
                }
            }
        }
        return message ;
    } ;

   this.formShow = function() {
        var lang = paramSet.currentLang.toLowerCase() ;
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
        if(currentMessage['messages'].length > 0) {            // перевывод текущего сообщения
            messagesShow(
                currentMessage['fldName'],
                currentMessage['error'],
                currentMessage['messages'],
                currentMessage['subst'],
               currentMessage['directText']) ;
        }
    } ;

    var fieldShow = function(fldId,fldName) {
        $('#'+fldId).text(fldName) ;
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

