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
    var currentError = {} ;         // наличие ошибки контроля
    //---------------------------------------------------------
    var MESSAGE_ERROR_CSS = 'messageError' ;   //  класс для вывода ошибок
    var MESSAGE_INFO_CSS = 'messageInfo' ;     //  класс для вывода информационных сообщений
    //---------------------------------------------------------
    var _this = this ;
    //---------------------------------------------------------
    /**
     * привязывает параметры формы
     * @param formModule    - описатели формы
     * @param $descDiv      - обда
     * @param $messDiv
     */
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
    this.changeLang = function() {
        lang = paramSet.currentLang.toLowerCase();    // текущий язык
    } ;
    this.setFieldId = function(fieldId) {
       currentFieldId = fieldId ;
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
        currentError = {} ;
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
        _this.checkMessage() ;     // вывод сообщений
        var error = false ;
        for (var checkName in currentError) {
            error = error || currentError[checkName]  ;
        }
        return error ;


    } ;
    /**
     * проверить на принадлежность множествуСимволов
     * @param setDescript
     * @returns {boolean}
     */
    var checkSetValue = function(setDescript,checkName) {
        var sets = (setDescript['sets'] !== undefined) ? setDescript['sets'] : [] ;
        var fieldValue =  getFieldVal() ;
        var success = true ;
        var errorSymbols = '' ;         // недопусти
        for (var i = 0 ; i < fieldValue.length ; i++ ) {
            var symb  = fieldValue[i] ;
            var success_i = false ;
            for (var j = 0; j < sets.length; j++) {
                var setId = sets[j] ;
                if (isSetIncludes(symb,setId)) {
                    success_i = true ;
                    break ;
                }
            }
            success = success && success_i ;
            if (!success_i) {
                errorSymbols += symb ;       //
            }
        }
        if (success) {
            return true ;
        }
        // ошибка формировать сообщение //
        currentError[checkName] = true ;
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
     * множество может быть контейнером [set1,set2,..]
     * @param elemSymb
     * @param setId
     */
    var isSetIncludes = function(elemSymb,setId) {
        var success = false ;
        var setDescript = formMod.symbolSets[setId] ;

        if (setDescript == undefined) {
            return false ;
        }
        var setContainer = [] ; // массив объектов-описателей множеств
        if (typeof(setDescript['sets']) == 'object') {
            var sets = setDescript['sets'] ;
            for (var i = 0; i < sets.length; i++) {
                var setId_i = sets[i] ;
                var descript_i = symbolSets[setId_i] ;
                if (typeof(descript_i) == 'object') {
                    setContainer[setContainer.length] = descript_i;
                }
            }
        }else {
            setContainer[setContainer.length] = setDescript ; // обернуть в []
        }
        for (var si = 0; si < setContainer.length; si++) {
            // множество задано интервалом [min,max]
            var currentSetDescript = setContainer[si] ;
            var range = currentSetDescript['range'] ;
            if (typeof(range) == 'object') {
                var min = range[0] ;
                var max = range[1] ;
                if (elemSymb >= min && elemSymb <= max) {
                    success = true ;
                }
            }
            // множество задано списком символов
            var symbols =  currentSetDescript['symbols'] ;
            if (typeof(symbols) == 'object') {
                for (var i = 0; i < symbols.length; i++) {
                    if (elemSymb == symbols[i]) {
                        success = true ;
                        break ;
                    }
                }
            }
            if (success) {
                break ;
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
            currentError[checkName] = true ;
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
        var isContained = {} ;    // вектор наличия элемента множества
        var setsNames = [] ;     // список имён множеств
        for (var i = 0; i< sets.length; i++ ) {
            var setId = sets[i]  ;
            isContained[setId] = false ;
            setsNames[setsNames.length] =  getSetName(setId) ;
            for (var j = 0; j < fieldValue.length; j++ ) {
                var symb = fieldValue[j] ;
                if (isSetIncludes(symb,setId)) {
                    isContained[setId] = true ;
                    break ;
                }
            }



        }
        // успех, когда заполнен объект isContained
        success = true ;
        for (var stkey in isContained) {
            success = success && isContained[stkey] ;
        }
        if (!success) {
            currentError[checkName] = true ;
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
            var fld1 = fieldRelationDescript[opCod][0] ;
            var fld2 =  fieldRelationDescript[opCod][1] ;
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
                currentError[checkName] = true ;
                var messageId = fieldRelationDescript['message']['no'] ;
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
    };
    /**
     * обрабатывает и выводит сообщения
     * @param parMessages - объект-список сообщений
     * @param parError    -
     * Если входные параметры undefined, то берутся текущие
     */
    this.checkMessage = function(parMessages,parError) {
        var messages = (parMessages == undefined) ? currentMessages : parMessages ;
        if (parMessages !== undefined) {
            currentMessages = parMessages ;
        }
        var messageLines = [] ;   // строки вывода
        for (var checkName in messages) {
            var message = messages[checkName] ;
            messageLines[messageLines.length] = messageLineBuild(message) ;
        }
        // Вывод строки в область сообщений
        var error = false ;
        if (parError == undefined) {
            for (checkName in currentError) {
                error = error || currentError[checkName]  ;
            }
        }else {
            error = parError ;
            currentError['parError'] = parError ;    // сохранить
        }
        if (messageLines.length > 0) {
            _this.messagesShow(messageLines,error) ;
        }
    } ;
    /**
     * построить строку сообщений
     * @param message
     * @returns {*}
     */
    var messageLineBuild = function(message) {
        var messageId = message['messageId'] ;
        if (messageId == undefined) {
            return '*********' ;
        }
        var subst = message['subst'] ;      // подстановки в текст
        if (subst == undefined) {
            subst = {} ;
        }
        subst = substPrepare(subst) ;
        var messOut = messageTab[messageId][lang] ;

        // Вычисляем подстановки  -------------- //
        while (messOut.indexOf('{') >= 0 )
        {
            var posBeg = messOut.indexOf('{');
            var posEnd = messOut.indexOf('}');
            if (posBeg >=0 && posEnd >= 0) {
                var param = messOut.substr(posBeg,posEnd - posBeg +1) ;
                param = param.substr(1,param.length - 2) ; // отбросить  { }

                var leftPart = messOut.substr(0,posBeg) ;
                var rightPart = messOut.substr(posEnd +1) ;

                if (subst[param]!== undefined ) {    // есть подстановка
                    var val = subst[param] ;
                    messOut = leftPart + val + rightPart ;
                }else {
                    messOut = leftPart + '**************' + rightPart ;
                }
            }
        }
        return messOut ;
    } ;
    /**
     * подготовить вектор подстановок - привести к виду
     * substOut = {par1 : text1, par2: text2,...}
     * Возможный вид : ...{par1: [{ru:textru,en:texten},..],par2:text2,...}
     * @param subst
     */
    var substPrepare = function(subst) {
        var simpleTypes = ['string','number','boolean'] ;
        var substOut = {} ;
        for (var parName in subst) {
            var parText = subst[parName] ;
            if (simpleTypes.indexOf(typeof(parText)) >= 0 ) {
                substOut[parName] = parText + '' ;
            } else {
                substOut[parName] = parTextPrepare(parText) ;
            }
        }
        return substOut ;
    } ;
    /**
     * превратить parText  в строку
     * @param parText = [el1,el2,..], где el = {ru:textRu , en: textEn }
     * например, el_i - это может быть имена полей (см checkFieldRelation)
     */
    var parTextPrepare = function(parText) {
        var textOut = '' ;
        for (var i = 0; i < parText.length; i++) {
            var elText = parText[i][lang] ;
            elText = (elText == undefined ) ? '*******' : elText ;
            textOut += ((textOut.length == 0) ? '' : ', ') +elText ;
        }
        return textOut ;
    };
    /**
     * Вывод сообщений
     */
    this.messagesShow = function(messageLines,error) {
        //------------------------------
        var br = '<br>' ;
        $messageDiv.empty() ;          // чистить область сообщений
        // в первой строке имя поля ------------ //
        if (typeof(currentFieldId) == 'string' && currentFieldId.length > 0 ) {
            var fldName = getFieldName(currentFieldId) ;
            var message = {
                'messageId' : 'fieldName' ,
                'subst'     : {'fieldName' : [fldName]}
              } ;
            var fldNameLine = messageLineBuild(message) ;

            $messageDiv.append(fldNameLine + br);
        }
        for (var i = 0; i < messageLines.length; i++) {
            var lineOut = messageLines[i] ;
            $messageDiv.append(lineOut+br);
        }
        // класс области сообщений в зависимости от наличия ошибок
        var cssClass = (error) ? MESSAGE_ERROR_CSS : MESSAGE_INFO_CSS ;
        $messageDiv.removeClass() ;
        $messageDiv.addClass(cssClass) ;


    } ;
    /**
     * вывод label-имён полей
     */
    this.fieldsLabelShow = function() {
        for (var fldId in fieldTab) {
            var labelId = fieldTab[fldId]['labelId'] ;         // id в html документе
            var fldName = fieldTab[fldId]['labelText'][lang] ;// $('#'+id).text() в html документе
            $('#'+labelId).text(fldName) ;
        }
    } ;
    /**
     * имя формы
     * @returns {*}
     */
    this.getFormTitle = function() {
        return titleTab[lang] ;
    } ;
    this.descriptionShow = function() {
        var descriptText = messageTab['description'][lang] ;
        $descriptionDiv.empty();
        $descriptionDiv.append(descriptText);
    }


  }