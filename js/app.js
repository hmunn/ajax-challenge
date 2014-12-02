"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('ajax-challenge', ['ui.bootstrap'])
	.config(function($httpProvider){
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'ncEMNcP8nMvXaTusEAlDqXcUPBlSEEsRV8CixvBz';
		$httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'vR77hB6GCF1oRC6Zu0whDOqEfcyk3KPmPiwmjjfB';
	})
	.controller('CommentsController', function($scope, $http){
		$scope.refreshComments = function(){
			$http.get(commentsUrl + "?order=-score")
				.success(function (data){
					$scope.comments = data.results;
				});
		};

		$scope.refreshComments();

		$scope.newComment = {score: 0};

  		$scope.addComment = function(){
  			$scope.inserting = true;
  			$http.post(commentsUrl, $scope.newComment)
  				.success(function(responseData){
  					$scope.newComment.objectId = responseData.objectId;
  					$scope.comments.push($scope.newComment);
  					$scope.newComment = {score: 0};
  				})
  				.error(function(e){
  					console.log(e);
  				})
  				.finally(function(){
  					$scope.inserting = false;
  				});
  		};

        $scope.incrementVotes = function(comment, value){
        	if (comment.score + value >= 0) {
                $scope.updating = true;
                var postData = {
                    score: {
                        __op: 'Increment',
                        amount: value
                    }
                };

                $http.put(commentsUrl + '/' + comment.objectId, postData)
                    .success(function(respData) {
                        comment.score = respData.score;
                    })
                    .error(function(e) {
                        console.log(e);
                    })
                    .finally(function() {
                        $scope.updating = false;
                    });
            }
        };

        $scope.delete = function(comment) {
            $scope.updating = true;
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function() {
                    $scope.refreshComments();
                })
                .error(function(e) {
                    console.log(e);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
	});