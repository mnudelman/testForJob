/**
 * Управление языком отображения
 * констатнты и тек значение в paramSet
 */
function LangControl() {
    var currentLang = '' ;
    var newLang = '' ;
    var _this = this ;
    var btClass = 'langButton' ;    // класс кнопок управления языком
    //--------------------------------//

    this.init = function() {
        currentLang = paramSet.LANG_RU ;      // исходный язык русский
        showButton() ;
        paramSet.currentLang = currentLang ;
        $('.'+btClass).click(function() {
            currentLang = (currentLang == paramSet.LANG_RU) ? paramSet.LANG_EN : paramSet.LANG_RU ;
            paramSet.currentLang = currentLang ;
            showButton() ;
            var currentForm = paramSet.currentForm ;
            if (typeof(currentForm) == 'object' ) {
                currentForm.formShow() ;
            }
        }) ;
    } ;
    /**
     * переопределить надписи на кнопках управления языком
     */
    var showButton = function() {
        var elemBt = $('.'+btClass)[0] ;
        var img = $('.'+btClass +' img')[0] ;
        var imgSrc = (currentLang == paramSet.LANG_RU) ? paramSet.LANG_IMG_RU : paramSet.LANG_IMG_EN ;
        $(img).attr('src',imgSrc) ;
        $('.'+btClass).empty() ;
        $('.'+btClass).append(img) ;
        $('.'+btClass).append(currentLang) ;
    }
}