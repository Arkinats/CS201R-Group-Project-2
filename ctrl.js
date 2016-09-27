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
    $scope.users = [{name: "Anonymous", count: 0, show: false, downs: 0, ups: 0, commentCount: 0, gotPosts: false, posts: [], imgData: [], repostCount: "n/a"}];
                    // name:  imgur user URL (username)
                    // count:  Number of posts
                    // show:  Whether or not to show additional information
                    // downs:  total down votes
                    // ups:  total up votes
                    // commentCount
                    // gotPosts:  wether or not we have parsed the posts[] to determin if links are images or albums
                    // imgData:  post parse of posts[] showing imgs and album imgs
                    // repostCount: count of number of self reposts
    $scope.imgurData = [];          // [] of objects containing data from multiple imgur GET requests
    $scope.totalCount = 0;          // total post count from all users
    $scope.setupPages = 10;         // number of pages to parse
    $scope.setupUsers = 10;         // number of users to show post GET
    $scope.showSetup = true;        // show the setup DIV, hide after button press and getPages() is called
    $scope.showResults = false;     // hide the results DIV until after button press and getPages() is called
    $scope.toggle = function(x) {
        if(!x.gotPosts) {
            x.gotPosts = true;
            x.repostCount = 0;
            console.log("Getting images for: " + x.name + ", posts: " + x.posts);
            // ---------------------------------------------------------------------------------------------------
            // - Peform a for loop to check the links in x.posts
            // - Need to check if the link is http://imgur.com/a/xxxxx (album) or http://i.imgur.com/xxxxx.xxx (direct file link)
            // - If the link is a direct file link, push to x.imgData
            // - If the link is an album, perform an additional GET on the albumID and push each to x.imgData
            // - May also be able to determine if the link is a duplicate, as this would be an interesting number
            // ---------------------------------------------------------------------------------------------------
            for(var i = 0; i < x.posts.length; i++) {
                //console.log("Start posts[" + i + "] examination for " + x.posts[i]);
                if(x.posts[i].startsWith("http://i.imgur.com/")) { // Check if the post is a direct file link
                    // Check in the most inefficient way if the image already exists in imgData[]
                    var exists = false;
                    for(var j = 0; j < x.imgData.length; j++) {
                        console.log("Checking through imgdata[] for a repost.  Status: " + x.posts[i] === x.imgData[j]);
                        if(x.posts[i] === x.imgData[j]) {
                            exists = true;
                            console.log("imcrement repostCount");
                            x.repostCount++;
                        }
                    }
                    if(!exists) {
                        //console.log("imgData.push(" + x.posts[i] + ")");
                        x.imgData.push(x.posts[i]);
                    }
                } else { // Post is an album, loop through it and pull album images[]
                    var albumID = x.posts[i].split("/a/");
                    //console.log(albumID);
                    var albumUrl = "https://api.imgur.com/3/album/" + albumID[1];
                    
                    $http({
                        headers: {'Authorization': 'Client-ID 55f28598b46e0fa'},
                        method: 'GET',
                        url: albumUrl
                    }).then(function successCallback(response) {
                        //console.log(response.data.data.images);
                        $scope.imgs = [];
                        angular.extend($scope.imgs, response.data.data.images);
                        //console.log($scope.imgs);
                        for(var i = 0; i < $scope.imgs.length; i++) {
                            console.log("Start imgs[" + i + "] examination for " + $scope.imgs[i].link);
                            // Check in the most inefficient way if the image already exists in imgData[]
                            var exists = false;
                            for(var j = 0; j < x.imgData.length; j++) {
                                //console.log("Checking through imgdata[] for a repost.  Status: " + $scope.imgs[i].link === x.imgData[j]);
                                if($scope.imgs[i].link === x.imgData[j]) {
                                    exists = true;
                                    console.log("imcrement repostCount");
                                    x.repostCount++;
                                }
                            }
                            if(!exists) {
                                console.log("imgData.push(" + $scope.imgs[i].link + ")");
                                x.imgData.push($scope.imgs[i].link);
                            }
                        }
                    }, function errorCallback(response) {
                        console.log("Failed to get https://api.imgur.com/3/album/" + x.posts[0]);
                        console.log("Response: " + response);
                    });
                }
                    
            }
        }
        if(x.show === true) {
            x.show = false;
        } else {
            x.show = true;
        }
    };
    $scope.getPages = function() {
        $scope.showSetup = false;
        $scope.showResults = true;
        // ---------------------------------------------------------------------------------------------------
        // - Loop through the no. of pages requested, pull data from imgur and pull requested stats and push
        // - into $scope.users[{}]
        // ---------------------------------------------------------------------------------------------------
        for(var i = 0; i < $scope.setupPages; i++) {
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
                    if($scope.imgurData[j].account_url === null) { // Check to see if the username is null and if so, increment null's count & add data
                        $scope.users[0].count++;
                        $scope.users[0].downs += $scope.imgurData[j].downs;
                        $scope.users[0].ups += $scope.imgurData[j].ups;
                        $scope.users[0].commentCount += $scope.imgurData[j].comment_count;
                        //console.log($scope.imgurData[j].link);
                        $scope.users[0].posts.push($scope.imgurData[j].link);
                        //console.log($scope.imgurData[j].posts);
                        //angular.extend($scope.users[0].posts, $scope.imgurData[j].link);
                    } else { // Username is not null, so check to see if the username exists in users[]
                        var exists = false;
                        for(var k = 1; k < $scope.users.length; k++) {
                            if($scope.imgurData[j].account_url === $scope.users[k].name) {
                                // User already exists in the list, increment post count and details
                                $scope.users[k].count++;
                                $scope.users[k].downs += $scope.imgurData[j].downs;
                                $scope.users[k].ups += $scope.imgurData[j].ups;
                                $scope.users[k].commentCount += $scope.imgurData[j].comment_count;
                                $scope.users[k].posts.push($scope.imgurData[j].link);
                                //console.log($scope.users[k].posts)
                                exists = true;
                                // Increment the total count
                                $scope.totalCount++;
                            }
                        }
                        if(!exists) {
                            // The username does not exist, so create the user and push to users[]
                            var newUser = {name: $scope.imgurData[j].account_url, count: 1, show: false, downs: 0, ups: 0, commentCount: 0, gotPosts: false, posts: [], imgData: [], repostCount: "n/a"}
                                newUser.downs += $scope.imgurData[j].downs;
                                newUser.ups += $scope.imgurData[j].ups;
                                newUser.commentCount += $scope.imgurData[j].comment_count;
                                newUser.posts.push($scope.imgurData[j].link);
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