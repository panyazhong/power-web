(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, Sidebar, SidebarCache, Log, HttpToast, $timeout,
                              locals, ToastUtils, $state) {

        // $timeout(function () {
        //     $scope.show.mapData = [
        //         {
        //             "cid": "221",
        //             "name": "时代金33",
        //             "ico": "http://imgsrc.baidu.com/forum/w%3D580%3B/sign=0bdab4698f35e5dd902ca5d746fda7ef/18d8bc3eb13533fac693c715a2d3fd1f41345be7.jpg",
        //             "longitude": "121.48",
        //             "latitude": "31.22"
        //         },
        //         {
        //             "cid": "2",
        //             "name": "交通大学222",
        //             "ico": "public/img/client/red.png",
        //             "longitude": "121.16",
        //             "latitude": "30.89"
        //         }
        //     ];
        //
        //     $scope.setMap();
        // }, 10000);

        $scope.show = {
            mapData: []
        };

        $scope.setMap = function () {

            var mapLabData = $scope.show.mapData;

            var mapObj;

            function mapInit() {
                mapObj = new AMap.Map('container', {
//                    dragEnable: false,      //是否可拖拽
//                    zoomEnable: false,      //是否可缩放
                    zoom: 12,
                    center: [121.493496, 31.224609],    // 定义地图中心点
                });
                AMap.event.addListener(mapObj, "complete", completeEventHandler);
            }

            mapInit();

            function completeEventHandler() {

                mapLabData.map(function (item) {
                    var content =
                        "<div style='text-align: center;'>" +
                        "<div>" +
                        "<img src='" + item.ico + "' style='width: 50px;height: 50px;'/>" +
                        "<div class='map-icon-title'>" + item.name + "</div>" +
                        "</div>" +
                        "</div>";

                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(item.longitude, item.latitude),
                        content: content,
                        extData: item.cid
                    });

                    // map events
                    var _onmouseover = function (e) {
                        openWindow(e);
                    };
                    AMap.event.addListener(marker, 'mouseover', _onmouseover);

                    marker.setMap(mapObj);  // add point
                });

            }

            function openWindow(e) {

                var cid = e.target.getExtData();
                var pos = e.target.getPosition();

                $scope.getDetail(cid, pos, showPop);
            }

            function showPop(item, pos) {

                var percentage = parseInt(item.currentmd) / parseInt(item.requiredmd) * 100 + "%";

                var custXml = "<div class='map-content'>" +
                    "<div class='map-btn-title'>" + item.name + "</div>" +
                    "<div class='map-item'>电压等级：" + item.level +
                    "</div>" +
                    "<div class='map-item'>站内规定人数：" + item.numofppl +
                    "</div>" +
                    "<div class='map-item'>具体地址：" + item.address +
                    "</div>" +
                    "<div class='map-item'>站长：" + item.contactor +
                    "</div>" +
                    "<div class='map-item'>站长手机：" + item.contactortel +
                    "</div>" +
                    "<div class='map-item'>站内电话：" + item.phonenumber +
                    "</div>" +
                    "<div class='map-item'>用户联系人：" + item.customer_contactor +
                    "</div>" +
                    "<div class='map-item'>用户联系电话：" + item.customer_contactortel +
                    "</div>" +
                    "<div class='map-item'>建筑面积：" + item.structurearea +
                    "</div>" +
                    "<div class='map-item'>安全运行天数：" + item.safeRunningDays +
                    "</div>" +
                    "<div class='map-item'>当前负荷：" + item.currentmd +
                    "</div>" +
                    "<div class='map-item'>当月申报需量：" + item.requiredmd +
                    "</div>" +
                    "<div style='height: 5px;background: #dcdcdc;margin: 5px 0;'>" +
                    "<div style='display: inline-block;background: #1baeb3;height: 5px;float: left;width:" + percentage + ";'></div>" +
                    "</div>" +
                    "<div style='line-height: 25px;padding: 0 10px;text-align: center;color: #1baeb3'>" + "需量占比：" + percentage +
                    "</div>" +
                    "<a onclick='viewClientDetail(" + item.cid + ")' class='map-btn-event'>" +
                    "前往该站" +
                    "</a>" +
                    "<a onclick='viewClientEvent(" + item.cid + ")' class='map-btn-event'>" +
                    "查看该站事件" +
                    "</a>" +
                    "</div>";

                var infoWindow = new AMap.InfoWindow({
                    isCustom: true,
                    closeWhenClickMap: true,
                    offset: new AMap.Pixel(200, -50),
                    content: custXml
                });
                infoWindow.open(mapObj, pos);
            }
        };

        // 2s refresh
        $scope.init = function () {
            Sidebar.query({},
                function (data) {
                    SidebarCache.create(data);
                    locals.putObject('sidebar', data.sidebar);
                    $scope.show.mapData = SidebarCache.getData().clients;
                    $scope.setMap();
                }, function (err) {
                    HttpToast.toast(err);
                });

            console.log('op................');
        };
        $scope.init();

        $scope.getDetail = function (id, pos, cb) {
            Overview.queryDetail({
                    cid: id
                },
                function (data) {
                    cb(data, pos);
                }, function (err) {
                    HttpToast.toast(err);
                });
        };


        // btn click event
        $scope.viewClientDetail = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '变电站信息异常。稍后再试.');
                return
            }
            $state.go('monitoring', {cid: id});
        };

        $scope.viewClientEvent = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '变电站信息异常。稍后再试.');
                return
            }
            $state.go('events', {cid: id});

            locals.put('cid', id);      // 也记录下变电站id
        }

    }

})();
