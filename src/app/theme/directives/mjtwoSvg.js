(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('mjtwoSvg', mjtwoSvg);

    function mjtwoSvg($compile, $http) {
        return {
            restrict: 'AE',
            scope: {
                templateUrl: '@',
                monitorData: '=',
                // colors: '=',
                tree: '=',
                viewBranch: '&',
                scaleNum: '=',
                clickOne:'&',
                clickTwo:'&',
            },
            link: function ($scope, $element, $attributes) {
                $scope.num = 1; // 缩放比例，默认1

                $scope.$watch('tree', function (newValue, oldValue, scope) {

                    if (!$scope.tree || !$scope.tree.data || !$scope.tree.data.length) return;

                    $http
                        .get($scope.templateUrl)
                        .then(function (resp) {
                            var html = resp.data;
                            $element.html(html);
                            $compile($element.contents())($scope);
                        });
                    $scope.bgSize = {
                        'width': 1024,
                        'height': 960
                    };
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

                        var info = $scope.monitorData[1].lines[incIndex].lines[branchIndex];
                        for (var Key in $scope.line) {
                            if ($scope.filterKey.indexOf(Key) == -1) {
                                $scope.line[Key] = info[Key] || '';

                            }
                        }

                        // console.log('chooseBranch : ' + JSON.stringify($scope.line));
                    }

                });
                $scope.$watch('scaleNum', function (newValue, oldValue, scope) {
                    if (newValue > oldValue) {
                        // 增大
                        $scope.bgSize.width += 100;
                        $scope.bgSize.height += 100;
                        $scope.num += 0.1;
                    }
                    else if (newValue < oldValue) {
                        // 缩小
                        $scope.bgSize.width -= 100;
                        $scope.bgSize.height -= 100;
                        $scope.num -= 0.1;
                    }
                });

            },
            controller: ['$scope', function ($scope) {
            }]
        }
    }

    // function _splitStr(str) {
    //     var arr = str.split('');
    //     for (var i = arr.length - 1; i >= 0; i--) {
    //         if (arr[i] === '#' && i > 0) {
    //             arr[i - 1] += arr[i];
    //             arr.splice(i, 1);
    //         }
    //     }
    //     return arr;
    // }

})();