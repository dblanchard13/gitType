angular.module('gitType', [
  'gitType.main', 
  'ngRoute', 
  'ngResource', 
  'gitType.dataFormat'
  ])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'client/views/main.html',
      controller: 'MainController'
    })
    .otherwise({
      redirectTo: '/'
    });
});