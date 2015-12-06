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
    var currentFieldId ;            // контролируемое поле
    var currentMessages = {} ;      // сообщения

    var _this = this ;


    this.init = function(formModule,$descDiv,$messDiv) {
        lang = paramSet.currentLang.toLowerCase();    // текущий язык
        formMod = formModule;                         //  модуль формы
        titleTab = formMod.titleTab;                  // заголовок формы
        fieldTab = formMod.fieldTab;                  // таблица полей
        cmdTab = formMod.cmdTab;                      // табл командных кнопок
        messageTab = formMod.messageTab;              // табл сообщений
        symbolSets = formMod.symbolSets;
        fieldRules = formMod.fieldRules;
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
        currentMessages = {} ;
        if (currentRul['symbolSet'] !== undefined) { // проверить на множество значений
            checkSetValue(currentRul['symbolSet'],'symbolSets') ;
        }
        if (currentRul['length'] !== undefined) {    // проверить на длину
            checkLength(currentRul['length'],'length') ;
        }
        if (currentRul['obligatoryPresence'] !== undefined ) { // обязательные символы
            checkObligatoryPresence(currentRul['obligatoryPresence'],'OP') ;
        }
        if (currentRul['fieldRelation'] !== undefined ) {   // свяь со значениями дргих полей
            checkFieldRelation(currentRul['fieldRelation'],'fieldRelation') ;
        }
    } ;
    /**
     * проверить на принадлежность множествуСимволов
     * @param setDescript
     * @returns {boolean}
     */
    var checkSetValue = function(setDescript,checkName) {
        var sets = (setDescript['sets'] !== undefined) ? setDescript['sets'] : [] ;
        var fieldValue =  getFieldVal() ;
        var success = false ;
        var errorSymbols = '' ;         // недопусти
        for (var i = 0 ; i < fieldValue.length ; i++ ) {
            var symb  = fieldValue[i] ;
            for (var j = 0; j < sets.length; j++) {
                var setId = sets[j] ;
                if (isSetIncludes(symb,setId)) {
                    success = true ;
                    break ;
                }
            }
            if (!success) {
                errorSymbols += symb ;       //
            }
        }
        if (success) {
            return true ;
        }
        // ошибка формировать сообщение //
        var messageId = setDescript['message']['no'] ;
        if (messageId !== undefined) {
            currentMessages[checkName] = {
                messageId: messageId,
                'subst': {'errorSymbols': errorSymbols}
            }
        }
    };
    /**
     * проверяет принадлежность элемента(символа) заданному множеству
     * @param elemSymb
     * @param setId
     */
    var isSetIncludes = function(elemSymb,setId) {
        var success = false ;
        var setDescript = formMod.symbolSets[setId] ;
        if (setDescript == undefined) {
            return false ;
        }
        // множество задано интервалом [min,max]
        var range = setDescript['range'] ;
        if (typeof(range) == 'object') {
            var min = range[0] ;
            var max = range[1] ;
            if (elemSymb >= min && elemSymb <= max) {
                success = true ;
            }
        }
        // множество задано списком символов
        var symbols =  setDescript['symbols'] ;
        if (typeof(symbols) == 'object') {
            for (var i = 0; i < symbols.length; i++) {
                if (elemSymb == symbols[i]) {
                    success = true ;
                    break ;
                }
            }
        }
        return success ;

    } ;
    /**
     * Значение поля
     * @returns {string}
     */
    var getFieldVal = function(fldId) {
        fldId = (fldId == undefined ) ? currentFieldId : fldId ;
       var htmlId = fieldTab[fldId]['htmlId'] ;
       var val = $('#'+htmlId).val() ;
       return val ;
    } ;
    /**
     * проверка длины
     * @param lengthDescript - описатель длины
     * @returns {boolean}
     */
    var checkLength = function(lengthDescript,checkName) {
        var range = (lengthDescript['range'] !== undefined) ? lengthDescript['range'] : [0,0] ;
        var fieldValue =  getFieldVal() ;
        var success = false ;
        var len = fieldValue.length ;
        var min = range[0] ;
        var max = range[1] ;
        success = (len >= min && len <= max) ;
        if (!success) {
            var messageId = lengthDescript['message']['no'] ;
            if (messageId !== undefined) {
                currentMessages[checkName] = {
                    messageId: messageId,
                    'subst': {'lengthMin': min, 'lengthMax': max}
                }
            }
        }
        return success ;
    } ;
    /**
     * Обязательные символы
     */
    var checkObligatoryPresence = function(OPDescript,checkName) {
        var sets = OPDescript['sets'] ;
        var fieldValue =  getFieldVal() ;
        var success = true ;
        var isContained = {} ;    // вектор наличия элемента множества - для отладки
        var setsNames = '' ;     // список имён множеств
        for (var i = 0; i< sets.length; i++ ) {
            var setId = sets[i]  ;
            isContained[setId] = false ;
            setsNames += ((setsNames.length > 0) ? ',' : '') + getSetName(setId) ;
            var success_i = false ;
            for (var j = 0; j < fieldValue.length; j++ ) {
                var symb = fieldValue[i] ;
                if (isSetIncludes(symb,setId)) {
                    isContained[setId] = true ;
                    success_i  = true ;
                    break ;
                }
            }
            success = success && success_i ;


        }
        if (!success) {
            var messageId = OPDescript['message']['no'] ;
            if (messageId !== undefined) {
                currentMessages[checkName] = {
                    messageId: messageId,
                    'subst': {'setsNames': setsNames}
                }
            }
        }

    } ;
    /**
     * Получить имя множества
     * @param setId
     */
    var getSetName = function(setId) {
        return symbolSets[setId]['name'] ;
    } ;
    /**
     * проверить связь полей
     * @param fieldRelationDescript
     */
    var checkFieldRelation = function(fieldRelationDescript,checkName) {
        var success = true ;
        var relationOperators = ['eq','lt','gt'] ;
        for (var i = 0 ; i < relationOperators.length ; i++) {
            var opCod = relationOperators[i] ;
            if (fieldRelationDescript[opCod] == undefined) {
                continue ;
            }
            var fld1 = fieldRelationDescript[opCod]['fields'][0] ;
            var fld2 =  fieldRelationDescript[opCod]['fields'][1] ;
            var valFld1 = getFieldVal(fld1) ;
            var valFld2 = getFieldVal(fld2) ;
            var success_i = true ;
            switch (opCod) {
                case 'eq' :          // ==
                    success_i =(valFld1 == valFld2) ;
                    break ;
                case 'lt' :          // <
                    success_i =(valFld1 < valFld2) ;
                    break ;
                case 'gt' :          // >
                    success_i =(valFld1 > valFld2) ;
                    break ;
            }
            success = success && success_i ;
            if (!success_i) {
                var messageId = fieldRelationDescript[opCod]['message']['no'] ;
                var fldName1 = getFieldName(fld1) ;
                var fldName2 = getFieldName(fld2) ;
                if (messageId !== undefined) {
                    currentMessages[checkName] = {
                        messageId: messageId,
                        'subst': {'fields': [fldName1,fldName2]}
                    }
                }
            }
        }
        return success ;
    };
    /**
     * имя поля по его идентификатору
     * @param fieldId
     * @returns {string}
     */
    var getFieldName = function(fieldId) {
        return  fieldTab[fieldId]['labelText'] ;
    }

  }