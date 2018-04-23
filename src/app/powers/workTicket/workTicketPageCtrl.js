/**
 * @author dapan
 * created on 04/18/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.workTicket')
        .controller('workTicketPageCtrl', workTicketPageCtrl)
        .controller('addWorkTicketPageCtrl', addWorkTicketPageCtrl)
        .controller('modalDelCtrl', modalDelCtrl)
        .controller('editWorkTicketPageCtrl', editWorkTicketPageCtrl)


    /** @ngInject */
    function workTicketPageCtrl($scope,
                                WorkTicketList,
                                WorkTicketDel,
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
            reportType:'工作票登记簿',
            reportTypeArr:[],
            beginDate:'',
            endDate:'',
            maxSize: 15,    // 每页显示的数量
            displayedPages: 0,
            workTicketArr: {},
        };
        //报表类型
        $scope.setTypeList =function(){
            reportTypeList.query(
                function(data) {
                    console.log(data)
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
            console.log(obj.type)
            $scope.show.reportType = obj.name;
            $state.go(obj.type)
        };

        //获取工作票登记簿列表
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

            WorkTicketList.query(params, function(resp) {
                if (resp.code !== 200) {
                    ToastUtils.openToast('warning', resp.message);
                }
                $scope.show.data = resp.data
                $scope.show.workTicketArr = resp;
                tableState.pagination.numberOfPages = resp.totalPage;
                $scope.show.displayedPages = Math.ceil(parseFloat(resp.totalCount) / parseInt(resp.totalPage));
                $scope.show.workTicketArr.tableState = tableState;
            }, function(err) {
                console.log(err)
            })
        }

        //查询刷新table
        $scope.refreshTable = function () {
            if (parseInt($scope.show.workTicketArr.totalPage) <= 1 && $scope.show.workTicketArr.tableState) {
                $scope.getData($scope.show.workTicketArr.tableState);
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

        //新增工作票登记簿，弹出模态框
        $scope.addReport = function () {
            ModalUtils.open('app/powers/workTicket/widgets/createWorkTicketModal.html', 'md',
                addWorkTicketPageCtrl, {},
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

        //删除工作票登记簿纪要
        $scope.delItem = function (id) {
            ModalUtils.openMsg('app/powers/modal/dangerDel.html',
                '',
                modalDelCtrl,
                {},
                function (info) {
                    if (info) {
                        WorkTicketDel.query({
                            id: id
                        }, function(resp) {
                            console.log(resp)
                            if (resp.code == 200) {
                                ToastUtils.openToast('success', resp.message)
                                $scope.clearForm(); // 新建，删除需要初始化表单状态
                                $scope.searchList()
                            } else {
                                ToastUtils.openToast('warning', resp.message)
                            }
                        }, function(err) {
                            console.log(err)
                            HttpToast.toast(err);
                        })
                    }
                },
                function (empty) {

                })
        }

        //显示工作票登记簿详情
        $scope.editReport = function (id) {
            ModalUtils.open('app/powers/workTicket/widgets/editWorkTicketModal.html',
                'md',
                editWorkTicketPageCtrl, {id: id},
                function (info) {
                    // 传值走这里
                    if (info) {
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                })
        }
    }

    function addWorkTicketPageCtrl ($scope,
                                    ToastUtils,
                                    WorkTicketAdd,
                                    HttpToast,
                                    userCache) {
        $scope.data = {
            StarttimeDate: {
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
                    timezone: 'Asia/beijing',
                    updateOn: 'default'
                }
            },
            DelaytimeDate: {
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
                    timezone: 'Asia/beijing',
                    updateOn: 'default'
                }
            },
            EndtimeDate: {
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
                    timezone: 'Asia/beijing',
                    updateOn: 'default'
                }
            },

        };
        $scope.form = {
            startTime: new Date(),
            delayTime: new Date(),
            endTime: new Date(),
        }
        $scope.toggleStartTimeDatepicker = function () {
            $scope.data.StarttimeDate.isOpen = !$scope.data.StarttimeDate.isOpen;
        };
        $scope.toggleDelayTimeDatepicker = function () {
            $scope.data.DelaytimeDate.isOpen = !$scope.data.DelaytimeDate.isOpen;
        };
        $scope.toggleEndTimeDatepicker = function () {
            $scope.data.EndtimeDate.isOpen = !$scope.data.EndtimeDate.isOpen;
        };


        //点击新增工作票登记簿纪要
        $scope.add = function (data) {
            data.userId=userCache.getUserId();
            data.startTime = moment(moment(data.startTime).format('YYYY-MM-DD HH:mm:ss')).unix()
            data.delayTime = moment(moment(data.delayTime).format('YYYY-MM-DD HH:mm:ss')).unix()
            data.endTime = moment(moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')).unix()
            if(!data.number|| !data.content|| !data.issuer|| !data.responsibleMan|| !data.licensor|| !data.startTime || !data.delayTime || !data.endTime){
                ToastUtils.openToast('warning', '请完善所有必选信息！');
                return
            }
            var reg = /\n|\r\n/g
            data.content.replace(reg, "<br>");
            WorkTicketAdd.create(data, function(resp) {
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

    function editWorkTicketPageCtrl ($scope,
                                     WorkTicketAttr,
                                     params) {
        WorkTicketAttr.query({
            id: params.id
        }, function(resp) {
            if (resp.code === 200) {
                var reg=new RegExp("<br>","g"); //创建正则RegExp对象
                resp.data.content.replace(reg, '\n')
                $scope.form = resp.data
            } else {
                ToastUtils.openToast('warning', resp.message);
            }
        }, function(err) {
            HttpToast.toast(err);
        })
    }
})();