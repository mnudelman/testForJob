/**
 * Модуль таблиц для вывода элементов формы на заданном языке
 */
function EnterFormModule() {
    this.titleTab = {'ru': 'Авторизация', 'en': 'authorization'};
    this.fieldTab = {
        'login': {
            labelId: 'loginLabel',
            labelText: {'ru': 'логин', 'en': 'login'},
            'htmlId': 'login'
        },
        'password': {
            labelId: 'passwordLabel',
            labelText: {'ru': 'пароль', 'en': 'password'},
            'htmlId': 'password'
        }

    };
    this.cmdTab = {
        'cmdGuest': {'ru': 'Гость', 'en': 'Guest'},
        'cmdEnter': {'ru': 'Ввод', 'en': 'Enter'},
        'cmdOk': {'ru': 'oK!', 'en': 'oK!'},
        'cmdNewName': {'ru': 'Новое имя', 'en': 'New name'},
        'cmdProfile': {'ru': 'Профиль', 'en': 'Profile'}
    };
    this.messageTab = {
        'description': {
            'ru': 'Для ознакомления с работой сайта нажмите<strong> <I> "Гость" </I></strong> или<strong> <I>Esc</I></strong> <br>' +
            'Если Вы зарегистрированный пользователь заполните  поля <strong><I>логин,пароль</I></strong> ' +
            'и нажмите <strong><I>"Ввод"</I> </strong> <br>' +
            'Если вы хотите пройти регистрацию, то нажмите<strong> <I> "Новое имя"</I> </strong> ',
            'en': 'To review the operation of the site click<strong> <I> "Guest" </I></strong> or<strong> <I>Esc</I></strong> <br>' +
            'If You are a registered user fill out the fields: <strong><I>login,password</I></strong> ' +
            'and click <strong><I>"Enter"</I> </strong> <br>' +
            'If you wish to check, click<strong> <I> "New name"</I> </strong> '
        },
        'loggedAsGuest': {
            'ru': 'ИНФО:Вы вошли на сайт как ГОСТЬ(только просмотр)',
            'en': 'INFO:you are logged in as a GUEST(show only)'
        },
        'fieldsMustBeFilled': {
            'ru': 'ОШИБКА: поля "логин","пароль" должны быть заполнены.',
            'en': 'ERROR: Fields "login","password" must be filled.'
        },
        'noAnswerFromDB': {
            'ru': 'ОШИБКА: Нет ответа от базы данных.',
            'en': 'ERROR: No answer from the database.'
        }
    };
    this.fieldRules = {
        'login': {
            'length': {
                'range': [1, 40],
                'message': {'no': 'fieldsMustBeFilled'}
            }
        },
        'password': {
            'length': {
                'range': [1, 40],
                'message': {'no': 'fieldsMustBeFilled'}
            }
        }
    }
}