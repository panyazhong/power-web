(function(){
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('testDirective',testDirective)
    
    function testDirective($window) {
        return {
            restrict: 'EA',
            template:"<h1>标题</h1><p>这里是段落文字</p>",
            link: function (scope,element,attrs){
                console.log($window)
                console.log(scope)
                console.log(element.children())
                console.log(attrs)
            }
        }
    }
})()