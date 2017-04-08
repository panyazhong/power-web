(function () {
    'use strict';

    angular.module('BlurAdmin.power')
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
        .factory('Resource', function ($resource, $httpParamSerializerJQLike, $q) {

            // var host = 'http://112.74.175.108:3100/api';
            var host = 'http://192.168.0.150';

            var setAction = function (actions) {
                var defaultParams = {
                    //               uid: uid
                };
                for (var key in actions) {
                    var action = actions[key];
                    var defaultAction = {
                        method: 'GET',
                        isArray: false,
                        withCredentials: false,
                        timeout: 30000,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        /*
                         transformResponse: function(data) {
                         console.log(data);
                         return angular.fromJson(data).data;
                         },
                         */
                        transformRequest: function (data) {
                            return $httpParamSerializerJQLike(data);
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
        .factory('Keyword', function (Resource) {
            var config = {
                url: 'keyword/:keywordId/:type',
                paramsDefault: {keywordId: '@id', type: '@type'},
                action: {
                    getByType: {
                        method: 'GET'
                    },
                    getList: {
                        method: 'GET',
                        isArray: true
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
            return Resource(config);
        })
        // 用户
        .factory('User', function (Resource) {
            var config = {
                url: 'login',
                paramsDefault: {},
                action: {
                    login: {
                        method: 'POST'
                    },
                    query: {
                        method: 'GET',
                        isArray: true
                    },
                    update: {
                        method: 'PUT'
                    }
                }
            };
            return Resource(config);
        })
        // 概况总览
        .factory('Overview', function (Resource) {
            var config = {
                url: 'client/:cid',
                paramsDefault: {
                    cid: '@cid'
                },
                action: {
                    query: {    //获取所有变电站信息
                        method: 'GET'
                    },
                    queryDetail: {    //获取详情
                        method: 'GET'
                    },
                    update: {
                        method: 'PUT'
                    }
                }
            };
            return Resource(config);
        })
        // 一次系统图
        .factory('Clientimg', function (Resource) {
            var config = {
                url: 'clientimg/:cid',
                paramsDefault: {
                    cid: '@cid'
                },
                action: {
                    query: {    //获取一次系统图
                        method: 'GET',
                    },
                    update: {
                        method: 'PUT'
                    }
                }
            };
            return Resource(config);
        })
        // 支线
        .factory('Branch', function (Resource) {
            var config = {
                url: 'branch/:bid',
                paramsDefault: {
                    bid: '@bid'
                },
                action: {
                    query: {    //获取支线基本信息
                        method: 'GET'
                    },
                    update: {
                        method: 'PUT'
                    }
                }
            };
            return Resource(config);
        })

})();
