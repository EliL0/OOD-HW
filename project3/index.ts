// GitHub Repository: https://github.com/EliL0/OOD-HW/tree/main/project3


interface Gambler {

    // the interface has fields and MANDATES that all classes that implement "Gambler" have it too
    readonly name: string;
    readonly money: number;
    readonly target: number;

    // all methods in the interface HAVE to be shared by the classes, which means every method has to be implimented

    addMoney(amount: number): void;
    removeMoney(amount: number): void; 

    bankrupt(): boolean 
    hitTarget(): boolean 
    isFinished(): boolean 
}

class BaseGambler{
    protected _name: string;
    protected _money: number;
    protected _target: number;

    constructor(name: string, money: number, target: number) {
        this._name = name;
        this._money = money;
        this._target = target;
    }       

    get name() { return this._name; }
    get money() { return this._money; }
    get target() { return this._target; }

    addMoney(amount: number): void{
        this._money += amount;
    }

    removeMoney(amount: number): void {
        this._money -= amount;
        if (this._money < 0) this._money = 0;
    }

    bankrupt(): boolean {
        return this._money <= 0;
    }

    hitTarget(): boolean {
        return this._money >= this._target;
    }

    isFinished(): boolean {
        return this.bankrupt() || this.hitTarget();
    }
}

class StableGambler implements Gambler {

    private _betAmount: number;
    private _base: BaseGambler;

    constructor(name: string, money: number, bet: number) {
        this._base = new BaseGambler(name, money, money*2);
        this._betAmount = bet;
    }

    get name(): string { return this._base.name; }
    get money(): number { return this._base.money; }
    get target(): number { return this._base.target; }

    public addMoney(amount: number): void{
        this._base.addMoney(amount);
    }

    public removeMoney(amount: number): void {
        this._base.removeMoney(amount);
    }

    public bankrupt(): boolean { return this._base.bankrupt(); }
    public hitTarget(): boolean { return this._base.hitTarget(); }
    public isFinished(): boolean { return (this._base.bankrupt() || this._base.hitTarget()); }

    // this method is different for every gambler so it will not be in the base class
    public getBetSize(): number {
        return Math.min(this._betAmount, this._base.money);
    }
}

class HighRiskGambler implements Gambler {
    private _yoloAmount: number;
    private _base: BaseGambler;

    constructor(name: string, money: number, yoloAmount: number) {
        this._base = new BaseGambler(name, money, money*5);
        this._yoloAmount = yoloAmount;
    }

    get name(): string { return this._base.name; }
    get money(): number { return this._base.money; }
    get target(): number { return this._base.target; }

    public addMoney(amount: number): void{
        this._base.addMoney(amount);
    }

    public removeMoney(amount: number): void {
        this._base.removeMoney(amount);
    }

    public bankrupt(): boolean { return this._base.bankrupt(); }
    public hitTarget(): boolean { return this._base.hitTarget(); }
    public isFinished(): boolean { return this._base.bankrupt() || this._base.hitTarget() }

    // this method is different for every gambler so it will not be in the base class
    public getBetSize(): number {
        // if money is less than yolo amount, just bet whatever is left
        if (this._base.money < this._yoloAmount) {
            return this._base.money;
        }
        
        // if money is greater than yolo amount, PUNT HALF OF IT 
        return Math.floor(this._base.money / 2);
    }

}

class StreakGambler implements Gambler {

    private _currentBet: number;
    private _minBet: number;
    private _winMult: number;
    private _lossMult: number;
    private _base: BaseGambler;

    constructor(
        name: string,
        money: number,
        initialBet: number,
        minBet: number,
        winMult: number, // what the gambler changes their bet by if they WIN
        lossMult: number, // what the gambler changes their bet by if they LOSE
        target: number
    ) {
        this._base = new BaseGambler(name, money, target); // the same as calling "super" basically
        this._currentBet = initialBet;
        this._minBet = minBet;
        this._winMult = winMult;
        this._lossMult = lossMult;
    }

    // just multiplies current bet by win multiplier if "on a streak"
    public win(): void {
        this._currentBet *= this._winMult;
    }

    // if not, return the highest option between the min bet and the current bet * loss multiplier
    public lose(): void {
        this._currentBet = Math.max(this._minBet, this._currentBet * this._lossMult);
    }

    get name(): string { return this._base.name; }
    get money(): number { return this._base.money; }
    get target(): number { return this._base.target; }

