(function () {
    'use strict';

    angular.module('HttpHelper', ['DataCache'])
        .factory("ClientimgHelper", clientimgHelper)
        .factory("BranchimgHelper", branchimgHelper)
        .factory("DeviceHelper", deviceHelper)
        .factory("UserHelper", userHelper)
        .factory("reportHelper", reportHelper)
        .factory("setalarmHelper", setalarmHelper)
        .factory("excepNumHelper", excepNumHelper);

    function clientimgHelper(_) {

        return {
            query: function (obj, mObj) {

                var imgCND = 'http://acc-earpktxp.oss-cn-shanghai.aliyuncs.com/';
                // 变电站
                if (obj.client && obj.client.img) {
                    if (!obj.client.imgLink) {
                        obj.client.imgLink = imgCND + obj.client.img;
                    }
                    if (!obj.client.style) {
                        obj.client.style = {
                            width: obj.client.imgw + "px",
                            height: obj.client.imgh + "px"
                        };
                    }
                }

                // 支线
                var iArr = [];
                obj.branch.map(function (item) {
                    item.style = {
                        position: 'absolute',
                        top: item.imgtop + "px",
                        left: item.imgleft + "px",
                        width: item.imgw + "px",
                        height: item.imgh + "px"
                    };

                    // 电流为0时，支线显示绿色
                    if (mObj && mObj[item.bid] && mObj[item.bid].Itotal == 0) {
                        item.style.background = 'url(' + imgCND + item.img + ')';
                    }
                    else {
                        item.style.background = 'transparent';
                        // 有一个电流不为零，则显示红的
                        if (iArr.indexOf(item.inid) === -1) {
                            iArr.push(item.inid);
                        }
                    }
                });

                // 总进线
                obj.incomingline.map(function (item) {
                    if (iArr.length > 0 && iArr.indexOf(item.inid) !== -1) {
                        item.style = {
                            display: 'none'
                        }
                    }
                    else {
                        item.imgLink = imgCND + item.img;
                        item.style = {
                            position: 'absolute',
                            top: item.imgtop + "px",
                            left: item.imgleft + "px",
                            width: item.imgw + "px",
                            height: item.imgh + "px"
                        }
                    }

                });

                return _.cloneDeep(obj);
            }
        }

    }

    function branchimgHelper(ImgPrefix, _) {

        return {
            query: function (obj) {
                obj.dlt_img = ImgPrefix.prefix + obj.dlt_img;
                return _.cloneDeep(obj);
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
            }
        }
    }

    function userHelper(_, ToastUtils) {

        return {
            query: function (obj) {
                // 用户列表
                obj.map(function (item) {
                    item.clientsList = item.clients.split("/");
                });

                return _.cloneDeep(obj);
            },
            add: function (isMust, formObj) {

                for (var Key in formObj) {
                    if (isMust.indexOf(Key) == -1) {  //必选
                        if (!formObj[Key]) {
                            ToastUtils.openToast('warning', '请完善所有必选信息！');
                            return false;
                        }
                    }
                }

                var params = {};
                for (var Key in formObj) {
                    if (formObj[Key]) {
                        params[Key] = formObj[Key];
                    }
                }

                return params;
            }
        }
    }

    function reportHelper(_) {

        return {
            query: function (obj) {
                // 报表列表
                obj.map(function (item) {
                    var arr = item.clients.split("/");
                    item.clientsList = arr;
                });

                return _.cloneDeep(obj);
            }
        }
    }

    function setalarmHelper(_) {
        return {
            query: function (obj) {
                // 设置报警列表
                obj.map(function (item) {
                    item.detail = "";
                    if (item.prop == "Tet" || item.prop == "Tsc") {
                        var advancePeriod = item.data.advancePeriod || '';
                        var unit = item.data.unit || '';

                        item.detail = '提前报警时间' + advancePeriod + unit + '，下次电试日期' + item.data.date;

                        // parse float
                        item.data.advancePeriod = parseFloat(item.data.advancePeriod);
                    }
                    else if (item.prop == "PSum") {

                        var w = item.data.warning || '';
                        var e = item.data.error || '';
                        var u = item.data.unit || '';

                        item.detail = '预警 ' + w + u + '，报警 ' + e + u;

                        // parse float
                        item.data.warning = parseFloat(item.data.warning);
                        item.data.error = parseFloat(item.data.error);
                    }
                    else {
                        item.data.map(function (subItem) {
                            var msg = '';
                            var warning = subItem.warning || '';
                            var error = subItem.error || '';
                            var unit = subItem.unit || '';

                            if (!warning && !error) {
                                msg = ": 未设置；"
                            }
                            else {
                                var w = warning ? ' 预警' + warning + unit : '';
                                var e = error ? ' 报警' + error + unit : '';
                                msg = ":" + w + e + "；";
                            }

                            if (subItem.branch_name) {
                                item.detail += subItem.branch_name + msg;
                            }

                            // parse float
                            subItem.warning = parseFloat(subItem.warning);
                            subItem.error = parseFloat(subItem.error);
                            subItem.refVal = parseFloat(subItem.refVal);
                        })

                    }
                });

                return _.cloneDeep(obj);
            }
        }
    }

    function excepNumHelper(_) {
        return {
            createDone: function (data) {
                if (!data.exception || !data.exception.done) return {};

                var temp = data.exception.done;

                if (temp["1"] == 0 && temp["2"] == 0 && temp["3"] == 0) {
                    // 数量都为0时
                    return {
                        color: ['#999999'],
                        data: [
                            {value: 0, name: '无'}
                        ]
                    };
                }
                else {
                    var ringData = {
                        color: ['#e85656', '#f0a53d', '#3b89ce'],
                        data: [
                            {value: 0, name: '危急'},
                            {value: 0, name: '严重'},
                            {value: 0, name: '一般'}
                        ]
                    };
                    ringData.data[0].value = temp["1"];
                    ringData.data[1].value = temp["2"];
                    ringData.data[2].value = temp["3"];

                    return _.cloneDeep(ringData);
                }
            },
            createUndo: function (data) {
                if (!data.exception || !data.exception.undo) return {};

                var temp = data.exception.undo;

                if (temp["1"] == 0 && temp["2"] == 0 && temp["3"] == 0) {
                    // 数量都为0时
                    return {
                        color: ['#999999'],
                        data: [
                            {value: 0, name: '无'}
                        ]
                    };
                }
                else {
                    var ringData = {
                        color: ['#e85656', '#f0a53d', '#3b89ce'],
                        data: [
                            {value: 0, name: '危急'},
                            {value: 0, name: '严重'},
                            {value: 0, name: '一般'}
                        ]
                    };
                    ringData.data[0].value = temp["1"];
                    ringData.data[1].value = temp["2"];
                    ringData.data[2].value = temp["3"];

                    return _.cloneDeep(ringData);
                }
            }
        }
    }
})();
