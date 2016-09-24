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



app.controller("imgurCtrl", function($scope, $http) {
    $scope.test = "This is a test";
    $scope.page = 0;
    $scope.url = "https://api.imgur.com/3/gallery/hot/viral/" + $scope.page + ".json";
    $scope.imgurData = [];

    $http({
        method: 'GET',
        url: $scope.url
        }).then(function successCallback(response) {
            console.log("Successfully called get on " + $scope.url);
            $scope.imgurData = response.data.data;
            //console.log(response.statusText);
            console.log($scope.imgurData);
            //console.log(response.data);
            //console.log(response.status);
            //console.log(response.headers);
            //console.log(response.config);
        }, function errorCallback(response) {
            console.log("Failed to call get on " + $scope.url);
            //console.log(response.statusText);
    });

    $scope.getPages = function() {
        for( i = 0 ; i < 100 ; i++){
            $scope.url = "https://api.imgur.com/3/gallery/hot/viral/" + i + ".json";
            $http({
                method: 'GET',
                url: $scope.url
            }).then(function successCallback(response) {
                console.log("Successfully called get on " + $scope.url);
                $scope.imgurData += response.data;
                //console.log(response.statusText);
                console.log($scope.imgurData.data);
                //console.log(response.data);
                //console.log(response.status);
                //console.log(response.headers);
                //console.log(response.config);
            }, function errorCallback(response) {
                console.log("Failed to call get on " + $scope.url);
                //console.log(response.statusText);
            });
        }

    };

});
