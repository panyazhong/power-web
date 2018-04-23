(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components.pageTop')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, $state, PageTopCache, HttpToast, SkipUtils, locals,$rootScope, userCache) {

        $scope.show = {
            rightBarData:[ {
                title: '用户',
                state: 'userinfo'
            }],
            // 用户设置
            setDataU: [
                {
                    title: '账号设置',
                    state: 'setaccount',
                }
            ],
            userName: userCache.getName(),
            userType: userCache.getUserType()
        };
        $scope.init = function(){
            var user = JSON.parse(locals.get('eUser',''));
            $scope.show.headImg=user.headImg;
            //for (var Key in user){
                //console.log(Key)
                if (user['headImg']) {
                    //console.log(111)
                    return $scope.flag = true
                    //params[Key] = $scope.form[Key];
                }else{
                    return $scope.flag = false
                }
            //}
            //$scope.headImg = user.headImg;
            //if($scope.headImg){
            //    $scope.show.headImg = $scope.headImg;
            //}else{
            //    $scope.show.headImg ='assets/img/app/power/user.png'
            //}
        }
        $scope.init()
        $scope.changeState = function (item) {
            //console.log(item)
            if (item.state == 'userinfo') {
                $scope.isSetting = true;
                item.isopen = !item.isopen;
                event.stopPropagation();
                return;
            }
            $scope.isSetting = false;
        };

        $scope.changeSetState = function (obj,item) {
            $state.go(obj.state);
        };
        //退出
        $scope.logout = function () {
            var link = '/auth.html';

            // 跳转
            window.location.replace(link);
            locals.clear();
        };
    }

})();
