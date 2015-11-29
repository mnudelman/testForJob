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
        //enterForm.edit() ;
        //currentStep = enterForm.nextStep ;
    };
    this.go = function() {
       enterForm.edit();

    } ;
    this.messageOut = function(fldName, error, messages,$messageText) {
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
}