(function(){
  'use strict';

  angular.module('gitType.main', ['ngMaterial', 'ngMessages'])
  .controller('MainController', MainController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
  });

  HomeController.$inject = ['$scope', 'Auth', '$q', '$timeout', '$http', '$resource', 'barChart'];

  function MainController($scope, 'Auth', '$q', '$timeout', '$http', '$resource', 'barChart'){


    $scope.login = function(){
      Auth.login()
        .then(function (github) {
          $scope.github = github;
      });
    }

    $scope.logout = function(){

    }

    $scope.searchUser = function(username){

    }

    $scope.graphIt = function(){

    }

    $scope.clearGraph = function(){

    }


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
      setTimeout(function(){ getUserData(username); }, 2000);
    };
  }

})();
          
