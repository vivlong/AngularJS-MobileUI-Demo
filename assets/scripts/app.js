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
        .when('/test1',{
            templateUrl: 'views/test1.html',
            controller: 'pvCtl',
            reloadOnSearch: false
        })
        .when('/test2',{
            templateUrl: 'views/test2.html',
            controller: 'pvCtl',
            reloadOnSearch: false
        })
        .when('/test3',{
            templateUrl: 'views/test3.html',
            controller: 'pvCtl',
            reloadOnSearch: false
        })
        .when('/test4',{
            templateUrl: 'views/test4.html',
            controller: 'pvCtl',
            reloadOnSearch: false
        })
        .when('/test5',{
            templateUrl: 'views/test5.html',
            controller: 'pvCtl',
            reloadOnSearch: false
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);// remove URL dafault path /#/
}]);
