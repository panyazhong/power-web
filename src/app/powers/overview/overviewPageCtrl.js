(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, Sidebar, SidebarCache, Log, HttpToast, $timeout,
                              locals, ToastUtils, $state, EventsCache) {

        EventsCache.login();    // 登陆订阅

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
                    zoom: 9,
                    center: [121.582888, 31.466200],    // 定义地图中心点
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

                var percentage = "";
                if (item.currentmd && item.requiredmd) {
                    percentage = (parseInt(item.currentmd) / parseInt(item.requiredmd) * 100).toFixed(2) + "%";
                }

                var name = item.name ? item.name : '';
                var level = item.level ? item.level : '';
                var numofppl = item.numofppl ? item.numofppl : '';
                var address = item.address ? item.address : '';
                var contactor = item.contactor ? item.contactor : '';

                var contactortel = item.contactortel ? item.contactortel : '';
                var phonenumber = item.phonenumber ? item.phonenumber : '';
                var customer_contactor = item.customer_contactor ? item.customer_contactor : '';
                var customer_contactortel = item.customer_contactortel ? item.customer_contactortel : '';
                var structurearea = item.structurearea ? item.structurearea : '';

                var safeRunningDays = item.safeRunningDays ? item.safeRunningDays : '';
                var currentmd = item.currentmd ? item.currentmd : '';
                var requiredmd = item.requiredmd ? item.requiredmd : '';

                var custXml = "<div class='map-content'>" +
                    "<div class='map-btn-title'>" + name + "</div>" +
                    "<div class='map-item'>电压等级：" + level +
                    "</div>" +
                    "<div class='map-item'>站内规定人数：" + numofppl +
                    "</div>" +
                    "<div class='map-item'>具体地址：" + address +
                    "</div>" +
                    "<div class='map-item'>站长：" + contactor +
                    "</div>" +
                    "<div class='map-item'>站长手机：" + contactortel +
                    "</div>" +
                    "<div class='map-item'>站内电话：" + phonenumber +
                    "</div>" +
                    "<div class='map-item'>用户联系人：" + customer_contactor +
                    "</div>" +
                    "<div class='map-item'>用户联系电话：" + customer_contactortel +
                    "</div>" +
                    "<div class='map-item'>建筑面积：" + structurearea +
                    "</div>" +
                    "<div class='map-item'>安全运行天数：" + safeRunningDays +
                    "</div>" +
                    "<div class='map-item'>当前负荷：" + currentmd +
                    "</div>" +
                    "<div class='map-item'>当月申报需量：" + requiredmd +
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
                    offset: new AMap.Pixel(150, 0),
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
