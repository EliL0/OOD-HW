import readline from 'readline-sync'

class Game {
    private win: boolean = false;

    public declareCards(){
    //  - print the dealer’s visible card
    //  - the player’s two initial cards
    //  - their total value    
    }

    public promptChoice(){
        //userInput = input("(h)it or (s)tay")
            // prompts for h or s
        //if h, update score
            // if bust, check for aces
                // if aces, set first ace to 1
    }

    public checkWin(score: number){
        // search Player cards to find ace, if ace == 11, 
    }

    public dealersTurn(){
        // if s, switch to dealer,
            // dealer must hit < 17;
        // print winner (dealer wins in tie)
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
            cards[index], cards[lastIndex];
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

    // THIS IS ONLY FOR DEBUGGING
    public getDeck(){
        return this.deck;
    }
}

class Player{
    private score: number = 0;
    private hand: Card[] = [];
    public bust: boolean = false;

    public addToHand(card: Card){
        this.score = 0
        this.hand.push(card);
        for(let i = 0; i < this.hand.length; i++){
            this.score += this.hand[i][2];
        }
    }

    public isBust(): boolean{
        if (this.score > 21){
            // check for aces
            for(let i = 0; i < this.hand.length; i++){
                if (this.hand[i][0] == "Ace"){
                    this.hand[i][2] = 1;
                    this.score = this.score - 10;
                }
            }            
            this.bust = true;
        }
        return this.bust;
    }

    public getHand() {        
        return this.hand;
    }

    public getScore(){
        return this.score;
    }
}

const c: Cards = new Cards;
const cards: Card[] = c.getCards();

const gameDeck: Deck = new Deck(cards);

