(function(){
  'use strict';

  angular.module('gitType.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
  });

  HomeController.$inject = ['$scope', 'Auth', '$q', '$timeout', '$http', '$resource', 'dateFormat', 'barChart'];

  function HomeController($scope, Auth, $q, $timeout, $http, $resource, dateFormat, barChart){
    $scope.github = {};
    $scope.currentUser = {};
    $scope.numUsers = 0;
    $scope.gitName = $scope.gitName;
    $scope.totalEvents = [];
    $scope.userData = [];
    $scope.tableFuncCalled = false;
    $scope.contribChartCalled = false;

    $scope.login = function(){
      Auth.login()
        .then(function (github) {
          $scope.github = github;
      });
    }

    

    // 
    // 
    // David's quick access play area to test different functions
    // 
    // 

    $scope.makeBarChart = function(){
      var data = $scope.totalEvents;
      barChart.makeBarChart(data);
      $scope.contribChartCalled = true;
    };

    $scope.resetContribChart = function(){
      $scope.totalEvents = [];
      $scope.tableFuncCalled = false;
      $scope.contribChartCalled = false;
    };

    $scope.getUserContributionData = function(username){
      var username = $scope.gitName;
      if($scope.gitName === undefined){ return; }


      function getEventsData (username) {
        var allEventData = [];
        // Github API endpoint for a user's events
        var Events = $resource('https://api.github.com/users/:username/events?page=:number')
        // Start on page 1
        var num = 1;
        // recursive subroutine for traversing the paginated results
        var pageTraverse = function(num){
          return Events.query({username: username, number: num, access_token: Auth.getToken()}, function(data){
            // base case
            // since pages can be up to 30 items in length, if the page has fewer than 30, it's the last page
            if(data.length < 30){
              data.forEach(function(singleEvent){
                allEventData.push(singleEvent);
              });
              $scope.gitName = "";
              $scope.totalEvents.push(dateFormat.processContributionData(allEventData, username));
              // if contribChart has already been rendered, re-render it with new data
              $scope.tableFuncCalled = true;
              $scope.totalEvents[length].loaded = true;
              if($scope.contribChartCalled){ 
                $scope.makeBarChart(); 
              }
              return;
            }
            // increase num to move to the next page
            num ++;
            data.forEach(function(singleEvent){
              allEventData.push(singleEvent);
            })
            // recurse
            pageTraverse(num);
          })
        };
        pageTraverse(num);
      };
      getEventsData(username);

      function getUserData (username) {
        var Events = $resource('https://api.github.com/users/:username')
        Events.get({username: username, access_token: Auth.getToken()}, function(data){
          var length = $scope.totalEvents.length - 1;
          $scope.totalEvents[length].email = data.email;
          $scope.totalEvents[length].link = data.html_url;
          $scope.tableFuncCalled = true;
          $scope.totalEvents[length].loaded = true;

        })
      }
      // setTimeout(function(){ getUserData(username); }, 2000);
    };

    // As mentioned in the html, this should be able to add a user to a list of favorites, but not sure how to do that yet.
    $scope.addToFavorites = function(username){
    }

    $scope.basicReset = function(){
      // currently clears out both pie charts, if I clear out the lineGraph, then it won't come back up again.
      $scope.loaded = false;
      Chart.reset()

    };

    // End of David's Play Area

  }  
})();
          
