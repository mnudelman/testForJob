/**
 * Модуль таблиц для вывода элементов topMenu на заданном языке
 */
function TopMenuModule() {
    this.fieldTab = {
        'profile': {
            labelId: 'mnuProfileLabel',
            labelText: {'ru': 'редактировать профиль', 'en': 'profile edit'},
            'htmlId': 'userProfileItem'
        },
        'changePassword': {
            labelId: 'mnuChangePasswordLabel',
            labelText: {'ru': 'изменить пароль', 'en': 'change password'},
            'htmlId': 'changePasswordItem'
        },
        'mnuEnter' : {
            labelId: 'enterLabel',
            labelText: {'ru': 'авторизация', 'en': 'authorization'},
            'htmlId': 'enterItem'
        } ,
        'mnuUserName': {
            labelId: 'mnuUserNameLabel',
            labelText: {'ru': 'Гость', 'en': 'Guest'},
            'htmlId': ''
        }
    }
}
