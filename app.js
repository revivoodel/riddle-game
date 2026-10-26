// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.
import Riddle from './classes/Riddle.js';
import Player from './classes/Player.js';
import MultipleChoiceRiddle from './classes/MultipleChoiceRiddle.js';


import PromptSync from 'prompt-sync';
import AllRiddles from './riddles/index.js';
const Difficulty = {
    EASY: "1",
    MEDIUM: "2",
    HARD: "3"
};

const prompt = PromptSync();

const name = prompt("What is your name? ");
const player = new Player(name);

console.log(`Hello ${name}`);
console.log("Let's start the game!");
console.log("choose difficult:");
console.log("[1] easy");
console.log("[2] medium");
console.log("[3] hard");
let dif;
do {
    dif = prompt();
} while (dif < "1" || dif > "3")

switch (dif) {
    case Difficulty.EASY:
        console.log("---------EASY-LAVEL-----------");
        break
    case Difficulty.MEDIUM:
        console.log("---------MEDIUM-LAVEL-----------");

        break
    case Difficulty.HARD:
        console.log("---------HARD-LAVEL-----------");

        break

}

const filterRiddles = AllRiddles.filter(riddle => { return riddle.difficulty == dif })
filterRiddles.sort(() => Math.random() - 0.5);
for (let riddleData of filterRiddles) {
    const start = Date.now();

    const riddle = new MultipleChoiceRiddle(
        riddleData.id,
        riddleData.name,
        riddleData.taskDescription,
        riddleData.correctAnswer,
        riddleData.choices,
        riddleData.difficulty,
        riddleData.timeLimit,
        riddleData.hint
    );
    let sumPenalties = riddle.ask(prompt);

    const end = Date.now();

    player.recordTime(start, end, sumPenalties);

}

player.showStats();