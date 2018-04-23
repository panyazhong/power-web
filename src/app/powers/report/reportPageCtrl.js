/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.report')
    .controller('reportPageCtrl', reportPageCtrl)

  /** @ngInject */
    function reportPageCtrl($scope, $timeout, baConfig,$http,ModalUtils,reportTypeList,$state,ToastUtils) {
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
      reportType:'',
      reportTypeArr:[],
      beginDate:'',
      endDate:'',
      //maxSize: 15,    // 每页显示的数量
      //displayedPages: 0,
      //trainArr: {},
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
    //// smart table
    //$scope.getData = function (tableState) {
    //
    //  var pagination = tableState.pagination;
    //  var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
    //  var number = pagination.number || $scope.show.maxSize;  // Number of entries showed per page.
    //
    //  var params = {
    //    start: start,
    //    number: number,
    //  };
    //
    //  if ($scope.show.beginDate) {
    //    params.startTime = moment(moment($scope.show.beginDate).format('YYYY-MM-DD HH:mm:ss')).unix();
    //  }
    //  if ($scope.show.endDate) {
    //    params.endTime = moment(moment($scope.show.endDate).format('YYYY-MM-DD HH:mm:ss')).unix();
    //  }
    //  TrainList.query(params,
    //      function (obj) {
    //        if(obj.code!=200){
    //          ToastUtils.openToast('warning', obj.message);
    //        }
    //        $scope.show.trainArr = obj;
    //        tableState.pagination.numberOfPages = obj.totalPage;
    //        $scope.show.displayedPages = Math.ceil(parseFloat(obj.totalCount) / parseInt(obj.totalPage));
    //        $scope.show.trainArr.tableState = tableState;
    //      }, function (err) {
    //        HttpToast.toast(err);
    //      });
    //};
    //$scope.refreshTable = function () {
    //  if (parseInt($scope.show.trainArr.totalPage) <= 1 && $scope.show.trainArr.tableState) {
    //    $scope.getData($scope.show.trainArr.tableState);
    //  } else {
    //    angular
    //        .element('#powerTablePagination')
    //        .isolateScope()
    //        .selectPage(1);
    //  }
    //};
    $scope.searchList = function(){
      if($scope.show.reportType==''){
        ToastUtils.openToast('warning', '请选择报表类型！');
      }
    }

    $scope.clearForm = function () {
      //$scope.show.reportType='';
      $scope.show.beginDate='';
      $scope.show.endDate='';
    };
    //$scope.addReport = function () {
    //  ModalUtils.open('app/powers/train/widgets/createTrainModal.html', 'lg',
    //      addTrainPageCtrl, {},
    //      function (info) {
    //        // 传值走这里
    //        if (info) {
    //          $scope.clearForm();
    //          $scope.searchList();
    //        }
    //      }, function (empty) {
    //        // 不传值关闭走这里
    //      }
    //  );
    //};
    //$scope.editReport = function (id) {
    //  ModalUtils.open('app/powers/train/widgets/editTrainModal.html', 'lg',
    //      editTrainPageCtrl, {id: id},
    //      function (info) {
    //        // 传值走这里
    //        if (info) {
    //        }
    //      }, function (empty) {
    //        // 不传值关闭走这里
    //      }
    //  );
    //};
    //$scope.delItem = function (id) {
    //  ModalUtils.openMsg('app/powers/modal/dangerDel.html', '',
    //      modalDelCtrl, {},
    //      function (info) {
    //        // 传值走这里
    //        if (info) {
    //          TrainDel.query({
    //                id: id
    //              },
    //              function (data) {
    //                ToastUtils.openToast('success', data.message);
    //                $scope.clearForm(); // 新建，删除需要初始化表单状态
    //                $scope.searchList()
    //              }, function (err) {
    //                HttpToast.toast(err);
    //              });
    //        }
    //      }, function (empty) {
    //        // 不传值关闭走这里
    //      });
    //};
    $scope.toggleBeginDatepicker = function () {
      $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
    };
    $scope.toggleEndDatepicker = function () {
      $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
    };
  }

})();