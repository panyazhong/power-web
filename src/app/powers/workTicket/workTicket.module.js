/**
 * @author dapan
 * created on 04/18/2018
 */
(function () {
    'use strict'

    angular.module('BlurAdmin.power.workTicket', [])
        .config(routeConfig)

    function routeConfig($stateProvider) {
        $stateProvider
            .state('workTicket', {
                url: '/workTicket',
                templateUrl: 'app/powers/workTicket/workTicket.html',
                controller: 'workTicketPageCtrl'
            })
    }
})()