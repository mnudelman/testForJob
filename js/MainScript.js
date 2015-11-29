/**
 * Created by mnudelman@yandex.ru on 22.11.15.
 */
function MainScript() {
    var topMenu = paramSet.topMenu ; //   new TopMenu() ;
    var authorization =  paramSet.authorization ; //new Authorization() ;
    var langControl = paramSet.langControl ;
    var _this = this;
    //---------------------------------------------//
    this.init = function () {
//     Начальная заставка и меню
        langControl.init() ;       // нач установка языка
        topMenu.menuInit() ;
        authorization.init() ;
        authorization.go() ;
    };

}