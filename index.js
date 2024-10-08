var app = angular.module('loginApp', []);

app.factory('authService', function() {
  var users = JSON.parse(localStorage.getItem('users')) || [];

  return {
    signup: function(username, password) {
      if (users.some(user => user.username === username)) {
        return { success: false, message: 'User already exists' };
      }
      alert("Account Created Successfully");
      users.push({ username: username, password: password });
      localStorage.setItem('users', JSON.stringify(users)); 
      return { success: true };
    },
    login: function(username, password) {
      var user = users.find(user => user.username === username && user.password === password);
      return user ? { success: true, user: user } : { success: false, message: 'Invalid username or password' };
    },
    getCurrentUser: function() {
      return JSON.parse(localStorage.getItem('currentUser'));
    },
    setCurrentUser: function(user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); 
    },
    logout: function() {
      localStorage.removeItem('currentUser'); 
    }
  };
});

app.controller('myController', function($scope, authService,$timeout) {
  $scope.currentPage = 'login';
  $scope.loginData = {};
  $scope.signupData = {};
  $scope.user = null;
  $scope.loginError = '';
  $scope.signupError = '';

  $scope.login = function() {
    var result = authService.login($scope.loginData.username, $scope.loginData.password);
    if (result.success) {
      authService.setCurrentUser(result.user); 
      $timeout(function(){
        window.location.href = "gamepage.html"; 
      },1000)

     
    } else {
      $scope.loginError = result.message;
    }
  };
  $scope.guest=function(){
    window.location.href="guest.html";
  }
  $scope.signup = function() {
    var result = authService.signup($scope.signupData.username, $scope.signupData.password);
     if (result.success) {
      $scope.switchPage('login');
      $scope.signupData = {}; 
      $scope.signupError = '';
    } else {
      $scope.signupError = result.message;
    }
   
  };
  $scope.switchPage = function(page) {
    $scope.currentPage = page;
    $scope.loginError = ''; 
    $scope.signupError = ''; 
  };
});
