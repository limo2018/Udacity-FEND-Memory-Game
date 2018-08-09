/*
 * Create a list that holds all of your cards
 */

 const cards =  ['fa-diamond','fa-diamond','fa-paper-plane-o','fa-paper-plane-o','fa-anchor','fa-anchor','fa-bolt','fa-bolt','fa-cube','fa-cube','fa-bomb','fa-bomb','fa-bicycle','fa-bicycle','fa-leaf','fa-leaf'];

 let cardGame = new CardGame(cards, 15);
 cardGame.start();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

  function CardGame(cards, maxMoves){
   this.cards = cards;
   this.maxMoves = maxMoves;
   this.starFactor = 5;
   this.displayCards = [];
   this.matchedCards = [];
   this.moves = 0;
   this.initalized = false;
   this.lastSelectedCard = null;

   this.startTime = null;

   this.gameContainer = document.querySelector(".deck");
   this.startsContainer = document.querySelector(".stars");

this.updateStars = function() {
     let game = this;
     this.startsContainer.querySelectorAll('li')
          .forEach(function(li){
               game.startsContainer.removeChild(li);
          });
     let rate = Math.round(this.moves/this.starFactor);
     for(i = 0; i < rate; i++) {
       let li = document.createElement('li');
       let ie = document.createElement('i');
       ie.classList.add('fa', 'fa-star');
       li.appendChild(ie);
       this.startsContainer.appendChild(li);
     }
     let moveElem = document.querySelector(".moves");
     moveElem.innerHTML = this.moves;
   };

   this.isCardVisible = function(card) {
     return card.classList.contains("show");
   }

   this.getCardName = function(card) {
     let index = parseInt(card.getAttribute('id'));
     let card_name = this.displayCards[index];
     return card_name;
   }

   this.setCardMatch = function(card, card_name, match) {
       if (!match) {
         card.classList.remove('open', 'show');
         const index = this.matchedCards.indexOf(card_name);
         if(index > -1) {
           this.matchedCards.splice(index, 1);
         }
       }
       else {
          card.classList.add('open', 'show');
        if(this.matchedCards.indexOf(card_name) < 0) {
             this.matchedCards.push(card_name);
          }
       }
   }

   this.confirmRestartGame = function(msg) {
     if (confirm(msg +' Click \'OK\' to start a new game; click \'Cancel\' to restart the current game.')) {
   this.start();
} else {
   this.reset();
}
   }

   this.completeGame = function(){
                 var diff = (new Date() - this.startTime) / 1000;
                 diff = Math.round(diff);
                 if (confirm("Congratulations, you won the game!"
                   + "\nTime : " + diff + " seconds"
                   + "\nUnmatched Moves : " + (this.maxMoves-this.moves)
                   + "\nStars : " +  Math.round(this.moves/this.starFactor)
                   + "\nDo you want to start a new one?")){
                   this.start();
                 }
   }

   this.performMatch = function(card, card_name) {
        //the card not selected
        if (this.lastSelectedCard === null) {
            this.lastSelectedCard = card;
        }
        else {
            let name = this.getCardName(this.lastSelectedCard);
            let matched = (name === card_name);
            if (matched) {
               this.lastSelectedCard.classList.add('match');
               card.classList.add('match');
               if (this.matchedCards.length * 2 == this.displayCards.length) {
                 // The player won this game since no more matches found.
                   let game  = this;
                   setTimeout(function(){
                      game.completeGame();
                   }, 1000);
               }
            }
            else { // not matched
            this.setCardMatch(card, card_name, false);                    this.setCardMatch(this.lastSelectedCard, name, false);
               this.moves--;
               if (this.moves >=0) {
                 this.updateStars();
               }
               else {
                 this.confirmRestartGame('You have no move left.');
               }
             }
             this.lastSelectedCard = null;
        }
   }

   this.createCardsPlaceHolder = function() {
     let game = this;
     this.gameContainer = document.querySelector(".deck");
     this.displayCards.forEach(function(card_name, index, initial_card){
         let li = document.createElement('li');
         li.setAttribute('id', ''+index);
         li.classList.add('card');
         let i = document.createElement('i');
         li.addEventListener('click', function(e) {
            let card = e.target;
            let card_name = game.getCardName(card);
            if (!game.isCardVisible(card, card_name)) {
               game.setCardMatch(card, card_name, true);
               setTimeout(function(){
                   game.performMatch(card, card_name);
               }, 1000);
             }
         });
         li.appendChild(i);
         game.gameContainer.appendChild(li);
      });
   };

this.resetAllCards = function() {
  let game = this;
  document.querySelectorAll(".card")
    .forEach(function(card){
          card.classList.remove('open', 'show', 'match');
     });
   }

// TODO: display all cards
this.load_cards = function(){
let game = this;    document.querySelectorAll('.card').forEach(function(card){

         let ie = card.querySelector('i');
         let name = game.getCardName(card);
          ie.classList = "";
          ie.classList.add('fa', name);
     card.classList.add('open', 'match', 'show');
       });
}

this.reset = function() {
     this.startTime = new Date();

     this.moves = this.maxMoves;
     this.updateStars();
     this.lastSelectedCard = null;
     this.matchedCards = [];
     this.load_cards();

     let game = this;
     setTimeout(function(){
       // reset all cards elements css status
        game.resetAllCards();
     }, 5000);
   }
 
   this.hookButtons = function() {
     let game = this;
     let resetBtn = document.querySelector("#restart");
     //let hintBtn = document.querySelector("#hint");
     resetBtn.addEventListener('click', function() {
        game.reset();
     });
     /*
     hintBtn.addEventListener('click', function() {
        game.hint();
     });*/
   }

   this.start = function(){
      this.displayCards = this.shuffle(this.cards);
      if (!this.initialized) {
         this.createCardsPlaceHolder();
         this.hookButtons();
         this.initialized = true;
      }
      this.reset();
   };

   // Shuffle function from http://stackoverflow.com/a/2450976
 this.shuffle = function(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
   return array;
  }
 };
// Referenced live webinar walkthrough with Mike Wales, Memory Game Webinar with Ryan Waite,  https://developer.mozilla.org, and https://www.w3schools.com for functions and process.
