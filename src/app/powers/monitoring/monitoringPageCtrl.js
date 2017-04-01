/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $location) {

        $scope.show = {
            testImgArr: [{
                id: 2001,
                imgLink: 'assets/img/app/power/iu01.jpg',
                style: {
                    position: 'absolute',
                    top: '50px',
                    left: '50px',
                    width: '180px',
                    height: '180px'
                }
            }, {
                id: 2002,
                imgLink: 'assets/img/app/power/iu02.jpg',
                style: {
                    position: 'absolute',
                    top: '150px',
                    left: '400px',
                    width: '180px',
                    height: '180px'
                }
            }, {
                id: 2003,
                imgLink: 'assets/img/app/power/iu03.jpg',
                style: {
                    position: 'absolute',
                    top: '200px',
                    left: '800px',
                    width: '150px',
                    height: '200px'
                }
            }]

        };

        $scope.getParams = function () {
            console.log("传过来客户id是：" + $location.search().id);
            console.log("当前state是：" + $state.$current);
        };
        $scope.getParams();


        /**
         * 显示控件详情
         * @param obj
         */
        $scope.showDetail = function (obj) {
            console.log(obj.id);
        };

    }

})();
