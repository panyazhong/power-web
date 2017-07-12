(function () {
    'use strict';

    angular.module('BlurAdmin.power.setalarm')
        .controller('setalarmPageCtrl', setalarmPageCtrl)
        .controller('setICtrl', setICtrl)
        .controller('setUCtrl', setUCtrl)
        .controller('setIaCtrl', setIaCtrl);

    /** @ngInject */
    function setalarmPageCtrl($scope, PageTopCache, Sidebar, SidebarCache, Log, locals, AlertSet, setalarmHelper,
                              HttpToast, ModalUtils) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            setList: [],
            clientName: '',  //变电站
            sidebarArr: []   //变电站数组
        };
        $scope.rowCollection = [];

        $scope.form = {
            client_id: ''  //变电站cid
        };

        // dropdown set 1
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            $scope.show.clientName = obj.clientName;

            // 更换变电站更新列表
            $scope.queryList($scope.form.client_id);
        };

        $scope.queryList = function (cid) {
            AlertSet.query({
                    client: 'client',
                    cid: cid
                },
                function (data) {
                    $scope.show.setList = setalarmHelper.query(data);
                    $scope.rowCollection = setalarmHelper.query(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

        };

        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '') ? locals.get('cid', '') : SidebarCache.getData().sidebar[0].clientId;
            if (cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == cid) {
                        $scope.changeClent(item);
                        $scope.queryList(cid);
                    }
                }
            }

        };

        $scope.init = function () {

            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.show.sidebarArr = data.sidebar;
                        $scope.initFilterInfo();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
                $scope.initFilterInfo();
            }

        };
        $scope.init();

        $scope.openModal = function (path, ctrl, data) {
            ModalUtils.open(path, 'lg',
                ctrl, data,
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.queryList($scope.form.client_id);
                    }
                },
                function (empty) {
                    // 不传值关闭走这里
                });

        };

        $scope.edit = function (item) {
            var d = _.cloneDeep(item);
            // 开关flag
            d.data.map(function (subItem) {
                subItem.showStatus = subItem.status == '1';
                subItem.showMsgFlag = subItem.msgFlag == '1';
            });

            var path = '';
            var ctrl = '';
            switch (item.prop) {
                case 'Ia':  //电流
                case 'Ib':
                case 'Ic':
                case 'PF':  //功率因数
                case 'P':   //有功
                case 'Q':   //无功
                    path = 'app/powers/setalarm/widgets/setIModal.html';
                    ctrl = setICtrl;
                    $scope.openModal(path, ctrl, d);
                    break;
                case 'Ua':  //电压
                case 'Ub':
                case 'Uc':
                    path = 'app/powers/setalarm/widgets/setUModal.html';
                    ctrl = setUCtrl;
                    $scope.openModal(path, ctrl, d);
                    break;
                case 'IaOC':    //继电报警
                case 'IbOC':
                case 'IcOC':
                    path = 'app/powers/setalarm/widgets/setIaModal.html';
                    ctrl = setIaCtrl;
                    $scope.openModal(path, ctrl, d);
                    break;
            }
        };

        $scope.demo = function () {
            var data = [{"prop":"Ia","desc":"A\u76f8\u7535\u6d41\u6700\u5927\u503c","data":[{"prop_id":"3","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"A","status":0,"brief":"A\u76f8\u7535\u6d41\u8fc7\u5927","msgFlag":0,"refVal":"","warning":"3.00","error":"7.00"},{"prop_id":"45","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"A","status":1,"brief":"A\u76f8\u7535\u6d41\u8fc7\u5927","msgFlag":1,"refVal":"","warning":"9.00","error":"100.32"},{"prop_id":"87","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"129","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"171","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"213","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"255","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"297","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"339","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"381","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"423","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"465","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"507","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"549","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"591","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"633","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"675","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"Ua","desc":"A\u76f8\u7535\u538b\u6700\u5927\u503c","data":[{"prop_id":"7","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":1,"brief":"A\u76f8\u7535\u538b\u8fc7\u5927","msgFlag":0,"refVal":"220.00","warning":"120.00","error":""},{"prop_id":"49","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"91","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"133","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"175","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"217","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"259","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"301","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"343","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"385","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"427","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"469","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"511","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"553","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"595","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"637","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"679","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"Ib","desc":"","data":[{"prop_id":"4","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"46","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"88","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"130","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"172","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"214","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"256","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"298","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"340","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"382","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"424","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"466","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"508","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"550","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"592","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"634","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"676","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"Ic","desc":"","data":[{"prop_id":"5","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"47","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"89","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"131","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"173","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"215","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"257","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"299","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"341","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"383","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"425","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"467","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"509","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"551","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"593","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"635","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"677","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"Ub","desc":"","data":[{"prop_id":"8","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"50","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"92","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"134","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"176","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"218","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"260","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"302","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"344","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"386","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"428","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"470","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"512","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"554","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"596","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"638","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"680","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"Uc","desc":"","data":[{"prop_id":"9","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"51","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"93","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"135","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"177","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"219","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"261","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"303","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"345","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"387","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"429","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"471","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"513","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"555","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"597","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"639","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"681","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"PF","desc":"","data":[{"prop_id":"18","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"60","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"102","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"144","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"186","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"228","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"270","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"312","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"354","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"396","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"438","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"480","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"522","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"564","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"606","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"648","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"690","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"P","desc":"","data":[{"prop_id":"23","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"65","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"107","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"149","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"191","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"233","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"275","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"317","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"359","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"401","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"443","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"485","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"527","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"569","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"611","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"653","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"695","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"Q","desc":"","data":[{"prop_id":"27","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"69","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"111","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"153","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"195","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"237","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"279","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"321","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"363","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"405","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"447","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"489","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"531","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"573","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"615","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"657","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"699","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"IaOC","desc":"","data":[{"prop_id":"717","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"720","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"723","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"726","branch_id":"118","branch_name":"4-5\u53f7\u673a\u7b2c4\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"729","branch_id":"119","branch_name":"4-5\u53f7\u673a\u7b2c5\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"732","branch_id":"120","branch_name":"4-5\u53f7\u673a\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"739","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"742","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"745","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"748","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"751","branch_id":"121","branch_name":"6-7\u53f7\u673a\u7b2c5\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"754","branch_id":"122","branch_name":"6-7\u53f7\u673a\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"761","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"764","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"767","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"770","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"773","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"776","branch_id":"123","branch_name":"\u5206\u68c01\u53f7\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"783","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"786","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"789","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"792","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"795","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"798","branch_id":"124","branch_name":"\u5206\u68c02\u53f7\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"IbOC","desc":"","data":[{"prop_id":"718","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"721","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"724","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"727","branch_id":"118","branch_name":"4-5\u53f7\u673a\u7b2c4\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"730","branch_id":"119","branch_name":"4-5\u53f7\u673a\u7b2c5\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"733","branch_id":"120","branch_name":"4-5\u53f7\u673a\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"740","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"743","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"746","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"749","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"752","branch_id":"121","branch_name":"6-7\u53f7\u673a\u7b2c5\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"755","branch_id":"122","branch_name":"6-7\u53f7\u673a\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"762","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"765","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"768","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"771","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"774","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"777","branch_id":"123","branch_name":"\u5206\u68c01\u53f7\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"784","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"787","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"790","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"793","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"796","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"799","branch_id":"124","branch_name":"\u5206\u68c02\u53f7\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]},{"prop":"IcOC","desc":"","data":[{"prop_id":"719","branch_id":"101","branch_name":"\u4f01\u53e3\u56db\u53f7","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"722","branch_id":"102","branch_name":"\u4f01\u53e3\u4e94\u53f7\u957f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"725","branch_id":"103","branch_name":"\u4f01\u53e3\u4e94\u53f7\u77ed","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"728","branch_id":"118","branch_name":"4-5\u53f7\u673a\u7b2c4\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"731","branch_id":"119","branch_name":"4-5\u53f7\u673a\u7b2c5\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"734","branch_id":"120","branch_name":"4-5\u53f7\u673a\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"741","branch_id":"104","branch_name":"\u4e03\u53f7\u9664\u5c18","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"744","branch_id":"105","branch_name":"\u4f01\u53e3\u516d","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"747","branch_id":"106","branch_name":"\u4f01\u53e3\u4e03","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"750","branch_id":"107","branch_name":"\u98ce\u6247","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"753","branch_id":"121","branch_name":"6-7\u53f7\u673a\u7b2c5\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"756","branch_id":"122","branch_name":"6-7\u53f7\u673a\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"763","branch_id":"108","branch_name":"\u5206\u68c01\u53f7\u53cc\u7aef\u952f","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"766","branch_id":"109","branch_name":"\u5206\u68c01\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"769","branch_id":"110","branch_name":"\u5206\u68c01\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"772","branch_id":"111","branch_name":"\u5206\u68c01\u53f7\u80cc\u69fd\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"775","branch_id":"112","branch_name":"\u5206\u68c01\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"778","branch_id":"123","branch_name":"\u5206\u68c01\u53f7\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"785","branch_id":"113","branch_name":"\u5206\u68c03\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"788","branch_id":"114","branch_name":"\u5206\u68c03\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"791","branch_id":"115","branch_name":"\u5206\u68c02\u53f7\u5e95\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"794","branch_id":"116","branch_name":"\u5206\u68c02\u53f7\u9762\u7802\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"797","branch_id":"117","branch_name":"\u5206\u68c02\u53f7\u5206\u677f\u673a","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""},{"prop_id":"800","branch_id":"124","branch_name":"\u5206\u68c02\u53f7\u7b2c6\u56de\u8def","unit":"","status":0,"brief":"","msgFlag":0,"refVal":"","warning":"","error":""}]}]

            $scope.show.setList = setalarmHelper.query(data);
            $scope.rowCollection = setalarmHelper.query(data);
        };
        $scope.demo();
    }

    function setICtrl($scope, params, Log, AlertSet, HttpToast) {

        $scope.show = {
            data: params,
            setList: params.data
        };
        $scope.rowCollection = params.data;

        $scope.formatForm = function () {
            var data = {
                props: {}
            };

            params.data.map(function (item) {
                // 全部传
                data.props[item.prop_id] = {};
                data.props[item.prop_id]['warning'] = item.warning;
                data.props[item.prop_id]['error'] = item.error;
                data.props[item.prop_id]['status'] = item.showStatus ? '1' : '0';
                data.props[item.prop_id]['msgFlag'] = item.showMsgFlag ? '1' : '0';
            });

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSet.edit(params,
                function (data) {
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

    }

    function setUCtrl($scope, params, Log, AlertSet, HttpToast) {

        $scope.show = {
            data: params,
            setList: params.data
        };
        $scope.rowCollection = params.data;

        $scope.formatForm = function () {
            var data = {
                props: {}
            };

            params.data.map(function (item) {
                // 全部传
                data.props[item.prop_id] = {};
                data.props[item.prop_id]['warning'] = item.warning;
                data.props[item.prop_id]['error'] = item.error;
                data.props[item.prop_id]['status'] = item.showStatus ? '1' : '0';
                data.props[item.prop_id]['msgFlag'] = item.showMsgFlag ? '1' : '0';
                // diff
                data.props[item.prop_id]['refVal'] = item.refVal;
            });

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSet.edit(params,
                function (data) {
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

    }

    function setIaCtrl($scope, params, Log, AlertSet, HttpToast) {

        $scope.show = {
            data: params,
            setList: params.data
        };
        $scope.rowCollection = params.data;

        $scope.formatForm = function () {
            var data = {
                props: {}
            };

            params.data.map(function (item) {
                // 全部传
                data.props[item.prop_id] = {};
                data.props[item.prop_id]['status'] = item.showStatus ? '1' : '0';
                data.props[item.prop_id]['msgFlag'] = item.showMsgFlag ? '1' : '0';
            });

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSet.edit(params,
                function (data) {
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

    }

})();
