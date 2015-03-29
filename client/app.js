angular.module('gitType', [])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'client/views/main.html',
      controller: 'mainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});