/**
 * Модуль таблиц для вывода элементов формы на заданном языке
 */
function ProfileFormModule() {
    this.titleTab = {'ru': 'Профиль', 'en': 'Profile'};
    this.fieldTab = {
        'surname': {
            labelId: 'proSurnameLabel',
            labelText: {'ru': 'фамилия', 'en': 'surname'},
            'htmlId' : 'proSurname'
        },
        'name': {
            labelId: 'proNameLabel',
            labelText: {'ru': 'имя', 'en': 'name'},
            'htmlId' : 'proName'
        },
        'patronymic': {
            labelId: 'proPatronymicLabel',
            labelText: {'ru': 'Отчество', 'en': 'Patronymic'},
            'htmlId' : 'proPatronymic'
        },
        'email': {
            labelId: 'proEmailLabel',
            labelText: {'ru': 'эл-почта', 'en': 'e-mail'},
            'htmlId' : 'proEmail'
        },
        'sex': {
            labelId: 'proSexLabel',
            labelText: {'ru': 'Пол', 'en': 'Sex'},
            'htmlId' : 'proSex'
        },
        'sexMan': {
            labelId: 'proSexManLabel',
            labelText: {'ru': 'мужской', 'en': 'man'},
            'css'    : {'font-weight': '500'},
            'htmlId' : 'proSexMan'
        },
        'sexWoman': {
            labelId: 'proSexWomanLabel',
            labelText: {'ru': 'женский', 'en': 'woman'},
            'css'    : {'font-weight': '500'},
            'htmlId' : 'proSexWoman'
        },
        'birthday': {
            labelId: 'proBirthdayLabel',
            labelText: {'ru': 'Дата рождения', 'en': 'Birthday'},
            'htmlId' : 'proBirthday'
        },
        'info': {
            labelId: 'proInfoLabel',
            labelText: {'ru': 'Произвольная информация о себе:', 'en': 'information about yourself:'},
            'htmlId' : 'proInfo'
        },
        'addPhooto': {
            labelId: 'addPhotoLabel',
            labelText: {'ru': 'Добавить фотографию', 'en': 'Add photo'},
            'htmlId' : 'addPhoto'
        }

    };
    this.cmdTab = {
        'cmdProfile': {'ru': 'сохранить', 'en': 'save'},
        'cmdBreak': {'ru': 'Прервать', 'en': 'Break'},
        'cmdOk': {'ru': 'oK!', 'en': 'oK!'}
    };



    this.messageTab = {
        'description': { 'ru': '', 'en': '' },
        'noAnswerFromDB': {
            'ru': 'ОШИБКА: Нет ответа от базы данных.',
            'en': 'ERROR: No answer from the database.'
        },
        'fieldName': {
            'ru': 'Поле: <strong>{fieldName}</strong>',
            'en': 'Field: <strong>{fieldName}</strong>'
        },
        'obligatoryPresence' : {
            'ru' : 'Обязательное присутствие символов из каждого из множеств:' +
            '<strong> {setsNames}</strong> ',
            'en' : 'Mandatory presence of characters from each of the sets :' +
            '<strong> {setsNames}</strong> '
        }
    };
    this.symbolSets = {
        'dogSymbol': {
            'symbols': ['@'],
            'name': {
                'ru': 'Символ "собака" <strong>"@"</strong>',
                'en': 'the dog is a symbol of the email <strong>"@"</strong> '
            }
        },
            'pointSymbol': {
                'symbols': ['.'],
                'name': {
                    'ru': 'Символ "точка" <strong>"."</strong>',
                    'en': 'the point symbol <strong>"."</strong> '
                }
        }
    } ;
    this.fieldRules = {
        'email': {
               'obligatoryPresence': {
                   'sets': ['dogSymbol','pointSymbol'],
                   'message': {'no': 'obligatoryPresence'}
               }
        }

    };


}


