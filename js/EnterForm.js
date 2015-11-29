/**
 *  форма входа (авторизации)
 */

function EnterForm() {
    var ajaxExecute = paramSet.ajaxExecute;
    // формы авторизации
    var registrationForm ;  // регистрация
    var profileForm  ;      // профиль

    // --- объекты jQuery ввода пароля
    var $loginElem = $('#login');
    var $passwordElem = $('#password');
    var $descriptionText = $('#descriptionText');
    var $messageText = $('#messageText');
    var $DESCRIPTION_TEXT = 'Для ознакомления с работой сайта нажмите<strong> <I> "guest" </I></strong> или<strong> <I>Esc</I></strong> <br>' +
        'Если Вы зарегистрированный пользователь заполните  поля <strong><I>login,password</I></strong> ' +
        'и нажмите <strong><I>"enter"</I> </strong> <br>' +
        'Если вы хотите пройти регистрацию, то нажмите<strong> <I> "new name"</I> </strong> ';

    var USER_TYP_GUEST = 'guest';
    var USER_TYP_USER = 'user';
    this.currentDialog = $('#enterDialog') ;
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
    this.nextStep = '' ;    // следующий шаг авторизации

    // открыть
    // ---------------------
    this.edit = function () {
        registrationForm = paramSet.registrationForm;  // регистрация
        profileForm  = paramSet.profileForm ;          // профиль



        $('#enterDialog').dialog({
            title: 'authorization',
            width: 500,
            modal: true,
            buttons: [
                {
                    text: "guest",
                    click: function () {
                        EnterFormClick(false, true, USER_TYP_GUEST);
                    }
                },
                {
                    text: "enter",
                    click: function () {
                        EnterFormClick(false, false, USER_TYP_USER);
                    }
                },
                {
                    text: "new name",
                    click: function () {
                        _this.currentDialog.dialog('close');
                        //var regForm = new RegistrationForm() ;
                        // var regForm = aunew RegistrationForm() ;
                        registrationForm.edit();
                        // regForm.edit() ;
                    }
                }
            ],
            beforeClose: function (event, ui) {

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

        $descriptionText.empty();
        $descriptionText.append($DESCRIPTION_TEXT);
        $descriptionText.css({'border': ' 2px solid green'});

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

            message = 'INFO:Вы вошли на сайт как ГОСТЬ' ;
            ready = true;
            enterReady(ready,message,userTyp) ;
        } else {
            var log = authorizationVect['login'];
            var passw = authorizationVect['password'];
            if (log.length == 0 || passw.length == 0) {
                message = 'ERROR:поля login,password должны быть заполнены!';
            } else {

                ajaxExecute.getData(authorizationVect, true);
                var tmpTimer = setInterval(function () {
                    var answ = ajaxExecute.getRequestResult();
                    if (false == answ || undefined == answ) {
                        message = 'ERROR:Нет ответа от БД';
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
       if (ready) {
            $descriptionText.empty() ;
            $messageText.css({'border': ' 2px solid blue', 'color': 'blue'});
            $messageText.append(message);

// переопределяем кнопки при отсутствии ошибок
            if (userTyp == USER_TYP_GUEST) {
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

                       $('#loginFields').empty() ;
                       $('#enterDialog').dialog("option", "buttons", [
                           {
                               text: "oK!",                        // для гостя только ok!
                               click: function () {
                                   $('#enterDialog').dialog("close");

                               }
                           }
                       ]);

                   }
               }, 300);






               $loginElem.attr('readonly','readonly') ;
               $passwordElem.attr('readonly','readonly') ;
               $('#enterDialog').dialog("option", "buttons", [
                   {
                       text: "oK!",
                       click: function () {
                           $('#enterDialog').dialog("close");

                       }
                   },
                   {
                       text: "profile show/edit",      // добавляется кнопка перехода в профиль
                       click: function () {

                           alert('profileEditSelect') ;

                           $('#enterDialog').dialog("close");
                           profileForm.edit() ;

                       }
                   }
               ]);
           }

        } else {
            $messageText.css({'border': ' 2px solid red', 'color': 'red'});
            $messageText.append(message);
        }

    }

}
