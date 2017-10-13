(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Log, HttpToast, $interval, $timeout, excepNumHelper, previewCache, arrUtil,
                              locals, ToastUtils, $state, $rootScope, clientCache, PageTopCache, Client, mapImgCache, userCache,
                              LineCount, lineTitlePieHelper, _, lineChartHelper, lineMaxDataHelper, lineMaxEleHelper) {

        PageTopCache.cache.state = $state.$current; // active

        $scope.show = {
            mapData: [],
            cid: '',
            requiredmd: '',
            baseList: [],   // 基本概况数据
            safetyData: {},  // 安全用电数据
            doneData: {},   // 已处理数据
            undoData: {},    // 未处理数据
            excepStatus: [   //异常状态文字
                {
                    bg: '#e85656',
                    text: '危急'
                },
                {
                    bg: '#f0a53d',
                    text: '严重'
                },
                {
                    bg: '#3b89ce',
                    text: '一般'
                },
                {
                    bg: '#999999',
                    text: '无'
                }
            ],
            loadTitle: [],  // 负荷1~3 line data
            loadPieData: [], // 负荷半环形data
            loadLineData: {},    // 负荷折线图data
            loadMaxData: {},     // 负荷各项最大值

            demandTitle: [],     // demand
            demandPieData: [],
            demandLineData: {},
            demandMaxData: {},

            powerData: {},  // power 柱状图
            powerStackData: {},  // 堆积图
            powerMaxData: {},    // max

            safeRunningDays: '', // 安全运行天数，非地图
        };

        /**
         *  map start
         */

        $scope.setMap = function () {
            var limit = userCache.getUserType();

            var mapLabData = $scope.show.mapData;

            var mapObj;

            function mapInit() {

                var pos = limit === 0 ? [mapLabData[0].longitude, mapLabData[0].latitude] : [121.473658, 31.230378];
                var zoomVal = limit === 0 ? 12 : 9;

                mapObj = new AMap.Map('container', {
//                    dragEnable: false,      //是否可拖拽
//                    zoomEnable: false,      //是否可缩放
                    zoom: zoomVal,
                    center: pos   // 定义地图中心点
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
                        extData: item.id
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

                var currentmd = '';
                var percentageW = '';   //进度条
                var percentage = '';    //占比
                if (item.requiredmd) {
                    var pData = clientCache.cache.p[$scope.show.cid];
                    if (pData) {
                        Log.i('p Cache不为空：' + JSON.stringify(pData));
                        currentmd = pData.P + pData.PUnit;
                        var per = (parseInt(currentmd) / parseInt(item.requiredmd) * 100).toFixed(2);
                        percentage = per + "%";
                        if (per <= 100) {
                            percentageW = per + "%";
                        } else {
                            percentageW = 100 + "%";
                        }
                    }
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
                // var currentmd = item.currentmd ? item.currentmd : '';
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
                    "<div class='map-item' id='currentmd'>当前负荷：" + currentmd +
                    "</div>" +
                    "<div class='map-item'>当月申报需量：" + requiredmd +
                    "</div>" +
                    "<div style='height: 5px;background: #dcdcdc;margin: 5px 0;'>" +
                    "<div style='display: inline-block;background: #1baeb3;height: 5px;float: left;width:" + percentageW + ";' id='percentageW'></div>" +
                    "</div>" +
                    "<div style='line-height: 25px;padding: 0 10px;text-align: center;color: #1baeb3' id='percentage'>" + "需量占比：" + percentage +
                    "</div>" +
                    "<a onclick='viewClientDetail(" + item.id + ")' class='map-btn-event'>" +
                    "前往该站" +
                    "</a>" +
                    "<a onclick='viewClientEvent(" + item.id + ")' class='map-btn-event'>" +
                    "查看该站事件" +
                    "</a>" +
                    "</div>";

                var infoWindow = new AMap.InfoWindow({
                    isCustom: true,
                    closeWhenClickMap: true,
                    offset: new AMap.Pixel(200, 215),
                    content: custXml
                });
                infoWindow.open(mapObj, pos);
            }
        };

        // 获取变电站详细信息
        $scope.getDetail = function (id, pos, cb) {
            // change init
            $scope.show.cid = id;
            $scope.show.requiredmd = '';

            var p = {id: id};
            Client.queryDetail(p,
                function (data) {
                    $scope.show.requiredmd = parseInt(data.requiredmd);

                    cb(data, pos);
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

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
        };

        /**
         *  map end
         */

        // b. 获取基本概况
        $scope.queryBase = function () {
            var p = {
                id: locals.get('cid', ''),
                attr: 'attr'
            };
            Client.query(p,
                function (data) {
                    if (Array.isArray(data)) {
                        $scope.show.baseList = data;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });

        };

        // c. 获取异常、缺陷数量
        $scope.querySafety = function () {
            var p = {
                id: locals.get('cid', ''),
                eventAndException: 'eventAndException'
            };
            Client.safety(p,
                function (data) {
                    $scope.show.safetyData = data;
                    //已完成
                    $scope.show.doneData = excepNumHelper.createDone(data);
                    $scope.show.undoData = excepNumHelper.createUndo(data);
                },
                function (err) {
                    HttpToast.toast(err);
                });

        };

        // d. 根据clientId获取线（获取负荷，需量的最大值和id）
        $scope.getLinesByClientId = function () {
            var p = {
                getLinesByClientId: 'getLinesByClientId',
                client_id: 'client_id',
                clientId: locals.get('cid', '')
            };
            LineCount.query(p,
                function (data) {
                    var d = lineTitlePieHelper.create(data);
                    Log.i('map d，转换后的数据：' + JSON.stringify(d));
                    // title
                    $scope.show.loadTitle = d.titleData;
                    $scope.show.demandTitle = _.cloneDeep(d.titleData);
                    // 半环形
                    $scope.show.loadPieData = d.loadPieData;
                    $scope.show.demandPieData = d.demandPieData;
                    // 默认展示第一条line的数据
                    $scope.changeLineLoad($scope.show.loadTitle[0]);
                    $scope.changeLineDemand($scope.show.demandTitle[0]);
                },
                function (err) {
                    HttpToast.toast(err);
                });

        };

        // e. 根据lineId获取线的折线图数据
        $scope.lineChart = function (type, obj) {
            var p = {
                lineChart: 'lineChart',
                line_id: 'line_id',
                lineId: obj.id,
                type: 'type',
                dataType: type
            };
            LineCount.queryLine(p,
                function (data) {
                    switch (type) {
                        case 'Load':
                            $scope.show.loadLineData = lineChartHelper.create(data, type, obj.name);
                            Log.i('map e，负荷转换后：\n' + JSON.stringify($scope.show.loadLineData));
                            break;
                        case 'Demand':
                            $scope.show.demandLineData = lineChartHelper.create(data, type, obj.name);
                            Log.i('map e，需量转换后：\n' + JSON.stringify($scope.show.demandLineData));
                            break;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        // f. 根据lineId获取负荷、需量统计
        $scope.getCountByLineId = function (type, obj) {
            var p = {
                getCountByLineId: 'getCountByLineId',
                line_id: 'line_id',
                lineId: obj.id,
                type: 'type',
                dataType: type
            };
            LineCount.query(p,
                function (data) {
                    switch (type) {
                        case 'Load':
                            $scope.show.loadMaxData = lineMaxDataHelper.create(data, type);
                            Log.i('map f，负荷转换后：\n' + JSON.stringify($scope.show.loadMaxData));
                            break;
                        case 'Demand':
                            $scope.show.demandMaxData = lineMaxDataHelper.create(data, type);
                            Log.i('map f，需量转换后：\n' + JSON.stringify($scope.show.demandMaxData));
                            break;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        // g. 根据lineId获取电量统计
        $scope.getElectricByLineId = function (obj) {
            var p = {
                getElectricByLineId: 'getElectricByLineId',
                line_id: 'line_id',
                lineId: obj.id
            };
            LineCount.query(p,
                function (data) {
                    $scope.show.powerMaxData = lineMaxEleHelper.create(data);
                    Log.i('map g，电量转换后：\n' + JSON.stringify($scope.show.powerMaxData));
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        /**
         * click event ↓↓↓↓↓
         */

        /**
         * 改变line时样式
         * @param arr
         * @param id
         */
        $scope.editValById = function (arr, id) {
            if (!arr || !arr.length) return;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == id) {
                    arr[i].active = true;
                }
                else {
                    arr[i].active = false;
                }
            }
        };

        /**
         * 改变line时——负荷
         * @param item
         */
        $scope.changeLineLoad = function (item) {
            $scope.editValById($scope.show.loadTitle, item.id);
            $scope.lineChart('Load', item);
            $scope.getCountByLineId('Load', item);

            //==================================== 测试用 电量实际是客户的 ==========================================>
            $scope.getElectricByLineId(item);
        };

        /**
         * 改变line时——需量
         * @param item
         */
        $scope.changeLineDemand = function (item) {
            $scope.editValById($scope.show.demandTitle, item.id);
            $scope.lineChart('Demand', item);
            $scope.getCountByLineId('Demand', item);
        };

        /**
         * 查看月电量柱图
         */
        $scope.viewPower = function () {
            Log.e('map click：查看月电量柱图...');
        };

        /**
         * 月电量堆积图
         */
        $scope.viewPowerStack = function () {
            Log.e('map click：月电量堆积图...');
        };

        $scope.clientChangeQuery = function () {
            $scope.queryBase();
            $scope.querySafety();
            $scope.getLinesByClientId();
        };

        /**
         * a. init获取变电站预览信息
         * 变电站信息改变后需
         * b. 获取基本概况
         * c. 获取异常、缺陷数量
         * ----------测试服务器
         * d. 根据id获取线（获取负荷，需量的最大值和id）
         */
        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '');
            if (cid) {
                $scope.clientChangeQuery();

                $scope.show.safeRunningDays = arrUtil.getSafeDaysById($scope.show.mapData, cid);
            }
            else {  // 和其它界面diff，不存在也需选中一个客户
                locals.put('cid', $scope.show.mapData[0].id);
                $timeout(function () {
                    $scope.clientChangeQuery();
                }, 200);

                $scope.show.safeRunningDays = $scope.show.mapData[0].safeRunningDays;
            }

        };

        // a. init获取变电站预览信息
        $scope.init = function () {

            var pm = previewCache.getPreview();
            pm.then(function (data) {
                $scope.show.mapData = data;
                $scope.setMap();
                Log.i('变电站预览信息：' + JSON.stringify($scope.show.mapData));

                $scope.initFilterInfo();
            });

        };
        $scope.init();

        /**
         * 当前需量
         */
        $rootScope.$on('overallRefresh', function (event, data) {
            if (!data) {
                return
            }

            if (!$scope.show.cid || !$scope.show.requiredmd) {
                return
            }

            var pData = data[$scope.show.cid];
            if (pData) {
                var currentmd = pData.P + pData.PUnit;
                if (currentmd) {
                    var per = (parseInt(currentmd) / parseInt($scope.show.requiredmd) * 100).toFixed(2);
                    var percentageW = '';   //进度条
                    var percentage = per + "%"; // 占比
                    if (per <= 100) {
                        percentageW = per + "%";
                    } else {
                        percentageW = 100 + "%";
                        // 异常时颜色设置红色
                        $("#percentageW").addClass("bg-red");
                        $("#percentage").addClass("color-red");
                    }

                    $("#currentmd").text("当前负荷：" + currentmd);
                    $("#percentage").text("需量占比：" + percentage);
                    $("#percentageW").css({width: percentageW});
                }
            }

        });
    }

})
();
