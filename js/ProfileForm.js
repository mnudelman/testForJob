/**
 *  форма редактирования профиля пользователя
 *
 */

function ProfileForm(authorizationObj) {
    var ajaxExecute = paramSet.ajaxExecute;
    // --- объекты jQuery ввода пароля
    var filePhoto = '' ;

    var _this = this;
    // атрибуты авторизации
    this.currentDialog = $('#profDialog');
    var profile = {
        'surname' :{'val': '','field' : $('#proSurname')},
        'name'    :{'val': '','field' : $('#proName')},
        'patronymic' :{'val': '','field' : $('#proPatronymic')},
        'email' : {'val': '','field' : $('#proEmail')},
        'tel'    : {'val': '','field' : $('#proTel')},
        'sex'    : {'val': '','field' : $('[name="sex"]')},
        'birthday': {'val': '','field' : $('#proBirthday')},
        'info'    : {'val': '','field' : $('#proInfo')},
        'filePhoto': {'val': '','field' : $('#proAddPhoto')}
    } ;
    var $messageText = $('#proMessageText') ;
    var $emailField = $('#proEmail') ;
    var userLogin  ;
    var profileImport = {} ;    // массив для импорта профиля
    var requestReady = false ;  // флаг завершения запроса
    this.formModule = new ProfileFormModule() ;     // модуль описателей формы
    var checkService  ;          // объект контроля полей

    // ---------------------
    /**
     * сделать доступным  профиль пользователя
     * (например, для определения фото и имени в меню)
     */
    this.getProfile = function() {
        userLogin = paramSet.user['login'] ;
       requestReady = false ;
        getFromDb() ;         // запускает формирование profileImport
    } ;
    /**
     * проверяет завершение запроса к БД
     * @returns {boolean}
     */
    this.isRequestReady = function() {
       return requestReady ;
    } ;
    /**
     * размещает profile в paramSet(открывает доступ)
     */
    this.profileAccess  = function() {
        paramSet.setProfile(profileImport) ;
    } ;
    this.edit = function () {
        paramSet.currentForm = _this ;                // сохраняем текущую форму
        checkService = paramSet.checkService ;          // объект контроля полей
        checkService.init(_this.formModule,undefined,$messageText) ;


       userLogin = paramSet.user['login'] ;
        _this.currentDialog.dialog({
            title: 'profile',
            width: 500,
            modal: true,
            beforeClose: function (event, ui) {
                paramSet.currentForm = '' ;              // чистить текущую форму
                paramSet.setProfile(profileImport) ;     // доступ к текущему профилю
                var topMenu =paramSet.topMenu ;
                topMenu.showUser() ;
            }
        });
        addPhotoInit() ;
        getFromDb() ;

        $("#proBirthday").datepicker({changeMonth:true,
            changeYear:true,
            minDate: new Date(1915, 0,1),
            maxDate: new Date(2010, 11,31),
            'yearRange':'1915:2010',
            'showOn': "both" ,
            dateFormat: "yy-mm-dd" ,
            'onSelect' : function(date,picker){
                var normalDate = picker.selectedYear + '-' +
                    picker.selectedMonth + '-' +
                    picker.selectedDay ;
                var d = new Date(picker.selectedYear,picker.selectedMonth,picker.selectedDay) ;
                $("#proBirthDay").val(d) ;
                $("#proBirthday").datepicker('setDate',d) ;
            }
        } )  ;
        $('#proSexMan').focus(function(){
                $('#proSexMan').attr('checked',"checked") ;
                $('#proSexWoman').removeAttr('checked') ;
        }) ;

        $('#proSexWoman').focus(function(){
            $('#proSexMan').removeAttr('checked') ;
            $('#proSexWoman').attr('checked',"checked") ;
        }) ;
  //////////////////////////////////////////////////////////

        $emailField.blur(function(){
            $messageText.empty() ;
            checkService.syntaxChecking('email') ;
        }) ;

        _this.formShow() ;

        // закрыть поля кроме login

        $messageText.empty();

    };
    /**
     * вычисляет набор командных кнопок в зависимости от полноты заполнения
     */
    var commandSet = function () {
        var langMod = _this.formModule ;
        var lang = paramSet.currentLang.toLowerCase() ;
        var cmdTab = langMod.cmdTab ;

        var cmdName = cmdTab['cmdProfile'][lang] ;
        var cmdProfile = {
            text: cmdName,                                             // "save",
            click: function () {
                sendToDb() ;      // сохранить в БД
            }
        };
        var cmdName = cmdTab['cmdBreak'][lang] ;
        var cmdBreak = {
            text: cmdName,                                             // "break",
            click: function () {
                _this.currentDialog.dialog('close');
            }
        };
        _this.currentDialog.dialog("option", "buttons", [
            cmdProfile,                                  // добавляется кнопка profile
            cmdBreak
        ]);

    };

    /**
     * читать профиль из БД
     */
    var getFromDb = function() {
        requestReady = false ;                     // запрос готов
        var error = false;
        var profileData = profileDataDef('get') ;
        var getSuccessful = false ;
        var message = '';
        ajaxExecute.getData(profileData);
        var tmpTimer = setInterval(function () {
            var answ = ajaxExecute.getRequestResult();
            if (false == answ || undefined == answ) {
                message = 'ERROR:Нет ответа от БД';
                getSuccessful = false;
            } else {
                clearInterval(tmpTimer);
                message = answ['message'];



                if (answ['successful'] == true) {
                    getSuccessful = true ;
                } else {
                    getSuccessful = false;
                    message = answ['message'];
                }

                if (getSuccessful) {
                    profileDataGetFromDb(answ) ;
                } else {
                    $messageText.append(message) ;
                }
                requestReady = true ;                     // запрос готов
            }
  //          commandSet();

        }, 300);
    };

    /**
     * отправить профиль в БД
     */
    var sendToDb = function() {
        var error = false;
        var profileData = profileDataDef('set') ;
        profileData = profileDataSendToDb(profileData) ;   // текущие значения
        var setSuccessful = false ;
        var message = '';
        ajaxExecute.getData(profileData);
        var tmpTimer = setInterval(function () {
            var answ = ajaxExecute.getRequestResult();
            if (false == answ || undefined == answ) {
                message = 'ERROR:Нет ответа от БД';
                setSuccessful = false;
            } else {
                clearInterval(tmpTimer);
                message = answ['message'];


                if (answ['successful'] == true) {
                    setSuccessful = true ;
                } else {
                    setSuccessful = false;
                    message = answ['message'];
                }
            }

            if (setSuccessful) {

            } else {
            }


        }, 300);
    };


    /**
     * инициализация массива для передачи в БД
     * @param opcod
     * @returns {{typ: string, login: *}}
     */
    var profileDataDef = function(opcod) {
        var profileData = {
            typ: opcod+'Profile',
            login: userLogin
        } ;
        var fields = ',' ;
        for (var key in profile) {
            profileData[key] = '' ;
            fields += key+',' ;
        }
        profileData['fields'] = fields ;
        return profileData ;

    } ;
    /**
     * данные из БД, полученные через ajax
     * поля  sex,birthday,filePhoto требуют спец обработки
     *     готовится profileImport - текущее значение профиля
     * @param answ   - массив, полученный через ajax
     */
    var profileDataGetFromDb = function(answ) {

        profileImport = {} ;      //  текущее значение профиля

        for (var key in profile) {
            if (answ[key] !== undefined) {
                var field = profile[key]['field'] ;
                var val = answ[key] ;

                profileImport[key] = val ;

                switch(key) {
                    case 'sex':
                        sexField('set',val) ;
                        break;
                    case 'birthday' :
                        birthdayField('set',val) ;
                        break ;
                    case 'filePhoto' :
                        photoFileField('set',val) ;
                        break ;
                    default :
                        field.val(val) ;
                }
            }
        }
    } ;
    /**
     *  подготовка к передаче profile через  ajax
     *   поля  sex,birthday,filePhoto требуют спец обработки
     *    готовится profileImport - текущее значение профиля
     * @param profData - массив для передачи через ajax
     * @returns {*}   - profData с заполненными полями profile
     */
    var profileDataSendToDb = function(profData) {

        profileImport = {} ;    //  текущее значение профиля

        for (var key in profile) {
            var field = profile[key]['field'];
            var value = '';
            switch (key) {
                case 'sex':
                    value = sexField('get');
                    break;
                case 'birthday' :
                    value = birthdayField('get');
                    break;
                case 'filePhoto' :
                    value = photoFileField('get');
                    break;
                default :
                    value = field.val();
            }
            value = (value == undefined) ? '' : value ;
            profData[key] = value;

            profileImport[key] = value ;

        }
        return profData ;
    } ;
    /**
     * обработчик поля  sex
     * @param opCod   = {get | set}
     * @param value
     * @returns {string}
     */
    var sexField = function(opCod,value) {
       if (opCod == 'set') {
           if (value == 'm') {
               $('#proSexMan').attr('checked',"checked") ;
               $('#proSexWoman').removeAttr('checked') ;
           } else {
               $('#proSexMan').removeAttr('checked') ;
               $('#proSexWoman').attr('checked','checked') ;
           }
       } else {
           return ($('#proSexMan').attr('checked') !== undefined ) ? 'm' : 'w' ;
       }
    } ;
    /**
     * обработчик поля birthday
     * @param opcod
     * @param value
     * @returns {*|jQuery}
     */
    var birthdayField = function(opCod,value) {
       if (opCod == 'set') {
           value = (value == undefined || value.length == 0) ? "2010-01-01" : value ;
           var arr = value.split('-') ;
           var yy = arr[0] ;
           var mm = arr[1] ;
           var dd = arr[2] ;
           var d = new Date(yy,mm,dd) ;
           $("#proBirthday").datepicker('setDate',d) ;
           $("#proBirthday").val(value) ;
       } else {
           var d = $("#proBirthday").val() ;
           return d ;
       }
    } ;
    var photoFileField = function(opCod,value) {
        if (opCod == 'set') {
            filePhoto = value ;
            if(value.length == 0 ) {
                $('#userPhoto').attr('src', './images/people.png');
            } else {
                $('#userPhoto').attr('src', './photos/' + filePhoto);
            }

        } else {
            return filePhoto ;
        }

    } ;


    /**
     * вывод текста в область сообщений
     * @param fldName
     * @param error
     * @param messages
     */
    var messageOut = function (fldName, error, messages) {
        var br = '<br>';
        $messageText.empty();
        if (error) {

            $messageText.css({'border': ' 2px solid red', 'color': 'red'});

        }else if (!error && messages.length > 0) {
            $messageText.css({'border': ' 2px solid blue', 'color': 'blue'});
        }
        else {
            $messageText.css({'border': '0'});
        }
        if (messages.length > 0) {
            var errorMessage = 'поле:<strong>' + fldName + '</strong> ' + br;
            for (var i = 0; i < messages.length; i++) {
                errorMessage += messages[i] + br;
            }
            $messageText.append(errorMessage);
        }

    };
    /**
     * инициализация кнопки добавленияФото
     * используется пакет  ajaxupload
     * идея взята из http://ajaxs.ru/lesson/ajax/108-zagruzchik_izobrazhenij_na_server.html
     * имя загруженного файла на сайт совпадает с login
     */
    var addPhotoInit = function () {
        var userlogin = paramSet.user['login'] ; // текущий login
        var btnUpload = $('#addPhoto');
        var phpProg = paramSet.windowLocationHost+'/upload-file.php' ;
        var status = $('#proMessage');
        var messsages = [] ;
        var error = false ;

        new AjaxUpload(btnUpload, {
            action: phpProg,
            data: {imgName: paramSet.user['login'] },
            name: 'uploadfile',
            onSubmit: function (file, ext) {
                if (!(ext && /^(jpg|png|jpeg|gif)$/.test(ext))) {
                    // extension is not allowed
                    messsages[0] = 'файл:'+file ;
                    messsages[1] = 'ERROR:Поддерживаемые форматы JPG, PNG, GIF' ;
                    error = true ;
                    messageOut('Photo',error,messsages) ;
                    return false;
                }
                status.text('Загрузка...');
            },
            onComplete: function (file, response) {
                //On completion clear the status
                status.text(response);
                messsages[0] = 'файл:'+file ;
                messsages[1] = 'oK!:фотография добавлена на сайт' ;
                error = false ;
                messageOut('Photo',error,messsages) ;

                var userLogin = paramSet.user['login'] ;
                var arr = file.split('.');
                var ext = arr[1];
                file = userLogin + '.' + ext;
                photoFileField('set',file) ;
            }
        })

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
    /**
     * Вывод заголовка
     * @param title
     */
    var showTitle = function(title) {
        _this.currentDialog.dialog('option','title',title) ;
    } ;



}