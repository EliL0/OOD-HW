import readline from 'readline-sync'

class Game {
    private win: boolean = false;

    public showCards(player: Player){
        let i = 0;
        if (player.getName() === "Dealer"){
            i = 1;
        }
        console.log(player.getName() + ":");
        console.log("------------------");

        for(i; i < player.getHand().length; i++){
            let suit = player.getHand()[i][0];
            let face = player.getHand()[i][1];
            let val = player.getHand()[i][2];

            if (face){
                console.log(face + " of " + suit);
            } else {
                console.log(val + " of " + suit);
            }
        }
        console.log("------------------");
        if (player.getName() === "Dealer"){
            console.log(player.getName() + " Showing: " + (player.getScore() - player.getHand()[0][2]));
        } else {
            console.log(player.getName() + " Showing: " + player.getScore());
        }
        console.log("\n");
    }

    public playersTurn(player: Player, deck: Deck){
        let choice = '';

        while(choice !== 's'){
            this.showCards(player);
            choice = readline.question('(h)it or (s)tay? (type \'h\' or \'s\' to select)');
            if (choice === 'h'){
                player.hit(deck);
                if(player.isBust()){
                    break;
                }
            }
        }
    }

    public checkWin(player: Player, dealer: Player): boolean{
        // console.log(player.getName() + " have: " + player.getScore() + ". Dealer has: " + dealer.getScore()+ '\n');
        if (player.isBust()){
            console.log("\n" + player.getName() + " Bust. Dealer Wins...");
            return true;
        } else if (dealer.isBust()){
            console.log("\nDealer Busts. " + player.getName() + " Win!!!");
            return true;
        } 
        return false;
    }

    public hitForDealer(dealer: Player, deck: Deck){
        console.log("\nDealer's Turn...");
        while(dealer.getScore() < 17){
            this.showCards(dealer);
            dealer.hit(deck);
            // console.log(dealer.getHand());
            // console.log(dealer.getScore());
        }
    }
}


type Card = [suit: string, face: string | undefined, val: number]

class Cards{
    private cards: Card[] = [];
    // Constructor
    constructor(){
        this.cards = [
                ["Hearts", undefined, 2],  ["Diamonds", undefined, 2],  ["Clubs", undefined, 2],  ["Spades", undefined, 2],
                ["Hearts", undefined, 3],  ["Diamonds", undefined, 3],  ["Clubs", undefined, 3],  ["Spades", undefined, 3],
                ["Hearts", undefined, 4],  ["Diamonds", undefined, 4],  ["Clubs", undefined, 4],  ["Spades", undefined, 4],
                ["Hearts", undefined, 5],  ["Diamonds", undefined, 5],  ["Clubs", undefined, 5],  ["Spades", undefined, 5],
                ["Hearts", undefined, 6],  ["Diamonds", undefined, 6],  ["Clubs", undefined, 6],  ["Spades", undefined, 6],
                ["Hearts", undefined, 7],  ["Diamonds", undefined, 7],  ["Clubs", undefined, 7],  ["Spades", undefined, 7],
                ["Hearts", undefined, 8],  ["Diamonds", undefined, 8],  ["Clubs", undefined, 8],  ["Spades", undefined, 8],
                ["Hearts", undefined, 9],  ["Diamonds", undefined, 9],  ["Clubs", undefined, 9],  ["Spades", undefined, 9],
                ["Hearts", undefined,10],  ["Diamonds", undefined,10],  ["Clubs", undefined,10],  ["Spades", undefined,10],

                ["Hearts", "Jack", 10],    ["Diamonds", "Jack", 10],    ["Clubs", "Jack", 10],    ["Spades", "Jack", 10],
                ["Hearts", "Queen",10],    ["Diamonds", "Queen",10],    ["Clubs", "Queen",10],    ["Spades", "Queen",10],
                ["Hearts", "King", 10],    ["Diamonds", "King", 10],    ["Clubs", "King", 10],    ["Spades", "King", 10],
                ["Hearts", "Ace",  11],    ["Diamonds", "Ace",  11],    ["Clubs", "Ace",  11],    ["Spades", "Ace",  11]
            ];
    }

    public getCards(): Card[]{
        return this.cards;
    }
}

class Deck {
    // store cards in order
    private deck: Card[] = [];

    // Constructor
    constructor(cards: Card[]){
        this.shuffleCards(cards);    
    }

    // mutator of card array
    public shuffleCards(cards: Card[]){
        for (let remaining = 52; remaining>0; remaining--){
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
    public dealCard(){
        let card = this.deck.shift();
 		if(!card) {
            throw new Error("Illegal Game State: Deck empty");
        } else {
            return card;
        }
    }

    public getDeck(){
        return this.deck;
    }
}

class Player{
    private name: string = 'Player';
    private score: number = 0;
    private hand: Card[] = [];
    public bust: boolean = false;

    constructor(name: string, card1: Card, card2: Card){
        this.name = name;
        this.hand.push(card1);
        this.hand.push(card2);
        this.getScore();

    }
    public hit(deck: Deck){
        this.hand.push(deck.dealCard());
        this.getScore();
    }

    public isBust(): boolean{
        if (this.score > 21){
            // check/correct for aces
            for(let i = 0; i < this.hand.length; i++){
                if (this.hand[i][1] == "Ace" && this.hand[i][2] == 11){
                    this.hand[i][2] = 1;
                    this.score = this.score - 10;
                    if (this.score > 21){
                        break;
                    }
                } 
            }            
            if(this.score > 21){
                this.bust = true;
            }
        }
        return this.bust;
    }

    public getHand() {        
        return this.hand;
    }

    public getScore(): number{
        this.score = 0;
        if (!this.hand){
            this.score = 0;
        } else {
            for(let i = 0; i < this.hand.length; i++){
                this.score += this.hand[i][2];
            }    
        }
        return this.score;
    }
    public getName(): string{
        return this.name;
    }
}

// Setting up Cards and Game
const game: Game = new Game();
const c: Cards = new Cards();
const cards: Card[] = c.getCards();

// Game Loop
let play = '';

 while(play !== 'q'){    
    const gameDeck: Deck = new Deck(cards);

    const player: Player = new Player("You", gameDeck.dealCard(), gameDeck.dealCard());
    const dealer: Player = new Player("Dealer", gameDeck.dealCard(), gameDeck.dealCard());  

    console.log("\nCards are Dealt......\n");
    game.showCards(dealer);

    game.playersTurn(player, gameDeck);
    game.checkWin(player, dealer);
    if (!player.isBust()){
        game.hitForDealer(dealer, gameDeck);
        game.checkWin(player, dealer);
    }
    // Compares Score at the End
    console.log("\n"+ player.getName() + " have: " + player.getScore() + ". Dealer has: " + dealer.getScore()+ '\n');

    if (player.getScore() > dealer.getScore()){
        console.log(player.getName() + " Score Higher. " + player.getName() + " Win!!!");
    } else {
        console.log(player.getName() + " Can't Beat Dealer's Score. Dealer Wins...");
    }
    play = readline.question('Would you like to (p)lay again or (q)uit? (type \'p\' or \'q\' to select)');
    if(play !== 'p' && play !== 'q'){
        throw new Error("Illegal Response");
    }
}
