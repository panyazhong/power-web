(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('lineChart5', lineChart5);

    function lineChart5($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {

                    var title = newValue.title;
                    var unit = newValue.unit;
                    var lineTitle = newValue.lineTitle;
                    var timeData = newValue.timeData;  // x轴 时间间隔
                    var lineData = newValue.lineData;

                    var seriesData = [];
                    if(!lineData)return
                    lineData.map(function (item, position) {
                        seriesData.push({
                            name: lineTitle[position],
                            type: 'line',
                            smooth: true, //是否平滑曲线显示
                            showSymbol: false, //false 则只有在 tooltip hover 的时候显示
                            symbol: false, //标记的图形
                            symbolSize: 1,
                            lineStyle: {
                                normal: {
                                    width: 2 //线宽度，def 2
                                }
                            },
                            data: item
                        })
                    });
                    // line config
                    var option = {
                        backgroundColor: '#fff', //背景色
                        title: {
                            text: title,
                            textStyle: {
                                color: '#666',
                                fontSize: 14
                            }
                        },
                        tooltip: { //提示框组件
                            trigger: 'axis',
                            backgroundColor: 'transparent',
                            extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
                            textStyle: {
                                color: '#6a717b'
                            },
                            axisPointer: { //坐标轴指示器配置项
                                lineStyle: {
                                    color: 'transparent' //line color
                                }
                            }
                        },
                        color: ['#e80823','#272727','#6d73e6','#ffa457','#81eb6c'], //调色盘颜色列表
                        legend: {
                            data: lineTitle,
                            y: 'top',
                        },
                        grid: { //组件离容器距离配置
                            left: 60,
                            right: 35,
                            top: 60,
                            bottom: 35
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false, //x轴左右留白设置
                            data: timeData,
                            axisLine: { //轴线相关设置
                                lineStyle: {
                                    color: '#ccd6eb'
                                }
                            },
                            axisLabel: { //刻度标签的相关设置
                                textStyle: {
                                    color: '#666'
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#95ceff'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#666'
                                }
                            },
                            splitLine: { // y轴 区域中的分隔线
                                show: true,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            },
                            name: unit,
                            //nameLocation: 'middle',
                            //nameGap: 40,
                            nameTextStyle: {
                                color: '#666'
                            }
                        },
                        dataZoom: [
                            {
                                show: true,
                                realtime: true,
                                start: 0,
                                end: 100
                            },
                            {
                                type: 'inside',
                                realtime: true,
                                start: 0,
                                end: 100
                            }
                        ],
                        series: seriesData
                    };
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