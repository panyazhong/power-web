(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('columnChart1', columnChart1);
//
    function columnChart1($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
                    var current = newValue.currentData;
                    var last = newValue.lastData;
                    var barTitle = newValue.barTitle;
                    var myData = ['尖', '峰', '平', '谷'];
                    var option = {
                        backgroundColor: '#fff',
                        legend: {
                                data: barTitle,
                                top: 4,
                                left: '0',
                                textStyle: {
                                    color: '#000',
                                },
                            },
                        tooltip: {
                                show: false,
                                trigger: 'axis',
                                formatter: '{b}<br/>{a}: {c}',
                                axisPointer: {
                                    type: 'shadow',
                                }
                            },
                        grid: [
                                {
                                show: false,
                                left: '4%',
                                containLabel: true,
                                top: 20,
                                bottom: 0,
                                width: '46%',
                            },
                                {
                                show: false,
                                left: '50.5%',
                                top: 0,
                                bottom: 0,
                                width: '0%',
                            },
                                {
                                show: false,
                                right: '4%',
                                containLabel: true,
                                top: 20,
                                bottom: 0,
                                width: '46%',
                            },
                        ],
                        xAxis: [
                            {
                                type: 'value',
                                inverse: true,
                                axisLine: {
                                    show: false,
                                },
                                axisTick: {
                                    show: false,
                                },
                                position: 'top',
                                axisLabel: {
                                    show: false,
                                    textStyle: {
                                        color: '#B2B2B2',
                                        fontSize: 12,
                                    },
                                },
                                max:200000,
                                splitLine: {
                                    show: false,
                                    lineStyle: {
                                        color: '#1F2022',
                                        width: 1,
                                        type: 'solid',
                                    },
                                },
                            },
                            {
                                gridIndex: 1,
                                show: false,
                            },
                            {
                                gridIndex: 2,
                                type: 'value',
                                axisLine: {
                                    show: false,
                                },
                                axisTick: {
                                    show: false,
                                },
                                position: 'top',
                                axisLabel: {
                                    show: false,
                                    textStyle: {
                                        color: '#B2B2B2',
                                        fontSize: 12,
                                    },
                                },
                                max:200000,
                                splitLine: {
                                    show: false,
                                    lineStyle: {
                                        color: '#1F2022',
                                        width: 1,
                                        type: 'solid',
                                    },
                                },
                            },
                        ],
                        yAxis: [
                            {
                                type: 'category',
                                inverse: true,
                                position: 'right',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    margin: 15,
                                    textStyle: {
                                        color: '#000',
                                        fontSize: 16,
                                        fontWeight:600
                                    },

                                },
                                data:myData,
                            },
                            {
                                gridIndex: 1,
                                type: 'category',
                                inverse: true,
                                position: 'left',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: false,
                                    textStyle: {
                                        color: '#9D9EA0',
                                        fontSize: 12,
                                    },

                                },
                                data:myData,
                            },
                            {
                                gridIndex: 2,
                                type: 'category',
                                inverse: true,
                                position: 'left',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: false,
                                    textStyle: {
                                        color: '#9D9EA0',
                                        fontSize: 12,
                                    },

                                },
                                data: myData,
                            }, ],
                        series: [
                        {
                            name: barTitle[0],
                            type: 'bar',
                            barGap: 20,
                            barWidth: 20,
                            label: {
                                normal: {
                                    show: true,
                                    position:'left'
                                },
                                //emphasis: {
                                //    show: true,
                                //    position: 'left',
                                //    offset: [0, 0],
                                //    textStyle: {
                                //        color: '#fff',
                                //        fontSize: 14,
                                //    },
                                //},
                            },
                            itemStyle: {
                                normal: {
                                    color: '#68b8ff',
                                },
                                //emphasis: {
                                //    color: '#08C7AE',
                                //},
                            },
                                data: current,
                        },
                        {
                            name: barTitle[1],
                            type: 'bar',
                            barGap: 20,
                            barWidth: 20,
                            xAxisIndex: 2,
                            yAxisIndex: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position:'right'
                                },
                                //emphasis: {
                                //    show: true,
                                //    position: 'right',
                                //    offset: [0, 0],
                                //    textStyle: {
                                //        color: '#fff',
                                //        fontSize: 14,
                                //    },
                                //},
                            },
                            itemStyle: {
                                normal: {
                                    color: '#F68989',
                                },
                                //emphasis: {
                                //    color: '#F94646',
                                //},
                            },
                            data: last,
                                }
                        ],
                        }
                    myChart.clear();
                    myChart.setOption(option);
                }, true);
                window.addEventListener("resize", function () {  //这里使用$window.onresize方法会使前面的图表无法调整大小
                    myChart.resize();
                });
            }
        };
    }

})();