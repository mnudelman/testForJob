//
var paramSet ;

$(document).ready(function(){
    //$('#tabs').hide();
    //paramSet = new GameParamSet();
    //paramSet.init() ;
    //game = new GameSnake(0) ;
    //game.create() ;
    paramSet = new ParamSet();
    paramSet.init() ;
    main = new MainScript() ;
    main.init() ;

} ) ;

