angular.module('gitType', [
  'gitType.home',
  'ngRoute',
  'ngResource',
  'gitType.auth',
  'gitType.dateFormat',
  'gitType.barChart',
  'firebase'
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/scripts/home/home.html',
      controller: 'HomeController'
    })
    .otherwise({
      redirectTo: '/'
    });
});