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
                                            lines: []
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
                                    data: 81,
                                    lines: [
                                        {
                                            id: "6",
                                            data: 72,
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
                    id: "1001",
                    data: 101,
                    lines: []
                }
            ];
            $rootScope.$emit('refresh', statusData);

        }, 3000);
    }
})();
