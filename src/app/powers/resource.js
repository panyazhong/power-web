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
                        //console.log('responseError::: ' + JSON.stringify(rejection));
                        return $q.reject(rejection);
                    }
                };
            });

        })
        .factory('Resource', function ($resource, $httpParamSerializerJQLike, $q, coreConfig) {

            var host = coreConfig.httpHost;

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
                            //'Content-Type': 'application/json'
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        /*
                         transformResponse: function(data) {
                         console.log(data);
                         return angular.fromJson(data).data;
                         },
                         */
                        transformRequest: function (data) {
                            //return JSON.stringify(data);
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
        //设备类型列表
        .factory('DevicetypeList', function (Resource) {
            var config = {
                url: 'energy/device/typeList',
                paramsDefault: {
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //设备
        .factory('Device', function (Resource) {
            var config = {
                url: 'energy/device/list/status/:status/type/:type/name/:name',
                paramsDefault: {
                    status: '@status',
                    type:'@type',
                    name:'@name',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //设备删除
        .factory('=', function (Resource) {
            var config = {
                url: 'energy/device/delete/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //获取设备数据
        .factory('DeviceAttr', function (Resource) {
            var config = {
                url: 'energy/device/show/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //修改设备
        .factory('DeviceEdit', function (Resource) {
            var config = {
                url: 'energy/device/modify/:data',
                paramsDefault: {
                    data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })

        //用户列表
         .factory('UserList', function (Resource) {
            var config = {
                url: 'energy/user/index/name/:name',
                paramsDefault: {
                    name:'@name'
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })

        //添加用户
        .factory('UserAdd', function (Resource) {
            var config = {
                url: 'energy/user/add/:data',
                paramsDefault: {
                    data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })
        //获取单个用户信息
        .factory('UserAttr', function (Resource) {
            var config = {
                url: 'energy/user/getOne/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //修改用户
        .factory('UserEdit', function (Resource) {
            var config = {
                url: 'energy/user/modify/:data',
                paramsDefault: {
                    data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })
        //删除用户
        .factory('UserDel', function (Resource) {
            var config = {
                url: 'energy/user/delete/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //电价获取
        .factory('DianjiaList', function (Resource) {
            var config = {
                url: 'energy/config/feeQuery/clientId/:clientId/status/:status',
                paramsDefault: {
                    clientId:'@clientId',
                    status:'@status'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            };
            return Resource(config);
        })
        //电价修改
        .factory('DianjiaSave', function (Resource) {
            var config = {
                url: 'energy/config/feeSave',
                paramsDefault: {
                    data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })
        //上传头像
        .factory('UpImg', function (Resource) {
            var config = {
                url: 'energy/user/headImg',
                paramsDefault: {
                    //data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            console.log(data)
                            return JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })
        //报表类型获取
        .factory('reportTypeList', function (Resource) {
            var config = {
                url: 'energy/public/getReportType',
                paramsDefault: {
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            };
            return Resource(config);
        })
        //培训列表获取
        .factory('TrainList', function (Resource) {
            var config = {
                url: 'energy/train/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            };
            return Resource(config);
        })
        //培训添加
        .factory('TrainAdd', function (Resource) {
            var config = {
                url: 'energy/train/add/:data',
                paramsDefault: {
                    data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })
        //培训删除
        .factory('TrainDel', function (Resource) {
            var config = {
                url: 'energy/train/delete/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //培训详情
        .factory('TrainAttr', function (Resource) {
            var config = {
                url: 'energy/train/getOne/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //技术问答添加
        .factory('TechQaAdd', function (Resource) {
            var config = {
                url: 'energy/techQa/add/:data',
                paramsDefault: {
                    data:'@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },

                }
            };
            return Resource(config);
        })
        //技术问答列表获取
        .factory('TechQaList', function (Resource) {
            var config = {
                url: 'energy/techQa/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            };
            return Resource(config);
        })
        //技术问答删除
        .factory('TechQaDel', function (Resource) {
            var config = {
                url: 'energy/techQa/delete/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //技术问答详情
        .factory('TechQaAttr', function (Resource) {
            var config = {
                url: 'energy/techQa/getOne/id/:id',
                paramsDefault: {
                    id: '@id',
                },
                action: {
                    query: {
                        method: 'GET',
                    },

                }
            };
            return Resource(config);
        })
        //会议纪要添加
        .factory('MeetingAdd', function (Resource) {
            var config = {
                url: 'energy/meeting/add/:data',
                paramsDefault: {
                    data: '@data'
                },
                action: {
                    create: {
                        method: 'POST',
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    },
                }
            }
            return Resource(config)
        })
        //会议纪要列表获取
        .factory('MeetingList', function (Resource) {
            var config = {
                url: 'energy/meeting/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        // //删除会议纪要
        .factory('MeetingDel', function (Resource) {
            var config = {
                url: 'energy/meeting/delete/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        //获取获取会议详情
        .factory('MeetingAttr', function (Resource) {
            var config = {
                url: 'energy/meeting/getOne/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET'
                    }
                }
            }
            return Resource(config)
        })
        //新增安全日常会议记录
        .factory('SafetyDayAdd', function(Resource) {
            var config = {
                url: 'energy/safetyDay/add/:data',
                paramsDefault: {
                    data: '@data'
                },
                action: {
                    create: {
                        method: "POST",
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    }
                }
            }
            return Resource(config)
        })
        //获取日常会议记录列表
        .factory('SafetyDayList', function(Resource) {
            var config = {
                url: 'energy/safetyDay/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: "GET"
                    }
                }
            }
            return Resource(config)
        })
        //删除日常会议记录
        .factory('SafetyDayDel', function (Resource) {
            var config = {
                url: 'energy/safetyDay/delete/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        //获取获取会议详情
        .factory('SafetyDayAttr', function (Resource) {
            var config = {
                url: 'energy/safetyDay/getOne/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET'
                    }
                }
            }
            return Resource(config)
        })
        //新增工作登记簿
        .factory('WorkTicketAdd', function(Resource) {
            var config = {
                url: 'energy/workTicket/add/:data',
                paramsDefault: {
                    data: '@data'
                },
                action: {
                    create: {
                        method: "POST",
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    }
                }
            }
            return Resource(config)
        })
        //获取工作登记簿列表
        .factory('WorkTicketList', function(Resource) {
            var config = {
                url: 'energy/workTicket/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: "GET"
                    }
                }
            }
            return Resource(config)
        })
        //删除工作登记簿
        .factory('WorkTicketDel', function (Resource) {
            var config = {
                url: 'energy/workTicket/delete/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        //获取工作登记簿详情
        .factory('WorkTicketAttr', function (Resource) {
            var config = {
                url: 'energy/workTicket/getOne/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET'
                    }
                }
            }
            return Resource(config)
        })
        //新增周报
        .factory('OperatingWeeklyAdd', function(Resource) {
            var config = {
                url: 'energy/operatingWeekly/add/:data',
                paramsDefault: {
                    data: '@data'
                },
                action: {
                    create: {
                        method: "POST",
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    }
                }
            }
            return Resource(config)
        })
        //获取周报列表
        .factory('OperatingWeeklyList', function(Resource) {
            var config = {
                url: 'energy/operatingWeekly/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: "GET"
                    }
                }
            }
            return Resource(config)
        })
        //删除周报
        .factory('OperatingWeeklyDel', function (Resource) {
            var config = {
                url: 'energy/operatingWeekly/delete/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        //获取周报详情
        .factory('OperatingWeeklyAttr', function (Resource) {
            var config = {
                url: 'energy/operatingWeekly/getOne/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET'
                    }
                }
            }
            return Resource(config)
        })
        //新增设备缺陷
        .factory('EquipmentDefectAdd', function(Resource) {
            var config = {
                url: 'energy/equipmentDefect/add/:data',
                paramsDefault: {
                    data: '@data'
                },
                action: {
                    create: {
                        method: "POST",
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    }
                }
            }
            return Resource(config)
        })
        //获取设备缺陷列表
        .factory('EquipmentDefectList', function(Resource) {
            var config = {
                url: 'energy/equipmentDefect/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: "GET"
                    }
                }
            }
            return Resource(config)
        })
        //删除设备缺陷
        .factory('EquipmentDefectDel', function (Resource) {
            var config = {
                url: 'energy/equipmentDefect/delete/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        //获取设备缺陷详情
        .factory('EquipmentDefectAttr', function (Resource) {
            var config = {
                url: 'energy/equipmentDefect/getOne/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET'
                    }
                }
            }
            return Resource(config)
        })
        //根据电站获取设备
        .factory('GetDeviceByType', function (Resource) {
            var config = {
                url: 'energy/device/getDeviceByType/clientId/:id',
                paramsDefault: {
                    id: "@id"
                },
                action: {
                    query: {
                        method: "GET"
                    }
                }
            }
            return Resource(config)
        })
        //新增设备缺陷
        .factory('AccidentExpectedAdd', function(Resource) {
            var config = {
                url: 'energy/accidentExpected/add/:data',
                paramsDefault: {
                    data: '@data'
                },
                action: {
                    create: {
                        method: "POST",
                        transformRequest: function (data) {
                            return 'data=' + JSON.stringify(data)
                        }
                    }
                }
            }
            return Resource(config)
        })
        //获取设备缺陷列表
        .factory('AccidentExpectedList', function(Resource) {
            var config = {
                url: 'energy/accidentExpected/list',
                paramsDefault: {},
                action: {
                    query: {
                        method: "GET"
                    }
                }
            }
            return Resource(config)
        })
        //删除设备缺陷
        .factory('AccidentExpectedDel', function (Resource) {
            var config = {
                url: 'energy/accidentExpected/delete/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET',
                    },
                }
            }
            return Resource(config)
        })
        //获取设备缺陷详情
        .factory('AccidentExpectedAttr', function (Resource) {
            var config = {
                url: 'energy/accidentExpected/getOne/id/:id',
                paramsDefault: {
                    id: '@id'
                },
                action: {
                    query: {
                        method: 'GET'
                    }
                }
            }
            return Resource(config)
        })
})();
