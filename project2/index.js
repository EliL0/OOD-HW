// GitHub Repository: https://github.com/EliL0/OOD-HW/tree/main/project2

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// abstract can't be initialized on its own so that is why we can include things like _name and _money
var Gambler = /** @class */ (function () {
    function Gambler(name, money, target) {
        this._name = name;
        this._money = money;
        this._target = target;
    }
    Object.defineProperty(Gambler.prototype, "name", {
        get: function () { return this._name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gambler.prototype, "money", {
        get: function () { return this._money; },
        enumerable: false,
        configurable: true
    });
    Gambler.prototype.addMoney = function (amount) {
        this._money += amount;
    };
    Gambler.prototype.removeMoney = function (amount) {
        this._money -= amount;
        if (this._money < 0)
            this._money = 0;
    };
    Gambler.prototype.bankrupt = function () {
        return this._money <= 0;
    };
    Gambler.prototype.hitTarget = function () {
        return this._money >= this._target;
    };
    Gambler.prototype.isFinished = function () {
        return this.bankrupt() || this.hitTarget();
    };
    return Gambler;
}());
var StableGambler = /** @class */ (function (_super) {
    __extends(StableGambler, _super);
    function StableGambler(name, money, bet) {
        var _this = _super.call(this, name, // name
        money, // initial amount
        money * 2) || this; // target
        _this._betAmount = bet;
        return _this;
    }
    // picks whichever value is smaller (prevents overdraw and cleaner)
    StableGambler.prototype.getBetSize = function () {
        return Math.min(this._betAmount, this._money);
    };
    return StableGambler;
}(Gambler));
var HighRiskGambler = /** @class */ (function (_super) {
    __extends(HighRiskGambler, _super);
    function HighRiskGambler(name, money, yoloAmount) {
        var _this = _super.call(this, name, // name
        money, // starting money
        money * 5) || this; // target
        _this._yoloAmount = yoloAmount;
        return _this;
    }
    HighRiskGambler.prototype.getBetSize = function () {
        // if money is less than yolo amount, just bet whatever is left
        if (this._money < this._yoloAmount) {
            return this._money;
        }
        // if money is greater than yolo amount, PUNT HALF OF IT 
        return Math.floor(this._money / 2);
    };
    return HighRiskGambler;
}(Gambler));
var StreakGambler = /** @class */ (function (_super) {
    __extends(StreakGambler, _super);
    function StreakGambler(name, money, initialBet, minBet, winMult, // what the gambler changes their bet by if they WIN
    lossMult, // what the gambler changes their bet by if they LOSE
    target) {
        var _this = _super.call(this, name, money, target) || this;
        _this._currentBet = initialBet;
        _this._minBet = minBet;
        _this._winMult = winMult;
        _this._lossMult = lossMult;
        return _this;
    }
    StreakGambler.prototype.getBetSize = function () {
        return Math.min(this._currentBet, this._money);
    };
    // just multiplies current bet by win multiplier if "on a streak"
    StreakGambler.prototype.win = function () {
        this._currentBet *= this._winMult;
    };
    // if not, return the highest option between the min bet and the current bet * loss multiplier
    StreakGambler.prototype.lose = function () {
        this._currentBet = Math.max(this._minBet, this._currentBet * this._lossMult);
    };
    return StreakGambler;
}(Gambler));
var Game = /** @class */ (function () {
    function Game(name, casino) {
        this._name = name;
        this._casino = casino;
        this._book = new Map();
    }
    // add any viable better
    Game.prototype.addPlayer = function (player, bet) {
        if (bet > 0 && player.money > 0) {
            this._book.set(player, bet);
        }
    };
    Game.prototype.playGame = function () {
        console.log("game:", this._name);
        console.log("book:");
        // this for loop format is more legable and we aren't modifying any index of gambler in the book
        for (var _i = 0, _a = this._book; _i < _a.length; _i++) {
            var _b = _a[_i], player = _b[0], bet = _b[1];
            console.log(player.name, "bets", bet);
        }
        console.log();
        this.simulateGame();
        this._book.clear();
    };
    return Game;
}());
var TailsIWin = /** @class */ (function (_super) {
    __extends(TailsIWin, _super);
    function TailsIWin(casino) {
        return _super.call(this, "Tails I Win", casino) || this;
    }
    TailsIWin.prototype.simulateGame = function () {
        var coin = Math.random() < 0.5 ? "tails" : "heads";
        console.log("dealer flips:", coin);
        for (var _i = 0, _a = this._book; _i < _a.length; _i++) {
            var _b = _a[_i], player = _b[0], bet = _b[1];
            // player loses money in case they lose
            player.removeMoney(bet);
            if (coin === "heads") {
                var winnings = bet * 1.9;
                player.addMoney(winnings);
                // negative profit is LOSS
                this._casino.addProfit(-(winnings - bet));
                console.log(player.name, "wins", winnings);
            }
            else {
                // since bet is already taken, profits are adjusted
                this._casino.addProfit(bet);
            }
        }
    };
    return TailsIWin;
}(Game));
var GuessTheNumber = /** @class */ (function (_super) {
    __extends(GuessTheNumber, _super);
    function GuessTheNumber(casino) {
        return _super.call(this, "Guess The Number", casino) || this;
    }
    GuessTheNumber.prototype.simulateGame = function () {
        var dealerNumber = Math.floor(Math.random() * 5);
        console.log("dealer picked:", dealerNumber);
        for (var _i = 0, _a = this._book; _i < _a.length; _i++) {
            var _b = _a[_i], player = _b[0], bet = _b[1];
            // each player gets a unique guess
            var guess = Math.floor(Math.random() * 5);
            console.log(player.name, "guesses", guess);
            player.removeMoney(bet);
            // "===" is used to prevent type coercion (TypeScript could screw the comparison up)
            if (guess === dealerNumber) {
                var winnings = bet * 4.5;
                player.addMoney(winnings);
                // again, negative profits is LOSS
                this._casino.addProfit(-(winnings - bet));
                console.log(player.name, "wins", winnings);
            }
            else {
                this._casino.addProfit(bet);
            }
        }
    };
    return GuessTheNumber;
}(Game));
var OffTrackGuineaPigRacing = /** @class */ (function (_super) {
    __extends(OffTrackGuineaPigRacing, _super);
    function OffTrackGuineaPigRacing(casino) {
        return _super.call(this, "Off-track Guinea Pig Racing", casino) || this;
    }
    OffTrackGuineaPigRacing.prototype.simulateGame = function () {
        var r = Math.random();
        var winner = 0;
        // winning pig is decided
        if (r < 0.5)
            winner = 0;
        else if (r < 0.75)
            winner = 1;
        else if (r < 0.875)
            winner = 2;
        else
            winner = 3;
        console.log("winning pig:", winner);
        // winning multipliers on each pig (similar to any horse race)
        // first pig is a low multiplier because it is 50% likely to win
        var multipliers = [1.9, 3.8, 7.6, 7.6];
        for (var _i = 0, _a = this._book; _i < _a.length; _i++) {
            var _b = _a[_i], player = _b[0], bet = _b[1];
            var pick = Math.floor(Math.random() * 4);
            console.log(player.name, "bets on pig", pick);
            player.removeMoney(bet);
            if (pick === winner) {
                // winnings is bet * the winning pigs win multiplier
                var winnings = bet * multipliers[winner];
                player.addMoney(winnings);
                this._casino.addProfit(-(winnings - bet));
                console.log(player.name, "wins", winnings);
            }
            else {
                this._casino.addProfit(bet);
            }
        }
    };
    return OffTrackGuineaPigRacing;
}(Game));
var Casino = /** @class */ (function () {
    function Casino(maxRounds) {
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
    Casino.prototype.addProfit = function (amount) {
        this._profits += amount;
    };
    Casino.prototype.simulateOneRound = function () {
        var startingProfit = this._profits;
        console.log("-----------------------");
        console.log("beginning round", this._currentRound);
        for (var _i = 0, _a = this._games; _i < _a.length; _i++) {
            var game = _a[_i];
            this.determineWhoIsStillPlaying();
            for (var _b = 0, _c = this._gamblers; _b < _c.length; _b++) {
                var player = _c[_b];
                game.addPlayer(player, player.getBetSize());
            }
            var gameStartingProfit = this._profits;
            game.playGame();
            console.log("casino made", this._profits - gameStartingProfit, "on this game.");
            console.log();
        }
        console.log("round complete. casino made:", this._profits - startingProfit);
        console.log("total profit:", this._profits);
        console.log("-----------------------");
    };
    Casino.prototype.simulate = function () {
        while (this._currentRound < this._maxRounds && this._gamblers.size > 0) {
            this.simulateOneRound();
            console.log();
            this._currentRound++;
        }
        console.log("simulation complete");
    };
    Casino.prototype.determineWhoIsStillPlaying = function () {
        var gamblersWhoLeft = [];
        for (var _i = 0, _a = this._gamblers; _i < _a.length; _i++) {
            var gambler = _a[_i];
            console.log(gambler.name, ":", gambler.money);
            // if a gambler has reached their target or go bankrupt, push to array
            if (gambler.isFinished()) {
                gamblersWhoLeft.push(gambler);
            }
            // text indications that a gambler is "out"
            if (gambler.hitTarget()) {
                console.log(gambler.name, "has hit their target! They leave the casino...");
            }
            else if (gambler.bankrupt()) {
                console.log(gambler.name, "has gone bankrupt! They leave the casino...");
            }
        }
        for (var _b = 0, gamblersWhoLeft_1 = gamblersWhoLeft; _b < gamblersWhoLeft_1.length; _b++) {
            var leaver = gamblersWhoLeft_1[_b];
            // removes gamblers who can't/won't bet anymore from the list of current gamblers
            this._gamblers.delete(leaver);
        }
    };
    return Casino;
}());
// initialize casino at 5 rounds, simulate.
var amountOfRounds = 5;
var casino = new Casino(amountOfRounds);
casino.simulate();
