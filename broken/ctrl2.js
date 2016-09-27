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

app.service("dataGrab", function($http){
//
  this.fetchImgur = function(url) {

    return $http({
        method: 'GET',
        url: url,
        headers: {'Authorization': 'Client-ID 55f28598b46e0fa'}
    }).then(function successCallback(response) {
        return response.data;
      });

    }, function errorCallback(response) {
        console.log("Failed to call get on " + url);
    };

this.getPages = function (count) {
  var requester = new Array(count);
  for (var i=0; i < count; i++) {
    requester[i] = this.fetchImgur("https://api.imgur.com/3/gallery/hot/viral/" + i + ".json");
  }
  return Promise.all(requester).then(function(pages) {
    return Array.prototype.concat.apply([], pages);
  });
}

});

app.controller("imgurCtrl", function($scope, dataGrab) {
    $scope.test = "This is a test";
    dataGrab.getPages(3).then(function(imgurData){
      $scope.imgurData = imgurData;
      console.log(imgurData);
    });
  });

    //console.log($scope.imgurData);
