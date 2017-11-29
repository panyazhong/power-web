(function () {
    'use strict';

    angular.module('HttpMap', [])
        .config(function ($httpProvider) {

            $httpProvider.interceptors.push(function ($q) {
                return {
                    'request': function (config) {
                        // console.log('request: ' + JSON.stringify(config));
                        return config;
                    },
                    'response': function (response) {
                        // called if HTTP CODE = 2xx
                        // console.log('response:: ' + JSON.stringify(response));
                        return response;
                    },
                    'responseError': function (rejection) {
                        // called if HTTP CODE != 2xx
                        console.log('responseError::: ' + JSON.stringify(rejection));
                        return $q.reject(rejection);
                    }
                };
            });

        })
        .factory('resourceMap', function ($resource, $httpParamSerializerJQLike, $q) {

            var host = 'http://test.shanghaihenghui.com/api';

            var setAction = function (actions) {
                var defaultParams = {
                    //               uid: uid
                };
                for (var key in actions) {
                    var action = actions[key];
                    var defaultAction = {
                        method: 'GET',
                        isArray: false,
                        withCredentials: true,
                        timeout: 30000,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        /*
                         transformResponse: function(data) {
                         console.log(data);
                         return angular.fromJson(data).data;
                         },
                         */
                        transformRequest: function (data) {
                            return JSON.stringify(data);
                        }
                    };
                    action.params = action.params || {};
                    angular.extend(action.params, defaultParams);
                    angular.extend(defaultAction, action);
                    actions[key] = defaultAction;
                }
                return actions;
            };
            var genModel = function (config) {
                var paramsDefault = config.paramsDefault || {};
                return $resource(host + '/' + config.url, paramsDefault, setAction(config.action));
            };
            return genModel;
        })
        .factory('HttpDemo', function (resourceMap) {
            var config = {
                url: 'keyword',
                paramsDefault: {},
                action: {
                    query: {
                        method: 'GET',
                        isArray: true,
                    },
                    create: {
                        method: 'POST'
                    },
                    update: {
                        method: 'PUT'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                }
            };
            return resourceMap(config);
        })
        .factory('LineCount', function (resourceMap) {
            var config = {
                url: 'count/:getLinesByClientId/:client_id/:clientId/:getCountByLineId/:getElectricByLineId/:getElectricMonth/:lineChart/:line_id/:lineId/:type/:dataType',
                paramsDefault: {
                    getLinesByClientId: '@getLinesByClientId',
                    client_id: '@client_id',
                    clientId: '@clientId',
                    getCountByLineId: '@getCountByLineId',
                    line_id: '@line_id',
                    lineId: '@lineId',
                    type: '@type',
                    dataType: '@dataType',
                    lineChart: '@lineChart',
                    getElectricByLineId: '@getElectricByLineId',
                    getElectricMonth: '@getElectricMonth'
                },
                action: {
                    query: {    //根据客户端id获取线
                        method: 'GET',
                        isArray: true
                    },
                    queryLine: {   //折线图数据
                        method: 'GET'
                    },
                    update: {
                        method: 'PUT'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                }
            };
            return resourceMap(config);
        })
        .factory('Fuhe', function (resourceMap) {
            var config = {
                url: 'data/dataP/time/:time/type/:type/line_id/:line_id/interval/:interval',
                paramsDefault: {
                    time: '@time',
                    type:'@type',
                    line_id: '@line_id',
                    interval: '@interval',
                },
                action: {
                    query : {
                        method: 'GET'
                    }
                }
            };
            return resourceMap(config);
        })
        .factory('Xuliang', function (resourceMap) {
            var config = {
                url: 'data/dataDemand/time/:time/type/:type/line_id/:line_id/interval/:interval',
                paramsDefault: {
                    time: '@time',
                    type:'@type',
                    line_id: '@line_id',
                    interval: '@interval',
                },
                action: {
                    query : {
                        method: 'GET'
                    }
                }
            };
            return resourceMap(config);
        })
        .factory('Dianliang', function (resourceMap) {
            var config = {
                url: 'data/dataPt1/time/:time/type/:type/line_id/:line_id/interval/:interval',
                paramsDefault: {
                    time: '@time',
                    type:'@type',
                    line_id: '@line_id',
                    interval: '@interval',
                },
                action: {
                    query : {
                        method: 'GET'
                    }
                }
            };
            return resourceMap(config);
        })
        .factory('Pie', function (resourceMap) {
            var config = {
                url: 'data/countPt1/type/:type/client_id/:client_id/time/:time',
                paramsDefault: {
                    type:'@type',
                    client_id:'@client_id',
                    time:'@time'
                },
                action: {
                    query : {
                        method: 'GET',
                        isArray: true
                    }
                }
            };
            return resourceMap(config);
        })
        .factory('Fenshi', function (resourceMap) {
            var config = {
                url: 'data/timePt1/time/:time/type/:type/line_id/:line_id/interval/:interval',
                paramsDefault: {
                    time: '@time',
                    type:'@type',
                    line_id: '@line_id',
                    interval: '@interval',
                },
                action: {
                    query : {
                        method: 'GET'
                    }
                }
            };
            return resourceMap(config);
        })
})();
