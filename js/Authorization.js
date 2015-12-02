/**
 * Управление авторизацией
 */
function Authorization() {
    //this.ajaxExecute = paramSet.ajaxExecute;
    // формы авторизации
    var enterForm ;               // авторизация ;
    var registrationForm ;        // регистрация
    var profileForm   ;           // профиль
    var _this = this;

    this.init = function() {

        enterForm = paramSet.enterForm ;                 // авторизация ;
        registrationForm = paramSet.registrationForm;    // регистрация
        profileForm  = paramSet.profileForm ;            // профиль

        registrationForm.currentDialog.attr('hidden', '');
        profileForm.currentDialog.attr('hidden', '');
        enterForm.currentDialog.attr('hidden', '');
    };
    this.go = function() {
       enterForm.edit();
    } ;

}