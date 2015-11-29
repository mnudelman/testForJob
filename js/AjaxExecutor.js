/**
 * в обоих запросах к БД результат возвращается в виде JSON-обекта  data
 * если data['successful'] == false, то вывод в блок $('#dbError')
 */
function AjaxExecutor(ajaxUrl) {
   var requestData = false ;                 // результат запроса
   var ajaxComplete = false ;


    var successDefault = function(data,textStatus) {
        alert('gameSave:status-'+textStatus+' ; hostAnswer:'+data) ;
   } ;
    var errorDefault = function(event, XMLHttpRequest, ajaxOptions, thrownError) {
        var responseText = event.responseText ; // html - page

        $('#dbError').append(responseText) ;    // здесь будут необработанные php-ошибки

        var answ  = alert('ERROR: code :'+event.status +' (' + event.statusText+')') ;
    } ;
    var completeDefault = function() {
        ajaxComplete = true ;
    } ;
    this.sendResult = function(sendObj) {
        $.post(
            ajaxUrl + '/index.php',
            sendObj,
            function(data,textStatus) {
                if ( false == data['successful'] ) {
                    parseError(data,0) ;
                } else {
                    requestData = data;
                }
            },
            "json"
        ).error(errorDefault);
    } ;
    this.getData = function(sendData,ownMessage) {
       ajaxComplete = false ;
        ownMessage = (ownMessage == undefined) ? false : ownMessage ;
       $.getJSON(ajaxUrl+'/index.php',
           sendData,
            function(data) {
                if ( false == data['successful'] && !ownMessage) {
                    parseError(data,0) ;
                } else {
                    requestData = data;
                }
            }
        ).error(errorDefault)
         .complete(completeDefault);

    } ;
    this.getRequestResult = function() {
        if (ajaxComplete) {
            return requestData;
        }else {
            return false ;
        }
    } ;
    /**
     * разбор и вывод JSON-объекта при не удачном запросе
     */
    var parseError = function(errorObj,level) {
        if (level == 0) {
            $('#dbError').append('<strong>-------R E Q U E S T&nbsp;&nbsp;E R R O R:-------</strong><br>');
        }
        var simpleType = ['number','boolean','string','undefined'] ;
        var tab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' ;
        var indent ='' ;
        var br = '<br>' ;

        for (var  i = 0; i < level ; i++) {
            indent += tab ;
        }
        var currentType = (typeof errorObj) ;
        if (simpleType.indexOf(currentType) >= 0) {
            $('#dbError').append(indent+errorObj+br) ;
            return true ;
        }
        for (var key in errorObj) {
            $('#dbError').append(indent+'<strong>'+key+':</strong>'+br) ;
            var value = errorObj[key] ;
            parseError(value,level+1) ;
        }
        if (level == 0) {
            $('#dbError').append('<strong>---------------------------------------</strong><br>') ;

        }
     return true ;

    }
}
