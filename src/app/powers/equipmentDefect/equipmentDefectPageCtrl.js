/**
 * @author dapan
 * created on 04/18/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.equipmentDefect')
        .controller('equipmentDefectPageCtrl', equipmentDefectPageCtrl)
        .controller('addEquipmentDefectPageCtrl', addEquipmentDefectPageCtrl)
        .controller('editEquipmentDefectPageCtrl', editEquipmentDefectPageCtrl)
        .controller('modalDelCtrl', modalDelCtrl)

    /** @ngInject */
    function equipmentDefectPageCtrl($scope,
                                     EquipmentDefectList,
                                     EquipmentDefectDel,
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
            reportType:'设备缺陷登记',
            reportTypeArr:[],
            beginDate:'',
            endDate:'',
            maxSize: 15,    // 每页显示的数量
            displayedPages: 0,
            equipmentDefectArr: {},
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
            console.log(obj.type)
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

            EquipmentDefectList.query(params, function(resp) {
                if (resp.code !== 200) {
                    ToastUtils.openToast('warning', resp.message);
                }
                $scope.show.data = resp.data
                $scope.show.equipmentDefectArr = resp;
                tableState.pagination.numberOfPages = resp.totalPage;
                $scope.show.displayedPages = Math.ceil(parseFloat(resp.totalCount) / parseInt(resp.totalPage));
                $scope.show.equipmentDefectArr.tableState = tableState;
            }, function(err) {
                console.log(err)
            })
        }

        //查询刷新table
        $scope.refreshTable = function () {
            if (parseInt($scope.show.equipmentDefectArr.totalPage) <= 1 && $scope.show.equipmentDefectArr.tableState) {
                $scope.getData($scope.show.equipmentDefectArr.tableState);
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
            ModalUtils.open('app/powers/equipmentDefect/widgets/createEquipmentDefectModal.html', 'md',
                addEquipmentDefectPageCtrl, {},
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
                        EquipmentDefectDel.query({
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

        //显示会议详情
        $scope.editReport = function (id) {
            ModalUtils.open('app/powers/equipmentDefect/widgets/editEquipmentDefectModal.html',
                'md',
                editEquipmentDefectPageCtrl, {id: id},
                function (info) {
                    // 传值走这里
                    if (info) {
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                })
        }
    }

    function addEquipmentDefectPageCtrl ($scope,
                                         ToastUtils,
                                         EquipmentDefectAdd,
                                         HttpToast,
                                         userCache,
                                         GetDeviceByType) {
        //获取站点
        $scope.clientIds = userCache.getclientIds()

        //获取设备
        $scope.getDevice = function (id) {
            GetDeviceByType.query({
                id: id,
            }, function (resp) {
                if (resp.code !== 200) {
                    ToastUtils.openMsg('warning', resp.message)
                }
                $scope.deviceIds = resp.data
            }, function (err) {
                HttpToast.toast(err);
            })
        }
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
        };
        $scope.form = {
            time: new Date()
        }
        $scope.toggleTimeDatepicker = function () {
            $scope.data.timeDate.isOpen = !$scope.data.timeDate.isOpen;
        };

        //点击新增会议纪要
        $scope.add = function (data) {
            data.userId=userCache.getUserId();
            data.time = moment(moment(data.time).format('YYYY-MM-DD HH:mm:ss')).unix()
            if(!data.clientId ||
                !data.deviceId ||
                !data.describe ||
                !data.time ||
                !data.discovery ||
                !data.handle ||
                !data.handleMan){
                ToastUtils.openToast('warning', '请完善所有必选信息！');
                return
            }
            var reg = /\n|\r\n/g
            data.describe.replace(reg, "<br>");
            EquipmentDefectAdd.create(data, function(resp) {
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

    function editEquipmentDefectPageCtrl ($scope,
                                          EquipmentDefectAttr,
                                          params) {
        EquipmentDefectAttr.query({
            id: params.id
        }, function(resp) {
            console.log(resp)
            if (resp.code === 200) {
                var reg=new RegExp("<br>","g"); //创建正则RegExp对象
                resp.data.describe.replace(reg, '\n')
                $scope.form = resp.data
            } else {
                ToastUtils.openToast('warning', resp.message);
            }
        }, function(err) {
            HttpToast.toast(err);
        })
    }
})();