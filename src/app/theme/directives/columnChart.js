(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('columnChart', columnChart);

    function columnChart($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {

                    var seriesData = [];
                    var data = newValue.data;
                    var legendDate = newValue.xAxisData;
                    if(!data)return
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        seriesData.push({
                            name: item.type,
                            type: 'bar',
                            // barWidth: 35,
                            stack: item.stack,
                            data: data[i].value
                        })
                    }
                    // console.log(JSON.stringify(seriesData));

                    var option = {
                        backgroundColor: '#fff',
                        color: ['#ff7c7c','#ffcd85','#68b8ff','#5c5c61'],
                        tooltip: {
                            lable:{show:false},

                            trigger: 'axis',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
                            textStyle: {
                                color: '#6a717b',
                            },
                            axisPointer: { //坐标轴指示器配置项
                                lineStyle: {
                                    color: 'transparent', //line color
                                },

                            },
                            //.axisPointer.label.show
                        },
                        legend: {
                            data: []
                        },
                        grid: {
                            // left: '3%',
                            // right: '4%',
                            // bottom: '3%',
                            left: 25,
                            right: 5,
                            top: 10,
                            bottom: 5,
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            data: legendDate,
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
                        }],
                        yAxis: [{
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
                            name: '电量 KW.h',
                            nameLocation: 'middle',
                            nameGap: 80,
                            nameTextStyle: {
                                color: '#666'
                            }
                        }],
                        series: []
                    };
                    option.series = seriesData;
                    option.legend.data = legendDate;
                    option.xAxis.data = legendDate;

                    myChart.setOption(option);
                }, true);
                window.addEventListener("resize", function () {  //这里使用$window.onresize方法会使前面的图表无法调整大小
                    myChart.resize();
                });
            }
        };
    }

})();