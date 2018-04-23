/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.train')
    .controller('trainPageCtrl', trainPageCtrl)
    .controller('addTrainPageCtrl', addTrainPageCtrl)
    .controller('editTrainPageCtrl', editTrainPageCtrl)
    .controller('modalDelCtrl', modalDelCtrl);

  /** @ngInject */
    function trainPageCtrl($scope, $timeout, baConfig,$http,ModalUtils,HttpToast,ToastUtils,$state,PageTopCache,
                           reportTypeList,TrainList,TrainDel) {
      $state.stateRef = 'report';
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
          reportType:'培训记录',
          reportTypeArr:[],
          beginDate:'',
          endDate:'',
          maxSize: 15,    // 每页显示的数量
          displayedPages: 0,
          trainArr: {},
      };
      $scope.form = {
          type: '',   //报表类型key
          beginDate:'',
          endDate:'',
      };
      $scope.formatForm = function () {
          var params = {};
          for (var Key in $scope.form) {
              if ($scope.form[Key]) {
                  params[Key] = $scope.form[Key];
              }
          }
          return params;
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
          $scope.form.type = obj.type;
          $state.go(obj.type)
      };
      // smart table
      $scope.getData = function (tableState) {

          var pagination = tableState.pagination;
          var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
          var number = pagination.number || $scope.show.maxSize;  // Number of entries showed per page.

          var params = {
              start: start,
              number: number,
          };

          if ($scope.show.beginDate) {
              params.startTime = moment(moment($scope.show.beginDate).format('YYYY-MM-DD HH:mm:ss')).unix();
          }
          if ($scope.show.endDate) {
              params.endTime = moment(moment($scope.show.endDate).format('YYYY-MM-DD HH:mm:ss')).unix();
          }
          TrainList.query(params,
              function (obj) {
                  if(obj.code!=200){
                      ToastUtils.openToast('warning', obj.message);
                  }
                  $scope.show.trainArr = obj;
                  tableState.pagination.numberOfPages = obj.totalPage;
                  $scope.show.displayedPages = Math.ceil(parseFloat(obj.totalCount) / parseInt(obj.totalPage));
                  $scope.show.trainArr.tableState = tableState;
              }, function (err) {
                  HttpToast.toast(err);
              });
      };
      $scope.refreshTable = function () {
          if (parseInt($scope.show.trainArr.totalPage) <= 1 && $scope.show.trainArr.tableState) {
              $scope.getData($scope.show.trainArr.tableState);
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
          //$scope.show.reportType='';
          $scope.show.beginDate='';
          $scope.show.endDate='';
      };
      $scope.addReport = function () {
          ModalUtils.open('app/powers/train/widgets/createTrainModal.html', 'lg',
              addTrainPageCtrl, {},
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
      $scope.editReport = function (id) {
          ModalUtils.open('app/powers/train/widgets/editTrainModal.html', 'lg',
              editTrainPageCtrl, {id: id},
              function (info) {
                  // 传值走这里
                  if (info) {
                  }
              }, function (empty) {
                  // 不传值关闭走这里
              }
          );
      };
      $scope.delItem = function (id) {
          ModalUtils.openMsg('app/powers/modal/dangerDel.html', '',
              modalDelCtrl, {},
              function (info) {
                  // 传值走这里
                  if (info) {
                      TrainDel.query({
                              id: id
                          },
                          function (data) {
                              ToastUtils.openToast('success', data.message);
                              $scope.clearForm(); // 新建，删除需要初始化表单状态
                              $scope.searchList()
                          }, function (err) {
                              HttpToast.toast(err);
                          });
                  }
              }, function (empty) {
                  // 不传值关闭走这里
              });
      };
      $scope.toggleBeginDatepicker = function () {
          $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
      };
      $scope.toggleEndDatepicker = function () {
          $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
      };
  }
    function addTrainPageCtrl($scope,ToastUtils,HttpToast,
                           userCache,TrainAdd) {
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
            },
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
        $scope.show = {
            startTime: new Date(),
            endTime: new Date(),
            time: new Date(),
        }
        $scope.form={
            name:'',//项目名称
            speaker:'',//主讲人
            startTime:'',//开始时间
            endTime:'',//结束时间
            count:'',//参与人数
            sign:'',//人员签到
            content:'',//内容
            checker:'',//检查人
            time:'',//创建时间
        };
        //赋值


        $scope.formatForm = function () {
            if ($scope.show.startTime) {
                $scope.form.startTime = moment(moment($scope.show.startTime).format('YYYY-MM-DD HH:mm:ss')).unix();
            }
            if ($scope.show.endTime) {
                $scope.form.endTime = moment(moment($scope.show.endTime).format('YYYY-MM-DD HH:mm:ss')).unix();
            }
            if ($scope.show.time) {
                $scope.form.time =moment(moment($scope.show.time).format('YYYY-MM-DD HH:mm:ss')).unix();
            }
            var params = {};
            for (var Key in $scope.form) {
                if ($scope.form[Key]) {
                    params[Key] = $scope.form[Key];
                }
            }
            return params;
        };

        $scope.add = function(){
            var data =$scope.formatForm();
            data.userId=userCache.getUserId();
            if(!$scope.form.name|| !$scope.form.speaker|| !$scope.form.count|| !$scope.form.sign|| !$scope.form.content|| !$scope.form.checker){
                ToastUtils.openToast('warning', '请完善所有必选信息！');
                return
            }
            data.sign =  data.sign.replace(/\n|\r\n/g,"<br>");
            data.content =  data.content.replace(/\n|\r\n/g,"<br>");
            //console.log(data);
            TrainAdd.create(data,function(obj){
                ToastUtils.openToast('success', obj.message);
                $scope.$close(obj);
            },function(err){
                HttpToast.toast(err);
            })


        }
        $scope.toggleStartDatepicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };
        $scope.toggleEndDatepicker = function () {
            $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
        };
        $scope.toggleTimeDatepicker = function () {
            $scope.data.timeDate.isOpen = !$scope.data.timeDate.isOpen;
        };
    }
    function editTrainPageCtrl($scope,HttpToast,arrUtil,params,ToastUtils,TrainAttr) {
        //获取用户信息 赋值
        $scope.setuserAttr = function(){
            var p = {id:params.id};
            TrainAttr.query(p,
                function(data) {
                    $scope.form.name = data.data.name;
                    $scope.form.speaker = data.data.speaker;
                    $scope.form.count = data.data.count;
                    $scope.form.checker = data.data.checker;
                    $scope.form.startTime = data.data.startTimeMin;
                    $scope.form.endTime = data.data.endTimeMin;
                    $scope.form.time = data.data.date;
                    var reg=new RegExp("<br>","g"); //创建正则RegExp对象
                    var sign=data.data.sign.replace(reg,"\n");
                    var content=data.data.content.replace(reg,"\n");
                    $scope.form.sign = sign;
                    $scope.form.content =content;
                },
                function(err) {
                    HttpToast.toast(err);
                })

        }
        $scope.form={
            name:'',//项目名称
            speaker:'',//主讲人
            startTime:'',//开始时间
            endTime:'',//结束时间
            count:'',//参与人数
            sign:'',//人员签到
            content:'',//内容
            checker:'',//检查人
            time:'',//创建时间
        };

        $scope.init = function(){
            $scope.setuserAttr()
        }
        $scope.init();

    }
    function modalDelCtrl($scope) {
        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };
    }
})();