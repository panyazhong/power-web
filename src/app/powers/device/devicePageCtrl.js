/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.device')
        .controller('devicePageCtrl', devicePageCtrl);

    /** @ngInject */
    function devicePageCtrl($scope) {

        $scope.form = {
            name: '',
            type: '',
            model: '',
            manufacturer: '',
            incomingline: '',
            client_name: '',
            banch_name: '',
            operationstatus: ''
        };

        $scope.clearForm = function () {
            $scope.form = {
                name: '',
                type: '',
                model: '',
                manufacturer: '',
                incomingline: '',
                client_name: '',
                banch_name: '',
                operationstatus: ''
            };
        };

    }

})();
