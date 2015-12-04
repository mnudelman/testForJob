/**
 * Модуль таблиц для вывода элементов формы на заданном языке
 */
function RegistrationFormLangModule() {
    this.titleTab = {'ru': 'Регистрация', 'en': 'Registration'};
    this.fieldTab = {
        'login': {
            labelId: 'regLoginLabel',
            labelText: {'ru': 'логин', 'en': 'login'},
            'htmlId' : 'regLogin'
        },
        'password': {
            labelId: 'regPasswordLabel',
            labelText: {'ru': 'пароль', 'en': 'password'},
            'htmlId' : 'regPassword'
        },
        'passwordRepeat': {
            labelId: 'regPasswordRepeatLabel',
            labelText: {'ru': 'Повторите пароль', 'en': 'Repeat password'},
            'htmlId' : 'regRepeatPassword'
        }
    };
    this.cmdTab = {
        'cmdProfile': {'ru': 'Профиль', 'en': 'Profile'},
        'cmdBreak': {'ru': 'Прервать', 'en': 'Break'},
        'cmdOk': {'ru': 'oK!', 'en': 'oK!'}
    };



    this.messageTab = {
        'description': {
            'ru': '1.Допустимые символы для заполнения: латинские буквы <strong>a...z(A...Z)</strong>,' +
            'цифры <strong>0...9</strong>,символ подчёркивания <strong>"_"</strong><br> ' +
            '2.поле <strong>login</strong> должно быть длиной не менее <strong>6</strong>' +
            ' символов и не более <strong>20</strong> символов.<br>' +
            '3.поле <strong>password</strong> должно быть длиной не менее <strong>8</strong> символов и ' +
            'не более <strong>20</strong> символов<br>' +
            'в пароле должна быть хотя бы <strong>одна буква</strong> и хотя бы <strong>одна цифра</strong>',

            'en': 'Valid characters to fill: latin letters <strong>a...z(A...Z)</strong>,' +
            'digits <strong>0...9</strong>,the underscore <strong> "_"  </strong> <br> ' +
            '2.field <strong>login</strong> must be a minimum length of <strong>6</strong>' +
            ' symbols and no more <strong>20</strong> symbols.<br>' +
            '3.field <strong>password</strong> must be a minimum length of <strong>8</strong> ' +
            'symbols and no more <strong>20</strong> symbols<br>' +
            'your password should be at least  <strong>one letter</strong> and at least<strong>one digit</strong>'
        },
        'fieldLengthRange': {
            'ru': 'ОШИБКА: Длина поля(число символов) в интервале <strong>от {lengthMin} до {lengthMax}</strong>',
            'en': 'ERROR: Field length(number of characters) in the range <strong>from {lengthMin} to {lengthMax}</strong>'
        },
        'fieldsMustBeFilled': {
            'ru': 'ОШИБКА: поля <strong>"логин","пароль"</strong> должны быть заполнены.',
            'en': 'ERROR: Fields <strong>"login","password"</strong> must be filled.'
        },
        'noAnswerFromDB': {
            'ru': 'ОШИБКА: Нет ответа от базы данных.',
            'en': 'ERROR: No answer from the database.'
        },
        'registrationCompleted': {
            'ru': 'oK! Регистрация выполнена<br> ' +
            'Можете перейти к <strong>заполнению профиля</strong> или сделать это позднее',
            'en': 'oK! The registration is completed.<br>' +
            'Can go to the <strong>profile</strong> or to do it later'
        },
        'obligatoryPresenceLetterDigit': {
            'ru': 'ОШИБКА: В пароле должна быть хотя бы <strong>одна буква</strong> и хотя бы <strong>одна цифра</strong>',
            'en': 'ERROR: Your password should be at least  <strong>one letter</strong> and at least<strong>one digit</strong>'
        },
        'invalidCharacters': {
            'ru': 'ОШИБКА: Недопустимые символы:<strong> {errorSymbols}</strong>',
            'en': 'ERROR: Invalid characters:<strong> {errorSymbols}</strong>'
        },
        'fieldName': {
            'ru': 'Поле: <strong>{fieldName}</strong>',
            'en': 'Field: <strong>{fieldName}</strong>'
        },
        'passwordRepeat': {
            'ru': 'ОШИБКА: Поля <strong>"Пароль", "Повторите пароль"</strong>  должны полностью совпадать',
            'en': 'ERROR: Поля <strong>"Password", "Repeat password"</strong>  must match exactly'
        }
    };
    this.symbolSets = {
        'uppercaseLatin': {
            'range': ['A', 'Z'],
            'name': {
                'ru': 'Заглавные латинские <strong>(A..Z)</strong>',
                'en': 'Uppercase latin letters <strong>(A..Z)</strong> '
            }
        },
        'lowercaseLatin': {
            'range': ['a', 'z'],
            'name': {
                'ru': 'Строчные латинские <strong>(a..z)</strong>',
                'en': 'Lowercase latin letters <strong>(a..z)</strong> '
            }
        },
        'digits': {
            'range': ['0', '9'],
            'name': {
                'ru': 'Десятичные цифры <strong>(0..9)</strong>',
                'en': 'Decimal digits <strong>(0..9)</strong> '
            }
        },
        'underscore': {
            'symbols': ['_'],
            'name': {
                'ru': 'Символ подчёркивания <strong>"_"</strong>',
                'en': 'Underscore <strong>"_"</strong> '
            }
        }
    };
    this.fieldRules = {
        'login': {
            'symbolSet': {
                'sets': ['lowercaseLatin', 'uppercaseLatin', 'underscore'],
                'message': {'no': 'invalidCharacters'}
            },
            'length': {
                'range': [6, 20],
                'message': {'no': 'fieldLengthRange'}
            }
        },
        'password': {
            'symbolSet': {
                'sets': ['lowercaseLatin', 'uppercaseLatin', 'underscore'],
                'message': {'no': 'invalidCharacters'}
            },
            'length': {
                'range': [8, 20],
                'message': {'no': 'fieldLengthRange'}
            },
            'obligatoryPresence': {
                'sets': [['lowercaseLatin', 'uppercaseLatin'], ['digits']],
                'message': {'no': 'obligatoryPresenceLetterDigit'}
            }
        },
        'passwordRepeat': {
            'fieldRelation': {
                'eq': ['password', 'passwordRepeat'],
                'message': {'no': 'passwordRepeat'}
            }
        }
    };


}

