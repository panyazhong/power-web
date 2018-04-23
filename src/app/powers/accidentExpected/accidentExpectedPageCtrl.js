/**
 * @author dapan
 * created on 04/18/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.accidentExpected')
        .controller('accidentExpectedPageCtrl', accidentExpectedPageCtrl)
        .controller('addAccidentExpectedPageCtrl', addAccidentExpectedPageCtrl)
        .controller('editAccidentExpectedPageCtrl', editAccidentExpectedPageCtrl)
        .controller('modalDelCtrl', modalDelCtrl)

    /** @ngInject */
    function accidentExpectedPageCtrl($scope,
                                      AccidentExpectedList,
                                      AccidentExpectedDel,
                                     reportTypeList,
                                     $state,
                                     ModalUtils,
                                     ToastUtils) {
        $scope.data = {
            beginDate: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM-dd'],
                format: 'yyyy-MM-dd',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },
            endDate: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM-dd'],
                format: 'yyyy-MM-dd',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            }
        };
        $scope.show= {
            reportType:'事故预想记录',
            reportTypeArr:[],
            beginDate:'',
            endDate:'',
            maxSize: 15,    // 每页显示的数量
            displayedPages: 0,
            accidentExpectedArr: {},
        };
        //报表类型
        $scope.setTypeList =function(){
            reportTypeList.query(
                function(data) {
                    $scope.show.reportTypeArr = data.data
                },
                function(err) {
                    HttpToast.toast(err);
                })
        };
        $scope.init = function(){
            $scope.setTypeList()
        };
        $scope.init();

        //选择类型
        $scope.setType = function (obj) {
            $scope.show.reportType = obj.name;
            $state.go(obj.type)
        };

        //获取会议列表
        $scope.getData = function (tableState) {
            var pagination = tableState.pagination
            var start = pagination.start || 0
            var number = pagination.number || $scope.show.maxSize
            var params = {
                start: start,
                number: number,
            }

            if ($scope.show.beginDate) {
                params.startTime = moment(moment($scope.show.beginDate).format('YYYY-MM-DD HH:mm:ss')).unix();
            }
            if ($scope.show.endDate) {
                params.endTime = moment(moment($scope.show.endDate).format('YYYY-MM-DD HH:mm:ss')).unix();
            }

            AccidentExpectedList.query(params, function(resp) {
                if (resp.code !== 200) {
                    ToastUtils.openToast('warning', resp.message);
                }
                $scope.show.data = resp.data
                $scope.show.accidentExpectedArr = resp;
                tableState.pagination.numberOfPages = resp.totalPage;
                $scope.show.displayedPages = Math.ceil(parseFloat(resp.totalCount) / parseInt(resp.totalPage));
                $scope.show.accidentExpectedArr.tableState = tableState;
            }, function(err) {
                HttpToast.toast(err);
            })
        }

        //查询刷新table
        $scope.refreshTable = function () {
            if (parseInt($scope.show.accidentExpectedArr.totalPage) <= 1 && $scope.show.accidentExpectedArr.tableState) {
                $scope.getData($scope.show.accidentExpectedArr.tableState);
            } else {
                angular
                    .element('#powerTablePagination')
                    .isolateScope()
                    .selectPage(1);
            }
        };
        $scope.searchList = function(){
            $scope.refreshTable();
        }

        $scope.clearForm = function () {
            $scope.show.beginDate='';
            $scope.show.endDate='';
        };

        //新增会议纪要，弹出模态框
        $scope.addReport = function () {
            ModalUtils.open('app/powers/accidentExpected/widgets/createAccidentExpectedModal.html', 'md',
                addAccidentExpectedPageCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.clearForm();
                        $scope.searchList();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                }
            );
        };

        $scope.toggleBeginDatepicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };
        $scope.toggleEndDatepicker = function () {
            $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
        };

        //删除会议纪要
        $scope.delItem = function (id) {
            ModalUtils.openMsg('app/powers/modal/dangerDel.html',
                '',
                modalDelCtrl,
                {},
                function (info) {
                    if (info) {
                        AccidentExpectedDel.query({
                            id: id
                        }, function(resp) {
                            if (resp.code == 200) {
                                ToastUtils.openToast('success', resp.message)
                                $scope.clearForm(); // 新建，删除需要初始化表单状态
                                $scope.searchList()
                            } else {
                                ToastUtils.openToast('warning', resp.message)
                            }
                        }, function(err) {
                            HttpToast.toast(err);
                        })
                    }
                },
                function (empty) {

                })
        }

        //显示会议详情
        $scope.editReport = function (id) {
            ModalUtils.open('app/powers/accidentExpected/widgets/editAccidentExpectedModal.html',
                'md',
                editAccidentExpectedPageCtrl, {id: id},
                function (info) {
                    // 传值走这里
                    if (info) {
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                })
        }
    }

    function addAccidentExpectedPageCtrl ($scope,
                                         ToastUtils,
                                          AccidentExpectedAdd,
                                         HttpToast,
                                         userCache) {
        $scope.data = {
            timeDate: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM-dd'],
                format: 'yyyy-MM-dd',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },
            evaluateTime: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM-dd'],
                format: 'yyyy-MM-dd',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            }
        };
        $scope.form = {
            time: new Date(),
            evaluateTime: new Date()
        }
        $scope.toggleTimeDatepicker = function () {
            $scope.data.timeDate.isOpen = !$scope.data.timeDate.isOpen;
        };
        $scope.toggleEvaluateTimeDatepicker = function () {
            $scope.data.evaluateTime.isOpen = !$scope.data.evaluateTime.isOpen;
        };
        //点击新增会议纪要
        $scope.add = function (data) {
            data.userId=userCache.getUserId();
            data.time = moment(moment(data.time).format('YYYY-MM-DD HH:mm:ss')).unix()
            data.evaluateTime = moment(moment(data.evaluateTime).format('YYYY-MM-DD HH:mm:ss')).unix()
            if(!data.time ||
                !data.expectMan ||
                !data.expectEvent ||
                !data.handleStep ||
                !data.realHandleStep ||
                !data.evaluate ||
                !data.evaluateTime){
                ToastUtils.openToast('warning', '请完善所有必选信息！');
                return
            }
            var reg = /\n|\r\n/g
            data.expectEvent.replace(reg, "<br>");
            data.handleStep.replace(reg, "<br>");
            data.realHandleStep.replace(reg, "<br>");
            data.evaluate.replace(reg, "<br>");
            AccidentExpectedAdd.create(data, function(resp) {
                if (resp.code == 200) {
                    ToastUtils.openToast('success', resp.message);
                } else {
                    ToastUtils.openToast('warning', resp.message);
                }
                $scope.$close(resp)
            }, function(err) {
                HttpToast.toast(err);
            })
        }
    }

    function modalDelCtrl($scope) {
        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };
    }

    function editAccidentExpectedPageCtrl ($scope,
                                           AccidentExpectedAttr,
                                          params) {
        AccidentExpectedAttr.query({
            id: params.id
        }, function(resp) {
            if (resp.code === 200) {
                var reg=new RegExp("<br>","g"); //创建正则RegExp对象
                resp.data.expectEvent.replace(reg, '\n')
                resp.data.handleStep.replace(reg, '\n')
                resp.data.realHandleStep.replace(reg, '\n')
                resp.data.evaluate.replace(reg, '\n')

                var date = new Date(resp.data.evaluateTime * 1000)
                resp.data.evaluateTime = date.getFullYear() + '-' + (( date.getMonth() + 1 ) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate())

                $scope.form = resp.data
            } else {
                ToastUtils.openToast('warning', resp.message);
            }
        }, function(err) {
            HttpToast.toast(err);
        })
    }
})();