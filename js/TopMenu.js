/**
 * Меню
 */
function TopMenu() {
    var $topMenu = $('#topMenu') ;
    var $langItem = $('#langItem') ;
    var $userItem = $('#userItem') ;
    var formModule = new TopMenuModule() ;
    var enterLabel ;
    var profileLabel ;
    var changePasswordLabel ;
    var emptyLabel = {'ru': ' ','en': ' '} ;
    var _this = this ;
    //--------------------------------------------//
    this.menuInit = function() {
        $(".testnav").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");
        $(".testnav li").addClass("ui-menu-item");
        $(".sub-menu").hide();

        var fieldTab = formModule.fieldTab ;

        enterLabel = fieldTab['mnuEnter']['labelText'];
        profileLabel = fieldTab['profile']['labelText'];
        changePasswordLabel = fieldTab['changePassword']['labelText'];




        _this.menuShow() ;

        $(".clk").click(function(){

            var menu = "#nav";
            var position = {my: "left top", at: "left bottom+8"};
            $(menu).menu({
                position: position,
                blur: function() {
                    $(this).menu("option", "position", position);
                },
                focus: function(e, ui) {
                    if ($(menu).get(0) !== $(ui).get(0).item.parent().get(0)) {
                        $(this).menu("option", "position", {my: "left top", at: "left top"});
                    }
                },
                select: function(e,ui) {
                  //var item = $(ui.item) ;
                   var userStat = paramSet.user['status'] ;
                   userStat = (userStat == undefined) ? 0 : userStat ;


                  var id = $(ui.item).attr('id') ;
                  switch(id) {
                      case 'enterItem' :
                              var enterForm = paramSet.enterForm ;
                              enterForm.edit() ;
                          break ;
                      case 'userProfileItem' :
                              var proFileForm = paramSet.profileForm;
                              proFileForm.edit();
                          break ;
                      case 'changePasswordItem' :
                              var form = paramSet.registrationForm;
                              form.edit('changePassword');
                          break ;
                  }
                }
            });



        });

    } ;
    this.menuShow = function() {
       _this.setUserSubmenu() ;
       var checkService = paramSet.checkService ;
       var currentFormModule = checkService.getFormModule() ;    // запомнить текущий
       checkService.setFormModule(formModule) ;                  // установить свой
       checkService.fieldsLabelShow() ;                          // имена menuItems
      checkService.setFormModule(currentFormModule) ;          // восстановить currentFormModule
    } ;
    /**
     * вывести в меню фото и имя пользователя
     */
    this.showUser = function() {
         var userStat = paramSet.user['status'] ;
         var name = '' ;
        var photoFile = '' ;
        if (userStat >= paramSet.USER_STAT_USER) {
            if (paramSet.userProfile['filePhoto'] !== undefined) {
                photoFile = paramSet.userProfile['filePhoto'];
            }
            if (paramSet.userProfile['surname'] !== undefined) {
                name = paramSet.userProfile['surname'] + ' ' + paramSet.userProfile['name'];

            }
            name = (name.length == 0) ? paramSet.user['login'] : name;
            if ((photoFile.length > 0)) {
                photoFile = paramSet.dirHtmlFotos+'/'+photoFile ;
            }else {
                photoFile = paramSet.PHOTO_PEOPLE ;
            }
         }else {
            photoFile = paramSet.PHOTO_PEOPLE ;
            name = 'Guest' ;
        }

        $('#menuUserPhoto').attr('src',photoFile) ;
        var userPhoto = $('#menuUserPhoto')[0] ;
        $('#userItem_a').empty() ;
        $('#userItem_a').append(userPhoto) ;
        $('#userItem_a').append(name) ;
    } ;
    this.setUserSubmenu = function() {
        var fieldTab = formModule.fieldTab ;
        var userStat = paramSet.user['status'] ;
        if (userStat < paramSet.USER_STAT_USER) {
            fieldTab['mnuEnter']['labelText'] = enterLabel ;
            fieldTab['profile']['labelText'] = emptyLabel ;
            fieldTab['changePassword']['labelText'] = emptyLabel ;

        }else {
            fieldTab['mnuEnter']['labelText'] = emptyLabel ;
            fieldTab['profile']['labelText'] = profileLabel ;
            fieldTab['changePassword']['labelText'] = changePasswordLabel ;
        }
    }
}

