(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('ringBar', ringBar);

    function ringBar($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
                    var option = {
                        backgroundColor: '#ffffff',
                        color: newValue.color,
                        series: [
                            {
                                type: 'pie',
                                hoverAnimation: false,       //是否开启 hover 在扇区上的放大动画效果
                                center: ['50%', '50%'],    //饼图的中心（圆心）坐标
                                radius: ['30px', '36px'],  //半径，数组的第一项是内半径，第二项是外半径
                                avoidLabelOverlap: false,   //是否启用防止标签重叠策略
                                label: {                    //饼图图形上的文本标签
                                    normal: {               //默认样式
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {             //高亮样式
                                        show: true,
                                        textStyle: {
                                            fontSize: '12',     //字体大小
                                            fontWeight: 'bold'  //字体的粗细
                                        },
                                        formatter: '{b}\n{c}'    //标签内容格式器
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        borderWidth: 2,
                                        borderColor: '#ffffff'
                                    },
                                    emphasis: {
                                        borderWidth: 2,
                                        borderColor: '#ffffff'
                                    }
                                },
                                data: newValue.data
                            }
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