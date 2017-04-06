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
            sysImgData: [{
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
            }],
            branchData: {
                id: 'id3001',
                branchName: '3：10千伏一段压变',
                aL: '100A',
                bL: '105A',
                cL: '103A',
                p: '0.00KW',
                pElement: '1.00',
                aU: '10.01KV',
                bU: '10.03KV',
                cU: '10.09KV',
                q: '0.01KVar',
                wp: '0.05kwh',
                temp: '8℃'
            },
        };

        $scope.getParams = function () {
            console.log("传过来客户id是：" + $location.search().id);
            console.log("当前state是：" + $state.$current);
        };
        $scope.getParams();


        /**
         * 显示控件详情
         */
        $scope.showDetail = function (obj) {
            console.log(obj.id);
        };

        /**
         * 查看设备明细
         */
        $scope.lookDetail = function () {
            /**
             * 需要将设备id传递过去，或全局变量记录当前设备信息
             */
            $state.go('branch');
        }

    }

})();
