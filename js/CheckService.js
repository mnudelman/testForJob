/**
 * Методы контроля заполнения полей и вывод сообщений
 */
function CheckService() {
    var lang =  paramSet.currentLang.toLowerCase();    // текущий язык
    var formMod ;                   // модуль описаний формы формы
    var titleTab ;                  // заголовок формы
    var fieldTab ;                  // таблица полей
    var cmdTab ;                    // табл командных кнопок
    var messageTab ;                // табл сообщений
    var symbolSets ;
    var fieldRules ;
    //---------------------------------------------------------
    var $descriptionDiv ;           // область вывода описания
    var $messageDiv ;               // область вывода сообщений
    //---------------------------------------------------------
    var currentFieldId ;
    var currentMessages = [] ;
    var _this = this ;


    this.init = function(formModule,$descDiv,$messDiv) {
        lang = paramSet.currentLang.toLowerCase();    // текущий язык
        formMod = langModule;                   // языковый модуль формы
        titleTab = formMod.titleTab;                  // заголовок формы
        fieldTab = formMod.fieldTab;                  // таблица полей
        cmdTab = formMod.cmdTab;                      // табл командных кнопок
        messageTab = formMod.messageTab;              // табл сообщений
        var symbolSets = formMod.symbolSets;
        var fieldRules = formMod.fieldRules;
        $descriptionDiv = $descDiv;
        $messageDiv = $messDiv;
    } ;
    /**
     * контроль синтаксиса
     */
    this.syntaxChecking = function(fldId) {
        currentFieldId = fldId ;
        if (fieldRules[fldId] == undefined) {    // нет контроля
            return true ;
        }
        var currentRul = fieldRules[fldId] ;
        currentMessages = [] ;
        if (currentRul['symbolSet'] !== undefined) {
            checkSetValue(currentRul['symbolSet']) ;
        }
        if (currentRul['length'] !== undefined) {
            checkLength() ;
        }
        if (currentRul['ObligatoryPresence'] !== undefined ) {
            checkObligatoryPresence() ;
        }
        if (currentRul['fieldRelation'] !== undefined ) {
            checkFieldRelation() ;
        }
    } ;

    var checkSetValue = function(setDescript) {
        var sets = (setDescript['sets'] !== undefined) ? setDescript['sets'] : [] ;
        var fieldValue =  getFieldVal() ;
        var success = false ;
        var errorSymbols = '' ;
        for (var i = 0 ; i < fieldValue.length ; i++ ) {
            var symb  = fieldValue[i] ;
            for (var j = 0; j < sets.length; j++) {
                var setId = sets[j] ;
                if (setIncludes(symb)) {
                    success = true ;
                    break ;
                }
            }
            if (!success) {
                errorSymbols += symb ;
            }
        }
        if (success) {
            return true ;
        }
        // ошибка формировать сообщение //

    };
    /**
     * Значение поля
     * @returns {string}
     */
    var getFieldVal = function() {
       return '' ;
    } ;
    var checkLength = function() {

    } ;
    var checkObligatoryPresence = function() {

    } ;
    var checkFieldRelation = function() {

    }

  }