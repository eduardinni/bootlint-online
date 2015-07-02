var bootlintApp = angular.module('bootlintApp', [], function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
bootlintApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.post = {'Accept':'application/json', 'Content-Type':'application/json'};
}]);

bootlintApp.controller('bootlintCtrl', function ($scope, $http, $location) {
  $scope.bootlintByURLForm = {};
  $scope.bootlintByDIForm = {};
  $scope.patternUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
  $scope.errorMsg = null;
  $scope.showNoLintsMsg = false;
  $scope.showURLErrors = false;
  $scope.showDIErrors = false;
  $scope.showGenErrors = false;
    
  $scope.runBootlint = function(checkby, data) {
    $scope.loading = true;
    $scope.errorMsg = null;
    $scope.showNoLintsMsg = false;
    $scope.lints = [];
            
    var bootlintUrl = 'http://localhost:7070/check';
    $http.post(bootlintUrl, {checkby: checkby, data: data})
      .success(function(data) {
        $scope.loading = false;
        $scope.lints = data.lints;
        if(data.error != null) {
          $scope.errorMsg = data.error;
        }
        else if(data.lints.length == 0) {
          $scope.showNoLintsMsg = true;
        }
      })
      .error(function(data) {
        $scope.loading = false;
        $scope.errorMsg = "there is a problem with the API, please check again later.";
      });
  }
  
  if($location.search().url) {
    $scope.urlToCheck = $location.search().url;
    if($scope.patternUrl.test($scope.urlToCheck))
      $scope.runBootlintByURL('url', $scope.urlToCheck);
    else
      $scope.errorMsg = "the URL are not valid.";
  }
});