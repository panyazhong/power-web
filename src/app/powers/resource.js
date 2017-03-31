(function () {
    'use strict';

    angular.module('BlurAdmin.power')
        .config(function ($httpProvider) {

            $httpProvider.interceptors.push(function ($q) {
                return {
                    'request': function (config) {
                        console.log('request: ' + JSON.stringify(config));
                        return config;
                    },
                    'response': function (response) {
                        // called if HTTP CODE = 2xx
                        console.log('response:: ' + JSON.stringify(response));
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
        .factory('Demo', function (Resource) {
            var config = {
                url: 'login',
                paramsDefault: {},
                action: {
                    login: {
                        method: 'POST'
                    },
                }
            };
            return Resource(config);
        })
})();
