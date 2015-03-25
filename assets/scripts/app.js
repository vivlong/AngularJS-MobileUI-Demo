var app = angular.module('SysApp', [
  'ngRoute',,
  'ngAnimate',
  'ngTouch',
  'mobile-angular-ui',
  'ui.grid',
  'ui.grid.pagination',
  'ui.grid.selection',
  'ui.grid.cellNav'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/',{
            templateUrl: 'views/login.html',
            controller: 'loginCtl',
            reloadOnSearch: false
        })
        .when('/main',{
            templateUrl: 'views/main.html',
            controller: 'mainCtl',
            reloadOnSearch: false
        })
        .when('/pv',{
            templateUrl: 'views/pv.html',
            controller: 'pvCtl',
            reloadOnSearch: false
        })
        .when('/echartsBar',{
            templateUrl: 'views/echartsBar.html',
            controller: 'echartsBarCtl',
            reloadOnSearch: false
        })
        .when('/echartsPie',{
            templateUrl: 'views/echartsPie.html',
            controller: 'echartsPieCtl',
            reloadOnSearch: false
        })
        .when('/echartsMap',{
            templateUrl: 'views/echartsMap.html',
            controller: 'echartsMapCtl',
            reloadOnSearch: false
        })
        .when('/echartsRadar',{
            templateUrl: 'views/echartsRadar.html',
            controller: 'echartsRadarCtl',
            reloadOnSearch: false
        })
        .when('/echartsLine',{
            templateUrl: 'views/echartsLine.html',
            controller: 'echartsLineCtl',
            reloadOnSearch: false
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);// remove URL dafault path /#/
}]);
