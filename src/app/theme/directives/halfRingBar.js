(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('halfRingBar', halfRingBar);

    function halfRingBar($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
                    /**
                     需要传入的值
                     current：当前val
                     total：总val
                     */
                    var currentVal = parseInt(newValue.current);
                    var totalVal = parseInt(newValue.total);
                    var num = currentVal / totalVal;
                    var chaVal=totalVal-currentVal;
                    var colors = [
                        '#59b0ff', '#36a0ff', '#2397ff', '#138fff', '#4ba9ff',
                        '#ddda10', '#dece16', '#deb821', '#deaa28', '#dea22c',
                        '#de7a40', '#e07146', '#e4654d', '#e65d52', '#e85656'];

                    var activeColor = '';
                    var ratio = 0.06666;
                    for (var i = 0; i < 15; i++) {
                        var start = ratio * i;
                        var end = ratio * (i + 1);
                        if (start < num && num <= end) {
                            activeColor = colors[i];
                        }
                    }
                    if (!activeColor) {
                        activeColor = colors[colors.length - 1];
                    }
                    // 百分比
                    var titleText = '';
                    if (num <= 1) {
                        titleText = (num * 100).toFixed(2) + "%";
                    } else {
                        titleText = "100%";
                    }

                    /**
                     展示的参数说明：
                     titleText：百分比
                     currentVal：当前val
                     chaVal:总-当前的差值
                     totalVal：总val
                     activeColor：覆盖的颜色
                     */

                    /**半环形图 config**/
                    var option = {
                        title: {
                            text: titleText,
                            x: '48%',
                            y: '40%',
                            textAlign: "center",
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12,
                                color: '#3ea1ff'
                            }
                        },
                        backgroundColor: '#ffffff',
                        series: [{
                            name: ' ',
                            type: 'pie',
                            center: ['50%', '50%'], //饼图的中心（圆心）坐标
                            radius: ['35px', '40px'], //半径，数组的第一项是内半径，第二项是外半径
                            startAngle: 270, //起始角度，支持范围[0, 360]
                            color: [activeColor,"#d9d9d9"], //当是数组如 ['blue', 'cyan']，颜色将均匀分布
                            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
                            legendHoverLink: false, //是否启用图例 hover 时的联动高亮
                            itemStyle: {
                                normal: {
                                    borderColor: "transparent",
                                    borderWidth: "20"
                                },
                                emphasis: {
                                    borderColor: "transparent",
                                    borderWidth: "20"
                                }
                            },
                            z: 10,
                            labelLine: {
                                normal: {
                                    show: false
                                },
                            },
                            data: [{
                                value: currentVal //默认覆盖的值
                            }, {
                                value: chaVal
                            }]
                        },
                        //    {
                        //    name: '',
                        //    type: 'pie',
                        //    center: ['50%', '50%'],
                        //    radius: ['35px', '40px'],
                        //    startAngle: 270,
                        //    color: ["#d9d9d9","transparent" ],
                        //    labelLine: {
                        //        normal: {
                        //            show: false
                        //        }
                        //    },
                        //    data: [{
                        //        value: totalVal
                        //    }, {
                        //        value: totalVal
                        //    }]
                        //}

                        ]
                    };

                    myChart.setOption(option);
                }, true);
                window.addEventListener("resize", function () {  //这里使用$window.onresize方法会使前面的图表无法调整大小
                    myChart.resize();
                });
            }
        };
    }

})();