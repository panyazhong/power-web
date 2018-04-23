(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('ringBar3', ringBar3);

    function ringBar3($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
                    //console.log(newValue)
                    /**
                     需要传入的值
                     current：当前val
                     total：总val
                     */
                    var currentVal = newValue.total;
                    var totalVal = newValue.diff;
                    var titleText = newValue.rate;
                    var option = {
                        title: {
                            text: titleText,
                            x: '50%',
                            y: '45%',
                            textAlign: "center",
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 16,
                                color: '#59b0ff'
                            }
                        },
                        backgroundColor: '#ffffff',
                        series: [
                            {
                            name: ' ',
                            type: 'pie',
                            center: ['50%', '50%'], //饼图的中心（圆心）坐标
                            radius: ['60px', '75px'], //半径，数组的第一项是内半径，第二项是外半径
                            startAngle: 270, //起始角度，支持范围[0, 360]
                            color: ['#80c5ff', "#d9d9d9"], //当是数组如 ['blue', 'cyan']，颜色将均匀分布
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
                                }
                            },
                            data: [{
                                value: currentVal
                            }, {
                                value: totalVal
                            }]
                        },
                            //{
                            //    name: '',
                            //    type: 'pie',
                            //    center: ['50%', '50%'],
                            //    radius: ['60px', '75px'],
                            //    startAngle: 0,
                            //    color: ['#80c5ff', "#d9d9d9"], //当是数组如 ['blue', 'cyan']，颜色将均匀分布
                            //    itemStyle: {
                            //        normal: {
                            //            borderColor: "transparent",
                            //            borderWidth: "20"
                            //        },
                            //        emphasis: {
                            //            borderColor: "transparent",
                            //            borderWidth: "20"
                            //        }
                            //    },
                            //    labelLine: {
                            //        normal: {
                            //            show: false,
                            //            formatter:false
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