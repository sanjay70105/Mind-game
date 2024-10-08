angular.module('GuestApp', [])
      .controller('GuestController', ['$scope', '$timeout', function($scope, $timeout) {
       
        const cardDatas = [
        { front: 'pok1.png', dataCard: 'pokemon1' },
        { front: 'pok2.png', dataCard: 'pokemon2' },
        { front: 'pok3.png', dataCard: 'pokemon3' },
        { front: 'pok4.png', dataCard: 'pokemon4' },
        { front: 'pok5.png', dataCard: 'pokemon5' },
        { front: 'pok6.png', dataCard: 'pokemon6' },
    ];
       
        $scope.cards = cardDatas.flatMap(cardData => [
          { ...cardData, flipped: false, matched: false },
          { ...cardData, flipped: false, matched: false }
        ]);
      
        $scope.cards = $scope.cards.sort(() => 0.5 - Math.random());
      
        $scope.attempts = 6;
        $scope.score = 0;
      
        let firstCard = null;
        let preventFlip = false;
   
        $scope.flipCard = function(card) {
          if (preventFlip || card.flipped || card.matched) return;
          card.flipped = true;
          if (!firstCard) {
            firstCard = card; 
          } else {
            
            if (firstCard.dataCard === card.dataCard) {
              card.matched = true;
              firstCard.matched = true;
              $scope.score += 5;
              firstCard = null;
            } else {
              preventFlip = true;
              $scope.attempts--;
              if ($scope.attempts === 0) {
                alert("Game Over! Your score is " + $scope.score);
                $scope.attempts = 6;
                $scope.score = 0;
                $scope.cards.forEach(card => {
                  card.flipped = false;
                  card.matched = false;
                });
                $scope.cards = $scope.cards.sort(() => 0.5 - Math.random());
              }
              $timeout(function() {
                card.flipped = false;
                firstCard.flipped = false;
                firstCard = null;
                preventFlip = false;
              }, 1000);
            }
          }
        };
        $scope.logout=function(){
            $timeout(function(){
                window.location.href="index.html";
        },1000);
        }
      }]);