/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.techQa')
    .controller('techQaPageCtrl', techQaPageCtrl)
    .controller('addTechQaPageCtrl', addTechQaPageCtrl)
    .controller('editTechQaPageCtrl', editTechQaPageCtrl)
    .controller('modalDelCtrl', modalDelCtrl);

  /** @ngInject */
    function techQaPageCtrl($scope, $timeout, baConfig,$http,ModalUtils,HttpToast,ToastUtils,$state,
                           reportTypeList,TechQaList,TechQaDel) {
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
          reportType:'技术问答记录',
          reportTypeArr:[],
          beginDate:'',
          endDate:'',
          maxSize: 15,    // 每页显示的数量
          displayedPages: 0,
          techQaArr: {},
      };
      $scope.form = {
          type: '',   //报表类型key
          beginDate:'',
          endDate:'',
      };
      //$scope.formatForm = function () {
      //    var params = {};
      //    for (var Key in $scope.form) {
      //        if ($scope.form[Key]) {
      //            params[Key] = $scope.form[Key];
      //        }
      //    }
      //    return params;
      //};
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
          TechQaList.query(params,
              function (obj) {
                  if(obj.code!=200){
                      ToastUtils.openToast('warning', obj.message);
                  }
                  $scope.show.techQaArr = obj;
                  tableState.pagination.numberOfPages = obj.totalPage;
                  $scope.show.displayedPages = Math.ceil(parseFloat(obj.totalCount) / parseInt(obj.totalPage));
                  $scope.show.techQaArr.tableState = tableState;
              }, function (err) {
                  HttpToast.toast(err);
              });
      };
      $scope.refreshTable = function () {
          if (parseInt($scope.show.techQaArr.totalPage) <= 1 && $scope.show.techQaArr.tableState) {
              $scope.getData($scope.show.techQaArr.tableState);
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
          ModalUtils.open('app/powers/techQa/widgets/createTechQaModal.html', 'lg',
              addTechQaPageCtrl, {},
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
          ModalUtils.open('app/powers/techQa/widgets/editTechQaModal.html', 'lg',
              editTechQaPageCtrl, {id: id},
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
                      TechQaDel.query({
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
    function addTechQaPageCtrl($scope,ToastUtils,HttpToast,
                           userCache,TechQaAdd) {
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
            answerTime: new Date(),
            time: new Date(),
            mustArr:['askMan', 'answerMan', 'answerTime', 'question', 'answer', 'evaluate', 'time']
        }
        $scope.form={
            askMan:'',//提问人
            answerMan:'',//答题人
            answerTime:'',//答题时间
            question:'',//问题
            answer:'',//问题内容
            evaluate:'',//评价
            time:'',//时间
        };
        //赋值


        $scope.formatForm = function () {
            if ($scope.show.answerTime) {
                $scope.form.answerTime = moment(moment($scope.show.answerTime).format('YYYY-MM-DD HH:mm:ss')).unix();
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
            if(!$scope.form.askMan|| !$scope.form.answerMan|| !$scope.form.question|| !$scope.form.answer|| !$scope.form.evaluate){
                ToastUtils.openToast('warning', '请完善所有必选信息！');
                return
            }
            data.question =  data.question.replace(/\n|\r\n/g,"<br>");
            data.answer =  data.answer.replace(/\n|\r\n/g,"<br>");
            data.evaluate =  data.evaluate.replace(/\n|\r\n/g,"<br>");
            TechQaAdd.create(data,function(obj){
                ToastUtils.openToast('success', obj.message);
                $scope.$close(obj);
            },function(err){
                HttpToast.toast(err);
            })


        }
        $scope.toggleStartDatepicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };
        $scope.toggleTimeDatepicker = function () {
            $scope.data.timeDate.isOpen = !$scope.data.timeDate.isOpen;
        };
    }
    function editTechQaPageCtrl($scope,HttpToast,arrUtil,params,ToastUtils,TechQaAttr) {
        //获取用户信息 赋值
        $scope.setuserAttr = function(){
            var p = {id:params.id};
            TechQaAttr.query(p,
                function(data) {
                    $scope.form.askMan = data.data.askMan;
                    $scope.form.answerMan = data.data.answerMan;
                    $scope.form.answerTime = data.data.answerTime;
                    $scope.form.time = data.data.date;
                    var reg=new RegExp("<br>","g");
                    var question=data.data.question.replace(reg,"\n");
                    var answer=data.data.answer.replace(reg,"\n");
                    var evaluate=data.data.evaluate.replace(reg,"\n");
                    $scope.form.question = data.data.question;
                    $scope.form.answer = data.data.answer;
                    $scope.form.evaluate = data.data.evaluate;

                },
                function(err) {
                    HttpToast.toast(err);
                })

        }
        $scope.form={
            askMan:'',//提问人
            answerMan:'',//答题人
            answerTime:'',//答题时间
            question:'',//问题
            answer:'',//问题内容
            evaluate:'',//评价
            time:'',//时间
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