var app = angular.module('gameApp', []);
app.factory('authService', function() {
    return {
        getCurrentUser: function() {
            return JSON.parse(localStorage.getItem('currentUser'));
        },
        getAllUsers: function() {
            return JSON.parse(localStorage.getItem('users')) || [];
        },
        saveFriends: function(friends) {
            var currentUser = this.getCurrentUser();
            if (currentUser) {
                localStorage.setItem('friends_' + currentUser.username, JSON.stringify(friends));
            }
        },
        getFriends: function() {
            var currentUser = this.getCurrentUser();
            return currentUser ? JSON.parse(localStorage.getItem('friends_' + currentUser.username)) || [] : [];
        }
    };
});
app.controller('GameController', ['$scope', 'authService', '$timeout', function($scope, authService, $timeout) {
    function startUserValues() {
        var currentUser = authService.getCurrentUser();
        $scope.username = currentUser ? currentUser.username : 'Guest';
        $scope.avatar = currentUser ? currentUser.avatar : 'icon.jpg';
        $scope.friends = authService.getFriends();
        $scope.allUsers = authService.getAllUsers();
        updateFriendRequests();
    }
    function updateFriendRequests() {
        $scope.friendRequests = $scope.allUsers.filter(user => 
            user.username !== $scope.username && 
            !$scope.friends.some(friend => friend.username === user.username)
        );
    }
    $scope.initGame = function() {
        const cardData = [
            { front: 'pok1.png', dataCard: 'pokemon1' },
            { front: 'pok2.png', dataCard: 'pokemon2' },
            { front: 'pok3.png', dataCard: 'pokemon3' },
            { front: 'pok4.png', dataCard: 'pokemon4' },
            { front: 'pok5.png', dataCard: 'pokemon5' },
            { front: 'pok6.png', dataCard: 'pokemon6' },
        ];
        $scope.cards = cardData.flatMap(card => [
            { ...card, flipped: false, matched: false },
            { ...card, flipped: false, matched: false }
        ]).sort(() => Math.random() - 0.5);
        $scope.currentPlayer = $scope.username;
        $scope.opponentPlayer = null;
        $scope.currentPlayerScore = 0;
        $scope.opponentPlayerScore = 0;
        $scope.attempts = 6;
        $scope.gameStarted = false;
        $scope.gameEnded = false;
        $scope.winner = null;
    };
    let firstCard = null;
    let preventFlip = false;
    $scope.flipCard = function(card) {
        if (preventFlip || card.flipped || card.matched || !$scope.gameStarted || $scope.attempts <= 0) return;
        card.flipped = true;
        if (!firstCard) {
            firstCard = card;
        } else {
            $scope.attempts--;
            if (firstCard.dataCard === card.dataCard) {
                card.matched = firstCard.matched = true;
                firstCard = null;
                if ($scope.currentPlayer === $scope.username) {
                    $scope.currentPlayerScore += 5;
                } else {
                    $scope.opponentPlayerScore += 5;
                }
            } else {
                preventFlip = true;
                $timeout(() => {
                    card.flipped = firstCard.flipped = false;
                    firstCard = null;
                    preventFlip = false;
                }, 1000);
            }

            if ($scope.attempts <= 0) {
                $scope.endingTurn();
            }
        }
    };
    $scope.startGame = function(opponent) {
        $scope.opponentPlayer = opponent.username;
        $scope.gameStarted = true;
        $scope.currentPlayer = $scope.username;
        $scope.giveMessage($scope.currentPlayer + "'s turn");
    };
     $scope.endingTurn = function() {
        let message = $scope.currentPlayer + "'s turn ended. Score: " + 
            ($scope.currentPlayer === $scope.username ? $scope.currentPlayerScore : $scope.opponentPlayerScore);
        $scope.giveMessage(message);
        $timeout(() => {
            if ($scope.currentPlayer === $scope.username) {
                $scope.currentPlayer = $scope.opponentPlayer;
                $scope.attempts = 6;
                $scope.cards.forEach(card => {
                    card.flipped = false;
                    card.matched = false;
                });
                $scope.cards.sort(() => Math.random() - 0.5);
                $scope.giveMessage($scope.currentPlayer + "'s turn");
            } else {
                $scope.endGame();
            }
        }, 2000);
    };
     $scope.endGame = function() {
        $scope.gameEnded = true;
        if ($scope.currentPlayerScore > $scope.opponentPlayerScore) {
            $scope.winner = $scope.username;
        } else if ($scope.currentPlayerScore < $scope.opponentPlayerScore) {
            $scope.winner = $scope.opponentPlayer;
        } else {
            $scope.winner = "It's a tie!";
        }
        $scope.giveMessage("Game Over! " + $scope.winner + " wins!");
    };
 $scope.giveMessage = function(message) {
        $scope.gameMessage = message;
    };
    $scope.addFriend = function(request) {
        $scope.friends.push(request);
        authService.saveFriends($scope.friends);
        updateFriendRequests();
    };
     $scope.removeFriend = function(friend) {
        $scope.friends = $scope.friends.filter(f => f.username !== friend.username);
        authService.saveFriends($scope.friends);
        updateFriendRequests();
        $scope.$apply();
    };

    $scope.showFriendCube = function(friend) {
        $scope.initGame();
        $scope.startGame(friend);
    };
    $scope.Logout = function() {
        $timeout(() => {
            window.location.href = "index.html";
        }, 1000);
    };
    startUserValues();
    $scope.initGame();
}]);