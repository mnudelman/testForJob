/**
 * Модуль таблиц для вывода элементов формы на заданном языке
 */
function RegistrationFormLangModule() {
    this.titleTab = {'ru':'Регистрация', 'en': 'Registration'} ;
    this.fieldTab = {
        'regLoginLabel' : {'ru' : 'логин', 'en' : 'login'},
        'regPasswordLabel' : {'ru' : 'пароль', 'en' : 'password'},
        'regPasswordRepeatLabel' : {'ru' : 'Повторите пароль', 'en' : 'Repeat password' }
    } ;
    this.cmdTab = {
        'cmdProfile' : {'ru': 'Профиль','en':'Profile'},
        'cmdBreak' : {'ru': 'Прервать','en':'Break'} ,
        'cmdOk' :    {'ru': 'oK!','en':'oK!'}
    } ;
    this.messageTab = {
        'description' : {
            'ru': '1.Допустимые символы для заполнения: латинские буквы <strong>a...z(A...Z)</strong>,' +
            'цифры <strong>0...9</strong>,символ подчёркивания <strong>"_"</strong><br> '+
            '2.поле <strong>login</strong> должно быть длиной не менее <strong>6</strong>' +
            ' символов и не более <strong>20</strong> символов.<br>' +
            '3.поле <strong>password</strong> должно быть длиной не менее <strong>8</strong> символов и ' +
            'не более <strong>20</strong> символов<br>'+
            'в пароле должна быть хотя бы <strong>одна буква</strong> и хотя бы <strong>одна цифра</strong>' ,

            'en' : 'Valid characters to fill: latin letters <strong>a...z(A...Z)</strong>,' +
            'digits <strong>0...9</strong>,the underscore <strong> "_"  </strong> <br> '+
            '2.field <strong>login</strong> must be a minimum length of <strong>6</strong>' +
            ' symbols and no more <strong>20</strong> symbols.<br>' +
            '3.field <strong>password</strong> must be a minimum length of <strong>8</strong> ' +
            'symbols and no more <strong>20</strong> symbols<br>'+
            'your password should be at least  <strong>one letter</strong> and at least<strong>one digit</strong>'
        },
        'loggedAsGuest' : {
            'ru': 'ИНФО:Вы вошли на сайт как ГОСТЬ(только просмотр)',
            'en': 'INFO:you are logged in as a GUEST(show only)'
        },
        'fieldsMustBeFilled' :{
            'ru':'ОШИБКА: поля "логин","пароль" должны быть заполнены.' ,
            'en': 'ERROR: Fields "login","password" must be filled.'
        },
        'noAnswerFromDB' :{
            'ru':'ОШИБКА: Нет ответа от базы данных.' ,
            'en': 'ERROR: No answer from the database.'
        }
    } ;
}

