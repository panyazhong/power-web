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

            var host = 'http://192.168.0.120/api';

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
            return Resource(config);
        })
        // 用户
        .factory('User', function (Resource) {
            var config = {
                url: 'user/:psw/:logout/:uid',
                paramsDefault: {
                    psw: '@psw',
                    logout: '@logout',
                    uid: '@uid',
                },
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
                    },
                    editpwd: {
                        method: 'POST'
                    },
                    exit: {
                        method: 'GET',
                    },
                    create: {
                        method: 'POST'
                    },
                    queryDetail: {
                        method: 'GET'
                    }
                }
            };
            return Resource(config);
        })
        // 新建修改user
        .factory('EditUser', function (Resource) {
            var config = {
                url: 'user',
                paramsDefault: {},
                action: {
                    create: {
                        method: 'POST'
                    }
                }
            };
            return Resource(config);
        })

        // 侧边栏
        .factory('Sidebar', function (Resource) {
            var config = {
                url: 'sidebar',
                paramsDefault: {},
                action: {
                    query: {
                        method: 'GET',
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
                url: 'branch/:bid/:device',
                paramsDefault: {
                    bid: '@bid',
                    device: '@device',
                },
                action: {
                    queryList: {
                        method: 'GET',
                        isArray: true
                    },
                    query: {    //获取支线基本信息 / 获取支线设备
                        method: 'GET',
                    },
                    update: {
                        method: 'PUT'
                    }
                }
            };
            return Resource(config);
        })
        // 设备
        .factory('Device', function (Resource) {
            var config = {
                url: 'device/:did/:export',
                paramsDefault: {
                    did: '@did',
                    export: '@export'
                },
                action: {
                    query: {
                        method: 'GET'   //获取设备信息
                    },
                    create: {
                        method: 'POST'  //新建设备
                    },
                    update: {
                        method: 'PUT'
                    },
                    delete: {   // 删除设备
                        method: 'DELETE'
                    }
                }
            };
            return Resource(config);
        })
        .factory('DeviceEdit', function (Resource) {
            var config = {
                url: 'device',
                paramsDefault: {},
                action: {
                    update: {
                        method: 'PUT'
                    },
                    delete: {   // 删除设备
                        method: 'DELETE'
                    }
                }
            };
            return Resource(config);
        })
        // 事件
        .factory('Event', function (Resource) {
            var config = {
                url: 'event/:list/:confirm',
                paramsDefault: {
                    list: '@list',
                    confirm: '@confirm'
                },
                action: {
                    query: {
                        method: 'GET'   //获取事件列表，筛选
                    },
                    create: {
                        method: 'POST'
                    },
                    update: {
                        method: 'PUT'   //确认事件
                    },
                    delete: {   // 删除设备
                        method: 'DELETE'
                    }
                }
            };
            return Resource(config);
        })
        // 报警信息
        .factory('AlertMsg', function (Resource) {
            var config = {
                url: 'message/type/:mtid',
                paramsDefault: {
                    mtid: '@mtid'
                },
                action: {
                    query: {
                        method: 'GET',
                        isArray: true
                    },
                    edit: {
                        method: 'POST'
                    }
                }
            };
            return Resource(config);
        })
        // 报表
        .factory('Report', function (Resource) {
            var config = {
                url: 'report/:rpid/:user',
                paramsDefault: {
                    rpid: '@rpid',
                    user: '@user',
                },
                action: {
                    query: {        // 查询报表列表
                        method: 'GET',
                        isArray: true
                    },
                    queryUser: {    // 管理员查询上上传
                        method: 'GET',
                        isArray: true
                    },
                    edit: {
                        method: 'POST'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                }
            };
            return Resource(config);
        })
        // 签到查询
        .factory('Signin', function (Resource) {
            var config = {
                url: 'signin/:client/:clientId/:list',
                paramsDefault: {
                    client: '@client',
                    clientId: '@clientId',
                    list: '@list',
                },
                action: {
                    query: {        //7.4 选择变电站后获取相应的签到点下拉列表
                        method: 'GET',
                        isArray: true
                    },
                    queryUser: {    // 管理员查询上上传
                        method: 'GET',
                        isArray: true
                    },
                    edit: {
                        method: 'POST'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                }
            };
            return Resource(config);
        })
        // 历史数据
        .factory('History', function (Resource) {
            var config = {
                url: 'data/cid/:clientId/:time/:fromTime/:toTime/:interval',
                paramsDefault: {
                    clientId: '@clientId',
                    time: '@time',
                    fromTime: '@fromTime',
                    toTime: '@toTime',
                    interval: '@interval'
                },
                action: {
                    query: {        // 4.3 获取历史数据
                        method: 'GET'
                    }
                }
            };
            return Resource(config);
        })
        // 新报警设置
        .factory('AlertSet', function (Resource) {
            var config = {
                url: 'setting/prop/:client/:cid',
                paramsDefault: {
                    client: '@client',
                    cid: '@cid',
                },
                action: {
                    query: {    // 获取报警list
                        method: 'GET',
                        isArray: true
                    },
                    edit: {  // 修改
                        method: 'PUT'
                    }
                }
            };
            return Resource(config);
        })
        // 新报表设置
        .factory('ReportSet', function (Resource) {
            var config = {
                url: 'rpt/record/client/:client_id',
                paramsDefault: {
                    client_id: '@client_id'
                },
                action: {
                    query: {    // 获取报表列表
                        method: 'GET'
                    }
                }
            };
            return Resource(config);
        })

})();
