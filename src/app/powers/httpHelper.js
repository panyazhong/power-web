(function () {
    'use strict';

    angular.module('HttpHelper', ['DataCache'])
        .factory("ClientimgHelper", clientimgHelper)
        .factory("BranchimgHelper", branchimgHelper)
        .factory("DeviceHelper", deviceHelper)
        .factory("UserHelper", userHelper)
        .factory("reportHelper", reportHelper)
        .factory("setalarmHelper", setalarmHelper)
        .factory("excepNumHelper", excepNumHelper)
        .factory("deviceAttrHelper", deviceAttrHelper)
        .factory("lineTitlePieHelper", lineTitlePieHelper)
        .factory("lineChartHelper", lineChartHelper)
        .factory("lineMaxDataHelper", lineMaxDataHelper)
        .factory("lineMaxEleHelper", lineMaxEleHelper)
        .factory("clientSvg", clientSvg)   //变电站svg信息
        .factory("dayHelper", dayHelper)   //Fuhe demo
        .factory("monthHelper", monthHelper)
        .factory("barHelper", barHelper)
        .factory("pieHelper", pieHelper)
        .factory("pieHelper1", pieHelper1)
        .factory("stackHelper", stackHelper);

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

    function deviceAttrHelper(_) {
        return {
            create: function (data) {
                if (!data || !data.length) return;

                data.map(function (item) {
                    item.val = '';  // form val
                    if (item.type == "RAD") {
                        // 说明是下拉框
                        item.click = function (str) {
                            this.val = str;
                        }
                    }
                });

                return _.cloneDeep(data);
            }
        }
    }

    function lineTitlePieHelper(_) {
        return {
            create: function (data) {
                if (!data || !data.length) return;

                var titleData = [];
                var loadPieData = [];
                var demandPieData = [];

                data.map(function (t, pos) {
                    // title
                    titleData.push({
                        active: pos == 0 ? true : false,
                        id: t.id,
                        name: t.name
                    });
                    // loadPie
                    loadPieData.push({
                        current: 0,
                        total: t.load,
                        id: t.id
                    });
                    // demandPie
                    demandPieData.push({
                        current: 0,
                        total: t.demand,
                        id: t.id
                    });
                });

                return {
                    titleData: _.cloneDeep(titleData),
                    loadPieData: _.cloneDeep(loadPieData),
                    demandPieData: _.cloneDeep(demandPieData)
                }
            }
        }
    }

    function lineChartHelper(_) {
        return {
            create: function (data, type, lineTitle) {  //这里做了数据转换，转成能用的格式，ineChart的
                if (!data) return;
                if (!data.timeData || !data.timeData.length) return;
                if (!data.yesdayData) return;   // 今日，昨日 可能[]，不能判断长度
                if (!data.todayData) return;

                // type区分
                var t = type == 'Load' ? '负荷' : '需量';

                var lineData = {};
                lineData["title"] = lineTitle + '日' + t + '曲线';
                lineData["unit"] = t + ' kW';
                lineData["lineTitle"] = ['今日' + t, '昨日' + t];
                lineData["timeData"] = data.timeData;
                lineData["yesdayData"] = data.yesdayData;
                lineData["todayData"] = data.todayData;
                return _.cloneDeep(lineData);
            }
        }
    }

    function lineMaxDataHelper(_) {
        return {
            create: function (data, type) {
                if (!data || !data.length) return;

                // type区分
                var t = type == 'Load' ? '负荷' : '需量';
                var listTitle = ['今日最大', '昨日最大', '本月最大', '上月最大', '本年最大'];

                data.map(function (item, pos) {
                    item["val"] = item.val + 'kW';
                    item["title"] = listTitle[pos] + t;
                });

                return _.cloneDeep(data);
            }
        }
    }

    function lineMaxEleHelper(_) {
        return {
            create: function (data) {
                if (!data || !data.length) return;

                var listTitle = ['今日累计电量', '昨日累计电量', '本月累计电量', '上月累计电量', '本年累计电量'];

                data.map(function (item, pos) {
                    item["val"] = item.val + 'KW.h';
                    item["title"] = listTitle[pos];
                });

                return _.cloneDeep(data);
            }
        }
    }

    function clientSvg(_, ImgPrefix) {
        return {
            create: function (data) {
                if (!data) return;

                // data.templateUrl = ImgPrefix.prefix + data.templateUrl;
                // data.templateUrl = "app/powers/temp/template.html";
                // data.templateUrl = "app/powers/temp/mjTemp.html";
                // data.templateUrl = "app/powers/temp/mjoneTemp.html";

                return _.cloneDeep(data);
            }
        }
    }

    //折线图（1条）
    function dayHelper() {
        return {
            create: function (data) {
                if (!data) return;

                //这里拿到后台返回的数据，看要转成啥格式。
                var resData = {
                    title: "",
                    unit: "",
                    lineTitle: [],
                    timeData: [],   // x轴data
                    todayData: []   // y轴data 如果只有一个线，设置一个data就行
                };

                resData['timeData'] = data['chart']['x'];
                resData['todayData'] = data['chart']['y'];

                // console.log('fuhe 转换后: \n'+JSON.stringify(resData))//这个是返回的数据
                //看 输出没问题 return 回去就好了

                return resData;
            }
        }
    }

    //折线图（3条）
    function monthHelper() {
        return {
            create: function (data) {
                if (!data) return;

                //这里拿到后台返回的数据，看要转成啥格式。
                var resData = {
                    title: "",
                    unit: "",
                    lineTitle: ['最大值', '最小值', '平均值'],
                    timeData: [],   // x轴data
                    maxdata: [],   // y轴data 如果只有一个线，设置一个data就行
                    mindata: [],
                    avgdata: [],
                };

                resData['timeData'] = data['chart']['x'];
                resData['maxdata'] = data['chart']['max'];
                resData['mindata'] = data['chart']['min'];
                resData['avgdata'] = data['chart']['avg'];

                // console.log('fuhe 转换后: \n'+JSON.stringify(resData))//这个是返回的数据

                return resData;
            }
        }
    }

    //柱状图
    function barHelper() {
        return {
            create: function (data) {
                if (!data) return;
                //这里拿到后台返回的数据，看要转成啥格式。
                var resData = {
                    xAxisData: [],   // x轴data
                    data: [{
                        type: "电量",
                        stack: "电量",
                        value: []
                    }]
                };

                resData['xAxisData'] = data['chart']['x'];
                resData['data'][0]['value'] = data['chart']['y'];


                // console.log('fuhe 转换后: \n'+JSON.stringify(resData))//这个是返回的数据

                return resData;
            }
        }
    }

    //饼图
    function pieHelper() {
        return {
            create: function (data) {
                if (!data) return;
                var lineTitle =[]
                data.map(function (item) {
                    lineTitle.push(item.name);
                });
                // console.log(lineTitle)
                var resData = {
                    color: '',
                    data: []
                };
                function randomColor(n) {
                    var color=[]
                    for(var i=0;i<n;i++){
                       color.push('#' + ( (Math.random() * 0x1000000 << 0).toString(16)));
                    }
                    return color
                }
                resData.data = data;
                resData.color = randomColor(data.length);
                resData['lineTitle'] = lineTitle;

                console.log('dianliang 转换后: \n' + JSON.stringify(resData))//这个是返回的数据
                // console.log(resData.color)//这个是返回的数据
                // console.log(data)//这个是返回的数据

                return resData;
            }
        }
    }

    function pieHelper1() {
        return {
            create: function (data) {
                if (!data) return;
                var resData = {
                    color: ['#ff6060', '#5c5c61'],
                    data: []
                };
                resData.data = data;

                // console.log('fenshi 转换后: \n'+JSON.stringify(resData))//这个是返回的数据

                return resData;
            }
        }
    }


    //柱状堆积
    function stackHelper() {
        return {
            create: function (data) {
                if (!data) return;
                //这里拿到后台返回的数据，看要转成啥格式。
                var resData = {
                    xAxisData: [],   // x轴data
                    data: []
                };

                resData['xAxisData'] = data['x'];
                resData['data'] = data['list'];


                // console.log('fuhe 转换后: \n'+JSON.stringify(resData))//这个是返回的数据
                return resData;
            }
        }
    }

})();
