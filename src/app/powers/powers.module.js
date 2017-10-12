(function () {
    'use strict';

    angular.module('BlurAdmin.power', [
        'ui.router',
        'Lodash',

        'BlurAdmin.power.overview',
        'BlurAdmin.power.monitoring',
        'BlurAdmin.power.device',
        'BlurAdmin.power.events',
        'BlurAdmin.power.checkin',
        'BlurAdmin.power.history',
        'BlurAdmin.power.report',
        'BlurAdmin.power.settings',
        'BlurAdmin.power.branch',
        'BlurAdmin.power.setuser',
        'BlurAdmin.power.setalarm',
        'BlurAdmin.power.setpwd'
    ])
        .config(routeConfig)
        .run(initialize);

    /** @ngInject */
    function routeConfig($urlRouterProvider) {

        $urlRouterProvider.otherwise('/overview');
    }

    function initialize(EventsCache, $rootScope, $interval) {
        console.log('initialize...');

        EventsCache.login();

        var testNum = 0;
        var testNum2 = 1;
        $interval(function () {

            /**
             * status
             */
            var statusData = [
                {
                    id: "1",
                    data: 100,
                    lines: [
                        {
                            id: "1",
                            data: 90,
                            lines: [
                                {
                                    id: "2",
                                    data: 80,
                                    lines: [
                                        {
                                            id: "4",
                                            data: 70,
                                            lines: [
                                                {
                                                    id: "8",
                                                    data: testNum,
                                                    lines: [
                                                        {
                                                            id: "9",
                                                            data: testNum2,
                                                            lines: []
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            id: "5",
                                            data: 71,
                                            lines: []
                                        }
                                    ]
                                },
                                {
                                    id: "3",
                                    data: 0,
                                    lines: [
                                        {
                                            id: "6",
                                            data: 0,
                                            lines: []
                                        },
                                        {
                                            id: "7",
                                            data: 73,
                                            lines: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "3",
                    data: testNum,
                    lines: []
                },
                {
                    id: "101",
                    data: 0,
                    lines: [
                        {
                            "id": "96",
                            data: 0,
                            "name": "企口4#线电源控制柜",
                            "category": "0",
                            "lines": [
                                {
                                    "id": "101",
                                    data: 0,
                                    "name": "企口4#",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "102",
                                    data: 1,
                                    "name": "企口5#长",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "103",
                                    data: 1,
                                    "name": "企口5#短",
                                    "category": "0",
                                    "lines": []
                                }
                            ]
                        },
                        {
                            "id": "97",
                            data: 0,
                            "name": "6#7#机电源控制柜",
                            "category": "0",
                            "lines": [
                                {
                                    "id": "104",
                                    "name": "7#除尘",
                                    "category": "0",
                                    data: 1,
                                    "lines": []
                                },
                                {
                                    "id": "105",
                                    data: 1,
                                    "name": "企口6#机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "106",
                                    data: 0,
                                    "name": "企口7#机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "107",
                                    data: 0,
                                    "name": "企口7#机进板处电箱",
                                    "category": "0",
                                    "lines": []
                                }
                            ]
                        },
                        {
                            "id": "98",
                            data: 1,
                            "name": "分检1#机电源控制柜",
                            "category": "0",
                            "lines": [
                                {
                                    "id": "108",
                                    data: 0,
                                    "name": "分检1#线双端锯",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "109",
                                    data: 1,
                                    "name": "分检1#线分板机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "110",
                                    data: 0,
                                    "name": "分检1#线底砂机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "111",
                                    data: 0,
                                    "name": "分检1#线背槽机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "112",
                                    data: 2,
                                    "name": "分检1#线面砂机、1#线拐弯机",
                                    "category": "0",
                                    "lines": []
                                }
                            ]
                        },
                        {
                            "id": "99",
                            data: 1,
                            "name": "分检2#3#机电源控制柜",
                            "category": "0",
                            "lines": [
                                {
                                    "id": "113",
                                    data: 0,
                                    "name": "分检3#线面砂机、3#线拐弯机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "114",
                                    data: 1,
                                    "name": "分检3#线底砂机、3#线双端锯",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "115",
                                    data: 0,
                                    "name": "分检2#线底砂机、3#线双端锯",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "116",
                                    data: 1,
                                    "name": "分检2#线面砂机",
                                    "category": "0",
                                    "lines": []
                                },
                                {
                                    "id": "117",
                                    data: 0,
                                    "name": "分检2#3#线分板机",
                                    "category": "0",
                                    "lines": []
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "1001",
                    data: 103,
                    lines: []
                }
            ];
            testNum = testNum == 0 ? 555 : 0;
            testNum2 = testNum2 == 0 ? 555 : 0;
            $rootScope.$emit('refresh', statusData);

        }, 3000);
    }
})();
