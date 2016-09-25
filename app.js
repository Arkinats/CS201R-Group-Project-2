var app = angular.module("imgurApp", [])

.factory("loadSleep", function($timeout) {
    return function(ms) {
        return function(value) {
            return $timeout(function() {
                return value;
            }, ms);
        };
    };
});