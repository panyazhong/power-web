(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('ringBar2', ringBar2);

    function ringBar2($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
                    var option = {
                        backgroundColor: '#ffffff',
                        color: ['#ff7c7c','#ffcd85','#68b8ff','#5c5c61'],
                        series: [
                            {
                                type: 'pie',
                                hoverAnimation: false,       //是否开启 hover 在扇区上的放大动画效果
                                center: ['50%', '50%'],    //饼图的中心（圆心）坐标
                                radius: ['50px', '70px'],  //半径，数组的第一项是内半径，第二项是外半径
                                avoidLabelOverlap: false,   //是否启用防止标签重叠策略
                                label: {                    //饼图图形上的文本标签
                                    normal: {               //默认样式
                                        show: true,
                                        position: 'left',
                                        textStyle: {
                                            fontSize: '14',     //字体大小
                                            fontWeight: 'bold'  //字体的粗细
                                        },
                                        formatter: '{b}\n({d}%)'    //标签内容格式器
                                    }

                                    //emphasis: {             //高亮样式
                                    //    show: false,
                                    //    textStyle: {
                                    //        fontSize: '14',     //字体大小
                                    //        fontWeight: 'bold'  //字体的粗细
                                    //    },
                                    //    formatter: '{b}\n({d}%)'    //标签内容格式器
                                    //}
                                },
                                labelLine: {
                                    normal: {
                                        show: true
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
                    //myChart.clear();
                    myChart.setOption(option);
                }, true);
                window.addEventListener("resize", function () {  //这里使用$window.onresize方法会使前面的图表无法调整大小
                    myChart.resize();
                });
            }
        };
    }

})();