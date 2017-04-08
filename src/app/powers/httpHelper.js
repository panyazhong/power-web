(function () {
    'use strict';

    angular.module('HttpHelper', ['DataCache'])
        .factory("ClientimgHelper", clientimgHelper);

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

})();