    public addMoney(amount: number): void{
        this._base.addMoney(amount);
    }

    public removeMoney(amount: number): void {
        this._base.removeMoney(amount);
    }

    public bankrupt(): boolean { return this._base.bankrupt(); }
    public hitTarget(): boolean { return this._base.hitTarget(); }
    public isFinished(): boolean { return (this._base.bankrupt() || this._base.hitTarget()); }

    // this method is different for every gambler so it will not be in the base class
    public getBetSize(): number {
        return Math.min(this._currentBet, this._base.money);
    }

}

interface Game {

    readonly name: string;
    // casino is a variable to adjusts losses or gains
    readonly casino: Casino;
    // Map because allows for lookup per gambler and very quick change of betting amounts
    readonly book: Map<Gambler, number>;

    addPlayer(player: Gambler, bet: number): void;
    playGame(): void;
    simulateGame(): void;
}

class BaseGame{

    protected _name: string;
    protected _casino: Casino;
    protected _book: Map<Gambler, number>;

    constructor(name: string, casino: Casino) {
        this._name = name;
        this._casino = casino;
        this._book = new Map();
    }

    get name() { return this._name; }
    get casino() { return this._casino; }
    get book() { return this._book; }

    public addPlayer(player: Gambler, bet: number): void {
        if (bet > 0 && player.money > 0) {
            this._book.set(player, bet);
        }
    }

    // baller
    public playGame(obj: Game): void {

        console.log("game:", this._name);
        console.log("book:");

        // this for loop format is more legable and we aren't modifying any index of gambler in the book
        for (let [player, bet] of this._book) {
            console.log(player.name, "bets", bet);
        }

        console.log();

        obj.simulateGame();

        this._book.clear();
    }

}


class TailsIWin implements Game {

    private _base: BaseGame;

    constructor(casino: Casino) {
        this._base = new BaseGame("Tails I Win", casino);
    }

    get name(): string { return this._base.name; }
    get casino(): Casino { return this._base.casino; }
    get book(): Map<Gambler, number> { return this._base.book; }

    // interface methods
    addPlayer(player: Gambler, bet: number): void {
        this._base.addPlayer(player, bet);
    }

    playGame(): void {
        this._base.playGame(this);
    }

    public simulateGame(): void {

        const coin = Math.random() < 0.5 ? "tails" : "heads";
        console.log("dealer flips:", coin);

        for (let [player, bet] of this._base.book) {

            // player loses money in case they lose
            player.removeMoney(bet);

            if (coin === "heads") {

                const winnings = bet * 1.9;
                player.addMoney(winnings);

                // negative profit is LOSS
                this._base.casino.addProfit(-(winnings - bet));

                console.log(player.name, "wins", winnings);

            } else {

                // since bet is already taken, profits are adjusted
                this._base.casino.addProfit(bet);

            }
        }
    }

}

class GuessTheNumber implements Game {

    private _base: BaseGame;

    constructor(casino: Casino) {
        this._base = new BaseGame("Guess The Number", casino);
    }

    get name(): string { return this._base.name; }
    get casino(): Casino { return this._base.casino; }
    get book(): Map<Gambler, number> { return this._base.book; }

    // interface methods
    addPlayer(player: Gambler, bet: number): void {
        this._base.addPlayer(player, bet);
    }

    playGame(): void {
        this._base.playGame(this);
    }

    public simulateGame(): void {

        const dealerNumber = Math.floor(Math.random() * 5);
        console.log("dealer picked:", dealerNumber);

        for (let [player, bet] of this._base.book) {

            // each player gets a unique guess
            const guess = Math.floor(Math.random() * 5);

            console.log(player.name, "guesses", guess);

            player.removeMoney(bet);

            // "===" is used to prevent type coercion (TypeScript could screw the comparison up)
            if (guess === dealerNumber) {

                const winnings = bet * 4.5;
                player.addMoney(winnings);

                // again, negative profits is LOSS
                this._base.casino.addProfit(-(winnings - bet));

                console.log(player.name, "wins", winnings);

            } else {

                this._base.casino.addProfit(bet);

            }
        }
    }

}

class OffTrackGuineaPigRacing implements Game {

    private _base: BaseGame;

    constructor(casino: Casino) {
        this._base = new BaseGame("Off-track Guinea Pig Racing", casino);
    }

