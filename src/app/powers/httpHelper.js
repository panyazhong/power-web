(function () {
    'use strict';

    angular.module('HttpHelper', ['DataCache'])
        .factory("ClientimgHelper", clientimgHelper)
        // .factory("SidebarHelper", sidebarHelper);
        .factory("DeviceHelper", deviceHelper);

    function clientimgHelper(ImgPrefix, _) {

        return {
            query: function (obj) {
                // 背景
                obj.client.img = ImgPrefix.prefix + obj.client.img;
                obj.client.style = {
                    width: obj.client.imgw + "px",
                    height: obj.client.imgh + "px"
                };
                // 总进线
                obj.incomingline.map(function (item) {
                    item.img = ImgPrefix.prefix + item.img;
                    item.style = {
                        position: 'absolute',
                        top: item.imgtop + "px",
                        left: item.imgleft + "px",
                        width: item.imgw + "px",
                        height: item.imgh + "px"
                    }
                });

                // 支线
                obj.branch.map(function (item) {
                    item.img = ImgPrefix.prefix + item.img;
                    item.style = {
                        position: 'absolute',
                        top: item.imgtop + "px",
                        left: item.imgleft + "px",
                        width: item.imgw + "px",
                        height: item.imgh + "px"
                    }
                });

                return _.cloneDeep(obj);
            }
        }

    }

    function sidebarHelper() {

        return {
            query: function (arr) {
                if (!Array.isArray(arr)) {
                    return;
                }

                // 记录总的变电站

                //
            }
        }
    }

    function deviceHelper() {
        return {
            setDetail: function (params, obj) { // 新建设备提交前转换

                params.phasenum = obj.phasenum;
                params.product_code = obj.product_code;
                params.standard_code = obj.standard_code;
                params.insulationlevel = obj.insulationlevel;
                params.usecondition = obj.usecondition;
                params.insulationclass = obj.insulationclass;

                params.tempriselimit = obj.tempriselimit;
                params.totalweight = obj.totalweight;
                params.connectionsymbol = obj.connectionsymbol;
                params.coolingmode = obj.coolingmode;
                params.current_noload = obj.current_noload;
                params.loss_noload = obj.loss_noload;

                params.shortcircuit_impedance = obj.shortcircuit_impedance;
                params.tapgear = obj.tapgear;

                return params;
            },
            // editBefore: function (obj) {
            //
            //     var data = {};
            //
            // }
        }
    }

})();
