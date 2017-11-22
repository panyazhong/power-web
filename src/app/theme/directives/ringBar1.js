(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('ringBar1', ringBar1);

    function ringBar1($window) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) { //attrs是DOM元素的属性集合
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
                    var lineTitle = newValue.lineTitle;
                    var option = {
                        backgroundColor: '#fff',
                        color: newValue.color,
                        // legend: {
                        //     type: 'scroll',
                        //     orient: 'vertical',
                        //     right: 10,
                        //     // width:'100px',
                        //     // scrollDataIndex:0,
                        //     // pageButtonItemGap:5,
                        //     // pageButtonGap:'null',
                        //     // pageButtonPosition:'end',
                        //     // pageFormatter: '{current}/{total}' ,
                        //     // pageIcons:{vertical:['M0,0L20,0L10,-20z', 'M0,0L20,0L10,20z']},
                        //     // pageIconColor:'#2f4554',
                        //     // pageIconInactiveColor:'#aaa',
                        //     // pageIconSize:15,
                        //     // // pageTextStyle:,
                        //     // animation:true,
                        //     // animationDurationUpdate:800,
                        //     data: lineTitle
                        // },

                        series: [
                            {
                                type: 'pie',
                                hoverAnimation: true,       //是否开启 hover 在扇区上的放大动画效果
                                center: ['50%', '50%'],    //饼图的中心（圆心）坐标
                                radius: ['', '130px'],  //半径，数组的第一项是内半径，第二项是外半径
                                avoidLabelOverlap: false,   //是否启用防止标签重叠策略

                                label: {                    //饼图图形上的文本标签
                                    normal: {               //默认样式
                                        show: false,
                                        position: 'right'
                                    },
                                    emphasis: {             //高亮样式
                                        show: true,
                                        textStyle: {
                                            fontSize: '12',     //字体大小
                                            fontWeight: 'bold'  //字体的粗细
                                        },
                                        formatter: '{b}\n{c}({d}%)'    //标签内容格式器
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        borderWidth: 1,
                                        borderColor: '#ffffff'
                                    },
                                    emphasis: {
                                        borderWidth: 1,
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