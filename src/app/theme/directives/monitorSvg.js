(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('monitorSvg', monitorSvg);

    function monitorSvg($compile, $http) {
        return {
            restrict: 'E',
            scope: {
                templateUrl: '@',
                monitorData: '=',
                // colors: '=',
                tree: '=',
                viewBranch: '&'
            },
            link: function ($scope, $element, $attributes) {

                $scope.$watch('tree', function (newValue, oldValue, scope) {

                    if (!$scope.tree || !$scope.tree.data || !$scope.tree.data.length) return;

                    $http
                        .get($scope.templateUrl)
                        .then(function (resp) {
                            var html = resp.data;
                            $element.html(html);
                            $compile($element.contents())($scope);
                        });


                    var config = {
                        origin: {x: 230, y: 80},
                        client: {left: 25, right: 85, gap: 200, h: 4},
                        inc: {top: 35, bottom: 60, gap: 95, w: 0.5},
                        branch: {offsetX: -4},
                        incTitle: {top: 80, offsetX: -10, gap: 20},
                        incU: {offsetX: -50}
                    };
                    $scope.color = function (key) {
                        return {'color': $scope.colors[key] || 'black'};
                    };
                    //  client & incomingline
                    var incCount = $scope.tree.data.length;
                    var maxBranchCount = $scope.tree.data.reduce(function (acc, inc) {
                        return Math.max(acc, inc.lines.length);
                    }, 0);
                    var clientLength = config.client.left + config.client.right + (incCount - 1) * config.client.gap;
                    var incLength = config.inc.top + config.inc.bottom + (maxBranchCount - 1) * config.inc.gap;
                    $scope.clientPathD = ['M', config.origin.x, config.origin.y, 'h', clientLength, 'v', config.client.h, 'h', -clientLength, 'z'].join(' ');
                    //        console.log('clientPathD', $scope.clientPathD);
                    $scope.incPathD = function (idx) {
                        var d = ['M', config.origin.x + config.client.left + idx * config.client.gap, config.origin.y + config.client.h, 'h', config.inc.w, 'v', incLength, 'h', -config.inc.w, 'z'].join(' ');
                        //          console.log('incPathD', idx, d);
                        return d;
                    }
                    //  branch
                    $scope.branchTransform = function (incIdx, branchIdx) {
                        var x = config.origin.x + config.client.left + incIdx * config.client.gap + config.branch.offsetX;
                        var y = config.origin.y + config.client.h + branchIdx * config.inc.gap;
                        return 'translate(' + x + ', ' + y + ')';
                    }
                    //  backgroun size
                    $scope.bgSize = {
                        'width': (config.origin.x + clientLength + 150),
                        'height': (config.origin.y + config.client.h + incLength + 200)
                    };
                    //  parse monitor data
                    for (var i = 0; i < $scope.tree.data.length; i++) {
                        var inc = $scope.tree.data[i];
                        inc.name = _splitStr(inc.name);
                    }
                    // incomingline name transform
                    $scope.incNameTransform = function (incIndex, charIndex) {
                        var matrix = 'matrix(8, 0, 0, 8, ' + (config.origin.x + config.client.left + incIndex * config.client.gap + config.incTitle.offsetX) + ', ' + (config.origin.y + config.client.h + config.incTitle.top + charIndex * config.incTitle.gap) + ')';
                        return matrix;
                    }
                    //  client name
                    $scope.clientNameTransform = 'matrix(10, 0, 0, 10, ' + (config.origin.x + clientLength / 2 - 15 * $scope.tree.name.length / 2) + ',' + (config.origin.y - 15) + ')';
                    console.log(clientLength, $scope.clientNameTransform);
                    //  incomingline U
                    $scope.incUTransform = function (incIndex, name) {
                        return 'matrix(8, 0, 0, 8, ' + (config.origin.x + config.client.left + incIndex * config.client.gap + config.incU.offsetX) + ',' + (config.origin.y + config.client.h + config.incTitle.top + name.length * config.incTitle.gap) + ')';
                    }
                    $scope.line = {
                        id: '',
                        name: '',
                        Ia: '',
                        Ib: '',
                        Ic: '',
                        Ua: '',
                        Ub: '',
                        Uc: '',
                        P: '',
                        Q: '',
                        PF: '',
                        Pt1: ''
                    };   //选中的popov数据
                    $scope.filterKey = ['id', 'name'];
                    $scope.chooseBranch = function (incId, lineId, incIndex, branchIndex) {
                        // console.log('chooseBranch: ' + incId + " / " + lineId + " / " + incIndex + " / " + branchIndex);
                        // console.log('chooseBranch 111：' + JSON.stringify($scope.tree.data[incIndex].lines[branchIndex]));
                        // console.log('chooseBranch 222：' + JSON.stringify($scope.monitorData[incIndex].lines[branchIndex]));

                        $scope.line["id"] = $scope.tree.data[incIndex].lines[branchIndex].id;
                        $scope.line["name"] = $scope.tree.data[incIndex].lines[branchIndex].name;

                        var info = $scope.monitorData[incIndex].lines[branchIndex];
                        for (var Key in $scope.line) {
                            if ($scope.filterKey.indexOf(Key) == -1) {
                                $scope.line[Key] = info[Key] || '';
                            }
                        }

                        // console.log('chooseBranch : ' + JSON.stringify($scope.line));
                    }

                });

            },
            controller: ['$scope', function ($scope) {
            }]
        }
    }

    function _splitStr(str) {
        var arr = str.split('');
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === '#' && i > 0) {
                arr[i - 1] += arr[i];
                arr.splice(i, 1);
            }
        }
        return arr;
    }

})();