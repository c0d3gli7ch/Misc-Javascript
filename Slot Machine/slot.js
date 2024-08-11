const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS = {

    "💀 ": 2,
    "❤️ ": 4,
    "⚔️ ": 6,
    "🪙 ": 8
};

const SYMBOL_VALUES = {
    "👑 ": 5,
    "❤️ ": 4,
    "⚔️ ": 3,
    "🪙 ": 2
}


const deposit = () => {
    while(true) {
        const amount = prompt("[+] ENTER THE DEPOSIT AMOUNT: ");
        const convAmount = parseFloat(amount);

        if (isNaN(convAmount) || convAmount <= 0){
            console.log("[!] ENTER VALID AMOUNT");
        }
        else {
            return convAmount;
        }
    }
};

const getBettingLines = () => {
    while(true) {
        const lines = prompt("[+] ENTER NUMBER OF LINES TO BET ON (1-3): ");
        const bettingLines = parseInt(lines);

        if (isNaN(bettingLines) || bettingLines <= 0 || bettingLines > 3){
            console.log("[!] ENTER A VALID NUMBER: ");
        }
        else {
            return bettingLines;
        }
    }
};

const getBet = (amount, lines) => {
    while(true) {
        const bet = prompt("ENTER BETTING AMOUNT (per line): ");
        const bettingAmount = parseFloat(bet);

        if (isNaN(bet) || bet <= 0){
            console.log("[!] INVALID BETTING AMOUNT ENTERED. ");
        }
        else if (bet > (amount / lines)) {
            console.log("[-] INSUFFICIENT BETTING AMOUNT AVAILABLE.. ADD FUNDS FOR THE ROUND ");
            const cont = prompt("[!]NOTE: THIS IS A HIGH RISK ROUND.. IF YOU LOSE YOUR BALANCE WILL BE LOST, PROCEED CAREFULLY; DO YOU WISH TO CONTINUE? (Y/N) ")
            if (cont != "Y") {
                break
            }
            else {
                const flowFunds = prompt("[+] ENTER BALANCE TO CONTINUE: $ ");
                amount += flowFunds;
            }
        }
        else {
            return bettingAmount;
        }
    }
}

const spin = () => {
    const symb = [];
    for (const [symbol, count] of Object.entries(SYMBOLS)){
        for (let i = 0; i < count; i++){
            symb.push(symbol);  
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const perReelSymbol = [...symb];
        for (let j = 0; j < ROWS; j++){
            const randomLoc = Math.floor(Math.random() * perReelSymbol.length);
            const selectedSymbols = perReelSymbol[randomLoc];
            reels[i].push(selectedSymbols);
            perReelSymbol.splice(randomLoc, 1);
        }
    }

    return reels;
};


const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }

    return rows;
};


const printRows = (rows) => {
    for (const row of rows) {
        let contString = "";
        for (const [i, symb] of row.entries()) {
            contString += symb;
            if (i != row.length - 1) {
                contString += " | "
            }
        }
        console.log(contString);
    }
}


const getReward = (rows, bet, lines) => {
    let reward = 0;

    for (let row = 0; row < lines; row++){
        const symb = rows[row];

        let common = true;
        for (const sym of symb) {
            if (sym != symb[0]) {
                common = false;
                break;
            }
        }

        if (common) {
            reward += bet * SYMBOL_VALUES[symb[0]]
        }
    }

    return reward;
}


const game = () => {
    let amount = deposit();

    while(true){

        console.log("[+] Balance: $" + amount)
        const lines = getBettingLines();
        const bet = getBet(amount, lines);
        amount -= bet * lines;
        const reels = spin();
        console.log("")
        const rows = transpose(reels);
        printRows(rows);
        console.log("")
        const rewards = getReward(rows, bet, lines)
        console.log("[*] REWARD WON: $" + rewards.toString())
        amount += rewards
        console.log("")

        if (amount <= 0){
            console.log("[!] CANNOT PROCEED.. YOU HAVE 0$ LEFT")
            break;
        }

        const retry = prompt("[+] DO YOU WANT TO PLAY AGAIN? (Y/N)")
        if (retry != "Y") {
            break;
        }
    }

};

game();