    get name(): string { return this._base.name; }
    get casino(): Casino { return this._base.casino; }
    get book(): Map<Gambler, number> { return this._base.book; }

    // interface methods
    addPlayer(player: Gambler, bet: number): void {
        this._base.addPlayer(player, bet);
    }

    playGame(): void {
        this._base.playGame(this);
    }


    public simulateGame(): void {

        const r = Math.random();
        let winner = 0;

        // winning pig is decided
        if (r < 0.5) winner = 0;
        else if (r < 0.75) winner = 1;
        else if (r < 0.875) winner = 2;
        else winner = 3;

        console.log("winning pig:", winner);

        // winning multipliers on each pig (similar to any horse race)
        // first pig is a low multiplier because it is 50% likely to win
        const multipliers = [1.9, 3.8, 7.6, 7.6];

        for (let [player, bet] of this._base.book) {

            const pick = Math.floor(Math.random() * 4);
            console.log(player.name, "bets on pig", pick);
            player.removeMoney(bet);


            if (pick === winner) {

                // winnings is bet * the winning pigs win multiplier
                const winnings = bet * multipliers[winner];
                player.addMoney(winnings);
                this._base.casino.addProfit(-(winnings - bet));
                console.log(player.name, "wins", winnings);

            } else {
                this._base.casino.addProfit(bet);
            }
        }
    }

}

class Casino {

    private _games: Game[];

    // "Set" prevents duplication of names because it only stores unique values
    private _gamblers: Set<StableGambler | HighRiskGambler | StreakGambler>;

    private _profits: number;
    private _maxRounds: number;
    private _currentRound: number;

    public constructor(maxRounds: number) {

        // games are created UNDER the host casino, each game keeps a reference to the casino to report wins/losses
        this._games = [
            new TailsIWin(this),
            new GuessTheNumber(this),
            new OffTrackGuineaPigRacing(this),
        ];

        this._profits = 0;

        // just some random filler gamblers in each class type
        this._gamblers = new Set([
            new StableGambler("Alice", 100, 15),
            new HighRiskGambler("Bob", 50, 10),
            new StreakGambler("Camille", 200, 10, 10, 2, 0.5, 500),
        ]);

        this._maxRounds = maxRounds;
        this._currentRound = 0;
    }

    // no SUBTRACT profit because we can just make profit negative
    public addProfit(amount: number): void {
        this._profits += amount;
    }

    public simulateOneRound(): void {

        const startingProfit = this._profits;

        console.log("-----------------------");
        console.log("beginning round", this._currentRound);

        for (let game of this._games) {

            this.determineWhoIsStillPlaying();

            for (let player of this._gamblers) {
                game.addPlayer(player, player.getBetSize());
            }

            const gameStartingProfit = this._profits;

            game.playGame();

            console.log(
                "casino made",
                this._profits - gameStartingProfit,
                "on this game."
            );

            console.log();
        }

        console.log(
            "round complete. casino made:",
            this._profits - startingProfit
        );

        console.log("total profit:", this._profits);
        console.log("-----------------------");
    }

    public simulate(): void {

        while (this._currentRound < this._maxRounds && this._gamblers.size > 0) {

            this.simulateOneRound();
            console.log();

            this._currentRound++;
        }

        console.log("simulation complete");
    }

    private determineWhoIsStillPlaying() {

        const gamblersWhoLeft: Set<StableGambler | HighRiskGambler | StreakGambler> = new Set();

        for (let gambler of this._gamblers) {

            console.log(gambler.name, ":", gambler.money);

            // if a gambler has reached their target or go bankrupt, push to array
            if (gambler.isFinished()) {
                gamblersWhoLeft.add(gambler);
            }

            // text indications that a gambler is "out"
            if (gambler.hitTarget()) {

                console.log(
                    gambler.name,
                    "has hit their target! They leave the casino..."
                );

            } else if (gambler.bankrupt()) {

                console.log(
                    gambler.name,
                    "has gone bankrupt! They leave the casino..."
                );
            }
        }

        for (let leaver of gamblersWhoLeft) {
            // removes gamblers who can't/won't bet anymore from the list of current gamblers
            this._gamblers.delete(leaver);
        }
    }
}

// initialize casino at 5 rounds, simulate.

const amountOfRounds = 5;
const casino = new Casino(amountOfRounds);

casino.simulate();