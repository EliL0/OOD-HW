"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
class Game {
    constructor() {
        this.win = false;
    }
    showCards(player) {
        let i = 0;
        if (player.getName() === "Dealer") {
            i = 1;
        }
        console.log(player.getName() + ":");
        console.log("------------------");
        for (i; i < player.getHand().length; i++) {
            let suit = player.getHand()[i][0];
            let face = player.getHand()[i][1];
            let val = player.getHand()[i][2];
            if (face) {
                console.log(face + " of " + suit);
            }
            else {
                console.log(val + " of " + suit);
            }
        }
        console.log("------------------");
        if (player.getName() === "Dealer") {
            console.log(player.getName() + " Showing: " + (player.getScore() - player.getHand()[0][2]));
        }
        else {
            console.log(player.getName() + " Showing: " + player.getScore());
        }
        console.log("\n");
    }
    playersTurn(player, deck) {
        let choice = '';
        while (choice !== 's') {
            this.showCards(player);
            choice = readline_sync_1.default.question('(h)it or (s)tay? (type \'h\' or \'s\' to select)');
            if (choice === 'h') {
                player.hit(deck);
                if (player.isBust()) {
                    break;
                }
            }
        }
    }
    checkWin(player, dealer) {
        // console.log(player.getName() + " have: " + player.getScore() + ". Dealer has: " + dealer.getScore()+ '\n');
        if (player.isBust()) {
            console.log("\n" + player.getName() + " Bust. Dealer Wins...");
            return true;
        }
        else if (dealer.isBust()) {
            console.log("\nDealer Busts. " + player.getName() + " Win!!!");
            return true;
        }
        return false;
    }
    hitForDealer(dealer, deck) {
        console.log("\nDealer's Turn...");
        while (dealer.getScore() < 17) {
            this.showCards(dealer);
            dealer.hit(deck);
            // console.log(dealer.getHand());
            // console.log(dealer.getScore());
        }
    }
}
class Cards {
    // Constructor
    constructor() {
        this.cards = [];
        this.cards = [
            ["Hearts", undefined, 2], ["Diamonds", undefined, 2], ["Clubs", undefined, 2], ["Spades", undefined, 2],
            ["Hearts", undefined, 3], ["Diamonds", undefined, 3], ["Clubs", undefined, 3], ["Spades", undefined, 3],
            ["Hearts", undefined, 4], ["Diamonds", undefined, 4], ["Clubs", undefined, 4], ["Spades", undefined, 4],
            ["Hearts", undefined, 5], ["Diamonds", undefined, 5], ["Clubs", undefined, 5], ["Spades", undefined, 5],
            ["Hearts", undefined, 6], ["Diamonds", undefined, 6], ["Clubs", undefined, 6], ["Spades", undefined, 6],
            ["Hearts", undefined, 7], ["Diamonds", undefined, 7], ["Clubs", undefined, 7], ["Spades", undefined, 7],
            ["Hearts", undefined, 8], ["Diamonds", undefined, 8], ["Clubs", undefined, 8], ["Spades", undefined, 8],
            ["Hearts", undefined, 9], ["Diamonds", undefined, 9], ["Clubs", undefined, 9], ["Spades", undefined, 9],
            ["Hearts", undefined, 10], ["Diamonds", undefined, 10], ["Clubs", undefined, 10], ["Spades", undefined, 10],
            ["Hearts", "Jack", 10], ["Diamonds", "Jack", 10], ["Clubs", "Jack", 10], ["Spades", "Jack", 10],
            ["Hearts", "Queen", 10], ["Diamonds", "Queen", 10], ["Clubs", "Queen", 10], ["Spades", "Queen", 10],
            ["Hearts", "King", 10], ["Diamonds", "King", 10], ["Clubs", "King", 10], ["Spades", "King", 10],
            ["Hearts", "Ace", 11], ["Diamonds", "Ace", 11], ["Clubs", "Ace", 11], ["Spades", "Ace", 11]
        ];
    }
    getCards() {
        return this.cards;
    }
}
class Deck {
    // Constructor
    constructor(cards) {
        // store cards in order
        this.deck = [];
        this.shuffleCards(cards);
    }
    // mutator of card array
    shuffleCards(cards) {
        for (let remaining = 52; remaining > 0; remaining--) {
            const index = Math.floor(Math.random() * remaining); // stores index of random card
            const randomCard = cards[index];
            this.deck.push(randomCard);
            const lastIndex = remaining - 1;
            // Swap with the last available card
            let temp = cards[index];
            cards[index] = cards[lastIndex];
            cards[lastIndex] = temp;
        }
    }
    dealCard() {
        let card = this.deck.shift();
        if (!card) {
            throw new Error("Illegal Game State: Deck empty");
        }
        else {
            return card;
        }
    }
    getDeck() {
        return this.deck;
    }
}
class Player {
    constructor(name, card1, card2) {
        this.name = 'Player';
        this.score = 0;
        this.hand = [];
        this.bust = false;
        this.name = name;
        this.hand.push(card1);
        this.hand.push(card2);
        this.getScore();
    }
    hit(deck) {
        this.hand.push(deck.dealCard());
        this.getScore();
    }
    isBust() {
        if (this.score > 21) {
            // check/correct for aces
            for (let i = 0; i < this.hand.length; i++) {
                if (this.hand[i][1] == "Ace") {
                    this.hand[i][2] = 1;
                    this.score = this.score - 10;
                    break;
                }
            }
            if (this.score > 21) {
                this.bust = true;
            }
        }
        return this.bust;
    }
    getHand() {
        return this.hand;
    }
    getScore() {
        this.score = 0;
        if (!this.hand) {
            this.score = 0;
        }
        else {
            for (let i = 0; i < this.hand.length; i++) {
                this.score += this.hand[i][2];
            }
        }
        return this.score;
    }
    getName() {
        return this.name;
    }
}
// Setting up Cards and Game
const game = new Game();
const c = new Cards();
const cards = c.getCards();
// Game Loop
let play = 'p';
while (play === 'p') {
    const gameDeck = new Deck(cards);
    const player = new Player("You", gameDeck.dealCard(), gameDeck.dealCard());
    const dealer = new Player("Dealer", gameDeck.dealCard(), gameDeck.dealCard());
    console.log("\nCards are Dealt......\n");
    game.showCards(dealer);
    game.playersTurn(player, gameDeck);
    game.checkWin(player, dealer);
    if (!player.isBust()) {
        game.hitForDealer(dealer, gameDeck);
        game.checkWin(player, dealer);
    }
    // Compares Score at the End
    console.log("\n" + player.getName() + " have: " + player.getScore() + ". Dealer has: " + dealer.getScore() + '\n');
    if (player.getScore() > dealer.getScore()) {
        console.log(player.getName() + " Score Higher. " + player.getName() + " Win!!!");
    }
    else {
        console.log(player.getName() + " Can't Beat Dealer's Score. Dealer Wins...");
    }
    while (play !== 'p' && play !== 'q') {
        play = readline_sync_1.default.question('Would you like to (p)lay again or (q)uit? (type \'p\' or \'q\' to select)');
    }
}
