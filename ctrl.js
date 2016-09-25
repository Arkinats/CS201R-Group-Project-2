/*
(function($){
var albumID = 'NNbeO';
var albumAPI = "https://api.imgur.com/3/album/" + albumID + "/images";

  $.ajax({
      url: albumAPI,
      headers:{
          'Authorization':'Client-ID xxxxxxxxxxxxx'
      },
      type: 'GET',
      dataType: 'json',
      success: function(data) { 

          alert(data.data[0].link);

      },
      error: function() { console.log("ERRORZ"); }
  });

})(jQuery);

https://api.imgur.com/3/gallery/hot/viral/0.json
*/



app.service('dataGrab', function($http, $q) {
    this.getPage = function (url) {
        console.log("Called: getPage(" + url + ")");
        $http({
            headers: {'Authorization': 'Client-ID 55f28598b46e0fa'},
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log("Successfully called " + url);
            return response.data.data;
            
            //console.log(pageData);
        }, function errorCallback(response) {
            console.log("Failed to call get on " + url);
        });
    }
});




app.controller("imgurCtrl", function($scope, $http, dataGrab) {
    $scope.test = "This is a test";
    $scope.page = 0;
    $scope.url = "https://api.imgur.com/3/gallery/hot/viral/" + $scope.page + ".json";
    $scope.users = [{name: "Anonymous", count: 0, show: false, downs: 0, ups: 0, commentCount: 0}];
    //$scope.imgurData = [dataGrab.getPage($scope.url)];
    $scope.imgurData = [];
    $scope.totalCount = 0;
    $scope.pages = 10;
    $scope.showSetup = true;
    $scope.showResults = false;
    $scope.getPages = function() {
        $scope.showSetup = false;
        $scope.showResults = true;
        $scope.toggle = function(x) {
            if(x.show === true) {
                x.show = false;
            } else {
                x.show = true;
            }
        };
        for(var i = 0; i < $scope.pages; i++) {
            var url = "https://api.imgur.com/3/gallery/hot/viral/" + i + ".json";
            $http({
                headers: {'Authorization': 'Client-ID 55f28598b46e0fa'},
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                //console.log(response.data.data);
                $scope.imgurData = angular.extend($scope.imgurData, response.data.data);
                // Once the response is received, go through each item in response
                for(var j = 0; j < $scope.imgurData.length; j++) {
                    //console.log($scope.imgurData[j].account_url)
                    if($scope.imgurData[j].account_url === null) { // Check to see if the username is null and if so, increment null's count
                        $scope.users[0].count++;
                        $scope.users[0].downs += $scope.imgurData[j].downs;
                        $scope.users[0].ups += $scope.imgurData[j].ups;
                        $scope.users[0].commentCount += $scope.imgurData[j].comment_count;
                    } else { // Username is not null, so check to see if the username exists in users[]
                        var exists = false;
                        for(var k = 1; k < $scope.users.length; k++) {
                            if($scope.imgurData[j].account_url === $scope.users[k].name) {
                                // User already exists in the list, increment post count and details
                                $scope.users[k].count++;
                                $scope.users[k].downs += $scope.imgurData[j].downs;
                                $scope.users[k].ups += $scope.imgurData[j].ups;
                                $scope.users[k].commentCount += $scope.imgurData[j].comment_count;
                                exists = true;
                                // Increment the total count
                                $scope.totalCount++;
                            }
                        }
                        if(!exists) {
                            // The username does not exist, so create the user and push to users[]
                            var newUser = {name: $scope.imgurData[j].account_url, count: 1, show: false, downs: 0, ups: 0, commentCount: 0}
                            $scope.users.push(newUser);
                            // Increment the total count
                            $scope.totalCount++;
                        }
                    }
                }
                //console.log($scope.imgurData);
            }, function errorCallback(response) {
                console.log("Failed to call get on " + url);
            });
        }
    }
    
    //console.log($scope.imgurData);
});