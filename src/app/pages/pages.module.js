/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
        'ui.router',

        'BlurAdmin.pages.dashboard',
        'BlurAdmin.pages.ui',
        'BlurAdmin.pages.components',
        'BlurAdmin.pages.form',
        'BlurAdmin.pages.tables',
        'BlurAdmin.pages.charts',
        'BlurAdmin.pages.maps',
        'BlurAdmin.pages.profile',
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/dashboard');

        baSidebarServiceProvider.addStaticItem({
            title: 'Pages',
            icon: 'ion-document',
            subMenu: [{
                title: 'Sign In',
                fixedHref: 'auth.html',
                blank: true
            }, {
                title: 'Sign Up',
                fixedHref: 'reg.html',
                blank: true
            }, {
                title: 'User Profile',
                stateRef: 'profile'
            }, {
                title: '404 Page',
                fixedHref: '404.html',
                blank: true
            }]
        });

        baSidebarServiceProvider.addStaticItem({
            title: '时代金融',
            icon: 'ion-grid',
            subMenu: [{
                title: '万6迪威行甲线',
                icon: 'fa fa-circle',
                subMenu: [{
                    title: '供水支线',
                    icon: 'ion-flag',
                    disabled: true
                }, {
                    title: '集控室支线',
                    icon: 'ion-flag',
                    disabled: true
                }, {
                    title: '脱硫支线',
                    icon: 'ion-flag',
                    disabled: true
                }]
            }, {
                title: '国4迪威行乙线',
                icon: 'fa fa-circle',
                subMenu: [{
                    title: '供水支线',
                    icon: 'ion-flag',
                    disabled: true
                }, {
                    title: '集控室支线',
                    icon: 'ion-flag',
                    disabled: true
                }, {
                    title: '脱硫支线',
                    icon: 'ion-flag',
                    disabled: true
                }]
            }, {
                title: '万81迪威行丙线',
                icon: 'fa fa-circle',
                subMenu: [{
                    title: 'Menu Level 1.2.1',
                    disabled: true
                }]
            }]
        });
    }

})();
