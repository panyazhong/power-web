(function () {
    'use strict';

    angular.module('DataCache', [])
        .factory("EventsCache", eventsCache)    // 需要配置事件前缀！！！正式需替换，需要更换 index 页的引入
        .factory("PageTopCache", pageTopCache)
        .factory("ImgPrefix", imgPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("ExportPrefix", exportPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("KeywordCache", keywordCache)  // key
        .factory("SidebarCache", sidebarCache)  // 侧边栏和地图数据
        .factory("locals", locals)
        .factory("pieChartCache", pieChartCache)
        .service("treeCache", treeCache)    // 树cache
        .service("clientCache", clientCache)    // 变电站事件
        .service("coreConfig", coreConfig)
        .service("mapImgCache", mapImgCache)
        .service("userCache", userCache);

    function eventsCache(Log, $state, $rootScope, clientCache, $uibModal, coreConfig) {
        /**/
        var socket = io.connect(coreConfig.host + ':6688', {resource: 'event/socket.io'});
        socket.on('alert', function (data) {    // 监听事件
            Log.i('alert : \n' + data);

            var obj = JSON.parse(data);
            socket.emit('received', {mhid: obj.mhid}); // 收到alert事件后响应
            switch (parseInt(obj.level)) {
                case 1:
                    if (!window.DEBUG) {
                        openModal('app/powers/modal/warningEvent.html');
                    }
                    break;
                case 2:
                    if (!window.DEBUG) {
                        openModal('app/powers/modal/dangerEvent.html');
                    }
                    break;
            }

            function openModal(path) {
                $uibModal.open({
                    animation: true,
                    templateUrl: path,
                    size: '',
                    controller: eventCtrl,
                    // appendTo: angular.element('#' + eleId),
                    resolve: {
                        params: {
                            data: obj
                        }
                    },
                    windowTopClass: "power-modal-layout"
                }).result.then(function (result) {
                    // 传值走这里
                    if (info) {
                        $state.go('events');
                    }
                }, function (result) {
                    Log.i('modal 关闭了');
                });
            }

            function eventCtrl($scope, params, $timeout) {
                $scope.title = params.data.desc;

                $scope.submit = function () {
                    var data = 'submit';
                    $scope.$close(data);
                };

                $timeout(function () {
                    $scope.$dismiss();
                }, 5000);
            }

        });

        socket.on('monitor', function (data) {
            Log.i('monitor : \n' + data);

            var obj = JSON.parse(JSON.parse(data).content);
            clientCache.cache.data = obj;

            $rootScope.$emit('refreshMonitor', obj);    // 一次系统图
        });

        socket.on('status', function (data) {
            Log.i('status : \n' + data);

            var obj = JSON.parse(data);
            var item = {
                count: JSON.parse(obj.content).total,  // 未处理的event数量
                states: (JSON.parse(obj.content)).detail // 侧边栏
            };
            $rootScope.$emit('refresh', item);
        });

        socket.on('overall', function (data) {
            Log.i('overall : \n' + data);

            var obj = JSON.parse(data);
            var item = JSON.parse(obj.content);
            clientCache.cache.p = item;

            $rootScope.$emit('overallRefresh', item);
        });

        socket.on('inspect', function (data) {  // 巡检模块刷新
            Log.i('inspect : \n' + data);

            var obj = JSON.parse(data);
            var item = JSON.parse(obj.content);

            $rootScope.$emit('inspectRefresh', item);
        });

        /*
        //========> 测试
        var socket ='';*/
        return {
            subscribeClient: function (cid) {
                socket.emit('subscribe', {client_id: cid}); // 订阅——变电站信息
            },
            login: function () {
                // socket.emit('login', {});
            }
        }
    }

    function pageTopCache() {
        return {
            cache: {
                state: 'overview'
            },
            currentState: {
                state: ''
            }
        }
    }

    function imgPrefix(coreConfig) {
        return {
            // prefix: coreConfig.host + '/'
            prefix: coreConfig.host + '/power/'
        }
    }

    function exportPrefix(coreConfig) {
        var host = coreConfig.httpHost + "/";

        return {
            prefix: host + 'device/export',      // 设备导出
            prefixPrint: host + 'device/print',   // 设备打印

            eventPrefix: host + 'event/export',  // 事件导出
            eventPrefixPrint: host + 'event/print',  // 事件打印

            userPrefix: host + 'user/export',      // 用户列表导出
            userPrefixPrint: host + 'user/print',  // 用户列表打印

            reportDown: function (params) {

                // 需要拼接成recordIds[]=xxx&recordIds[]=aaa
                var p = '';
                params.map(function (item) {
                    p += 'recordIds[]=' + item + "&";
                });

                return host + 'rpt/record/download?' + p.substring(0, p.length - 1); // 下载报表
            },

            uploadReport: host + 'report/upload',   // 上传报表文件
            reportAll: host + 'report/multi?',   //下载报表 所有

            checkinAll: host + 'signin/export?',   // 签到列表导出
            checkinAllPrint: host + 'signin/print?',   // 签到列表打印
        }
    }

    function keywordCache(_) {
        var kws = [];
        var kwCache = {};
        var groups = {
            user_position: "user_position",
            client_type: "client_type",
            client_level: "client_level",
            device_type: "device_type",
            device_operationstatus: "device_operationstatus",
            device_phasenum: "device_phasenum",
            device_usecondition: "device_usecondition",
            device_insulationclass: "device_insulationclass",
            user_contracttypt: 'user_contracttypt',  //用户合同类型
            user_education: 'user_education',  //用户教育程度
            user_status: 'user_status',  //用户状态
            user_authority: 'user_authority',  //用户权限

            history_querytype: 'history_querytype',  //历史数据，左侧查询类型
            inspect_exception_type: 'inspect_exception_type', //异常类型
            inspect_type: 'inspect_type', //巡检任务
        };
        kwCache.create = function (arr) {
            if (Array.isArray(arr)) {
                kws = _.cloneDeep(arr);
            }
            return;
        };

        var getType = function (type) {
            return _.cloneDeep(_.filter(kws, function (kw) {
                return kw.group === type;
            }));
        };

        kwCache.getUser_position = function () {
            return getType(groups.user_position);
        };
        kwCache.getClient_type = function () {
            return getType(groups.client_type);
        };
        kwCache.getClient_level = function () {
            return getType(groups.client_level);
        };
        kwCache.getDevice_type = function () {
            return getType(groups.device_type);
        };
        kwCache.getDevice_operationstatus = function () {
            return getType(groups.device_operationstatus);
        };
        kwCache.getDevice_phasenum = function () {
            return getType(groups.device_phasenum);
        };
        kwCache.getDevice_usecondition = function () {
            return getType(groups.device_usecondition);
        };
        kwCache.getDevice_insulationclass = function () {
            return getType(groups.device_insulationclass);
        };
        kwCache.getUser_contracttypt = function () {
            return getType(groups.user_contracttypt);
        };
        kwCache.getUser_education = function () {
            return getType(groups.user_education);
        };
        kwCache.getUser_status = function () {
            return getType(groups.user_status);
        };
        kwCache.getUser_authority = function () {
            return getType(groups.user_authority);
        };
        kwCache.getHistory_querytype = function () {
            return getType(groups.history_querytype);
        };
        kwCache.getInspect_exception_type = function () {
            return getType(groups.inspect_exception_type);
        };
        kwCache.getInspect_type = function () {
            return getType(groups.inspect_type);
        };

        kwCache.isEmpty = function () {
            return kws.length === 0;
        };

        return kwCache;
    }

    function sidebarCache(_, ImgPrefix, ToastUtils) {   // 缓存侧边栏和地图所需信息

        var obj;
        var cache = {};
        cache.create = function (data) {
            if (data.clients && Array.isArray(data.clients)) {
                data.clients.map(function (item) {
                    item.ico = ImgPrefix.prefix + item.ico; // 变电站icon
                });

                obj = _.cloneDeep(data);
                return;
            }

            ToastUtils.openToast('info', '获取变电站信息失败，请联系管理员。');
        };

        cache.getData = function () {
            return _.cloneDeep(obj);
        };

        cache.isEmpty = function () {
            return !obj;
        };

        return cache;
    }

    function locals($window) {
        return {
            put: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defValue) {
                return $window.localStorage[key] || defValue;
            },
            putObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            clear: function () {
                $window.localStorage.clear();
            },
            removeItem: function (key) {
                $window.localStorage.removeItem(key);
            }
        }
    }

    function pieChartCache() {
        return {
            cache: {
                data: [],
                color: []
            }
        }
    }

    function clientCache() {
        return {
            cache: {
                data: {},// 某个变电站
                p: {}    // 当前负荷
            }
        }
    }

    function treeCache(Client, HttpToast, locals, $q) {

        var key = 'tree';   //变电站树
        var k = 'client';   //选中的变电站信息

        var service = {
            init: init,
            getTree: getTree,
            putClient: putClient,
            getClient: getClient,
            createClientArr: createClientArr
        };

        return service;

        function init() {
            locals.removeItem(key);
            locals.removeItem(k);
        }

        function getTree() {
            var deferred = $q.defer();

            var clientTree = locals.getObject(key);

            if (JSON.stringify(clientTree) == '{}' || JSON.stringify(clientTree) == '[]') {
                var p = {tree: "tree"};
                Client.query(p,
                    function (data) {
                        if (Array.isArray(data)) {
                            deferred.resolve(data);
                            locals.putObject(key, data);
                        }
                    },
                    function (err) {
                        deferred.reject();
                        HttpToast.toast(err);
                    })
            }
            else {
                deferred.resolve(clientTree);
            }

            return deferred.promise;
        }

        function putClient(data) {
            locals.putObject(k, data);
        }

        function getClient() {
            return locals.getObject(k);
        }

        function createClientArr(data) {    // 根据树，创建变电站数组，下拉筛选需要
            if (!data || !data.length) return [];

            var clientArr = [];
            data.map(function (t) {
                clientArr.push({
                    clientName: t.name,
                    clientId: t.id
                })
            });

            return clientArr;
        }

    }

    function coreConfig() {

        // var host = 'http://www.shanghaihenghui.com';
        var host = 'http://192.168.0.155';

        // var httpHost = host + '/api';
        var httpHost = host + '/power/api';

        var service = {
            host: host,
            httpHost: httpHost
        };

        return service;

    }

    function mapImgCache(_, ImgPrefix) {

        var service = {
            create: create
        };

        return service;

        function create(data) {

            data.map(function (t) {
                t.ico = ImgPrefix.prefix + t.icon; // 变电站icon
            });

            return _.cloneDeep(data);
        }
    }

    function userCache(locals) {

        var service = {
            getName: getName,
            getUserType: getUserType
        };

        return service;

        function getName() {
            return locals.getObject('user').name;
        }

        function getUserType() {
            return locals.getObject('user').admin;
        }

    }

})();
