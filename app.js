
// app.js

import Player from './classes/Player.js';
import MultipleChoiceRiddle from './classes/MultipleChoiceRiddle.js';
import PromptSync from 'prompt-sync';

import {
    getAllRiddles,
    createRiddle,
    updateRiddle,
    deleteRiddle
} from './api/riddlesApi.js';

import {
    findPlayerByName,
    createPlayer,
    updatePlayer,
    getAllPlayers
} from './api/playersApi.js';

const prompt = PromptSync();

const Difficulty = {
    EASY: "1",
    MEDIUM: "2",
    HARD: "3"
};


async function playGame() {
    const AllRiddles = await getAllRiddles();

    const name = prompt("What is your name? ");

    
    let dbPlayer = await findPlayerByName(name);

    if (dbPlayer) {
        console.log(`Welcome back, ${name}!`);

        if (dbPlayer.lowestTime !== null) {
            console.log(
                `Your previous lowest time was ${dbPlayer.lowestTime} seconds`
            );
        }

    } else {
        dbPlayer = await createPlayer(name);
        console.log(`Welcome ${name}! New player created.`);
    }


    const player = new Player(name);

    console.log("Let's start the game!");

    console.log("Choose difficulty:");
    console.log("[1] easy");
    console.log("[2] medium");
    console.log("[3] hard");

    let dif;

    do {
        dif = prompt("Choose: ");
    } while (!["1", "2", "3"].includes(dif));

    switch (dif) {
        case Difficulty.EASY:
            console.log("---------EASY-LEVEL-----------");
            break;

        case Difficulty.MEDIUM:
            console.log("---------MEDIUM-LEVEL-----------");
            break;

        case Difficulty.HARD:
            console.log("---------HARD-LEVEL-----------");
            break;
    }

    // Filter riddles by difficulty
    const filterRiddles = AllRiddles.filter(riddle => {
        return riddle.difficulty == dif;
    });

    // Shuffle riddles
    filterRiddles.sort(() => Math.random() - 0.5);

    if (filterRiddles.length === 0) {
        console.log("No riddles in this difficulty");
        return;
    }

   
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

 
    console.log("Player times:", player.times);

    const totalTime = player.times.reduce((sum, time) => {
        return sum + time;
    }, 0);

    const finalTime = Number(totalTime.toFixed(2));

    console.log("Final time:", finalTime);
    console.log("Old record:", dbPlayer.lowestTime);


    if (
        dbPlayer.lowestTime === null ||
        finalTime < dbPlayer.lowestTime
    ) {
        dbPlayer.lowestTime = finalTime;

        console.log("Trying to save:", dbPlayer);

        const savedPlayer = await updatePlayer(dbPlayer);

        console.log("Saved player:", savedPlayer);
        console.log("New record! Time updated.");
    } else {
        console.log("You did not beat your previous record.");
    }

}


async function addRiddle() {
    const name = prompt("Enter riddle name: ");
    const taskDescription = prompt("Enter description: ");

    console.log("Enter 4 possible answers:");

    const choices = [];

    for (let i = 0; i < 4; i++) {
        const answer = prompt(`Answer ${i + 1}: `);
        choices.push(answer);
    }

    const correctAnswer = prompt(
        "Correct answer number (1-4): "
    );

    const difficulty = prompt(
        "Difficulty (1-Easy, 2-Medium, 3-Hard): "
    );

    const timeLimit = Number(
        prompt("Time limit in seconds: ")
    );

    const hint = prompt("Enter hint: ");

    const newRiddle = {
        name,
        taskDescription,
        correctAnswer,
        choices,
        difficulty,
        timeLimit,
        hint
    };

    const result = await createRiddle(newRiddle);

    console.log(`Riddle created! ID: ${result.id}`);
}


async function showRiddles() {
    const riddles = await getAllRiddles();

    if (riddles.length === 0) {
        console.log("No riddles found");
        return;
    }

    riddles.forEach(riddle => {
        console.log("--------------------");
        console.log("ID:", riddle.id);
        console.log("Name:", riddle.name);
        console.log("Question:", riddle.taskDescription);
        console.log("Choices:", riddle.choices);
        console.log("Correct answer:", riddle.correctAnswer);
        console.log("Difficulty:", riddle.difficulty);
    });
}

async function editRiddle() {
    await showRiddles();

    const id = prompt("Enter riddle ID to update: ");

    const riddles = await getAllRiddles();

    const oldRiddle = riddles.find(r => String(r.id) === id);

    if (!oldRiddle) {
        console.log("Riddle not found");
        return;
    }

    console.log("Press Enter to keep the current value");

    const name = prompt(`Name (${oldRiddle.name}): `);

    const description = prompt(
        `Description (${oldRiddle.taskDescription}): `
    );

    const choices = [...oldRiddle.choices];

    for (let i = 0; i < choices.length; i++) {
        const answer = prompt(
            `Answer ${i + 1} (${choices[i]}): `
        );

        if (answer !== "") {
            choices[i] = answer;
        }
    }

    const correctAnswer = prompt(
        `Correct answer (${oldRiddle.correctAnswer}): `
    );

    const difficulty = prompt(
        `Difficulty (${oldRiddle.difficulty}): `
    );

    const timeLimit = prompt(
        `Time limit (${oldRiddle.timeLimit}): `
    );

    const hint = prompt(
        `Hint (${oldRiddle.hint}): `
    );

    const updatedRiddle = {
        name: name || oldRiddle.name,
        taskDescription: description || oldRiddle.taskDescription,
        choices,
        correctAnswer: correctAnswer || oldRiddle.correctAnswer,
        difficulty: difficulty || oldRiddle.difficulty,
        timeLimit: timeLimit === ""
            ? oldRiddle.timeLimit
            : Number(timeLimit),
        hint: hint || oldRiddle.hint
    };

    await updateRiddle(id, updatedRiddle);

    console.log("Riddle updated successfully!");
}


async function removeRiddle() {
    await showRiddles();

    const id = prompt("Enter riddle ID to delete: ");

    const confirm = prompt(
        "Are you sure? (yes/no): "
    );

    if (confirm.toLowerCase() !== "yes") {
        console.log("Delete cancelled");
        return;
    }

    await deleteRiddle(id);

    console.log("Riddle deleted successfully!");
}

async function showLeaderboard() {

  
    const players = await getAllPlayers();

  
    const finishedPlayers = players.filter(player => {
        return player.lowestTime !== null;
    });

    
    finishedPlayers.sort((a, b) => {
        return a.lowestTime - b.lowestTime;
    });

    if (finishedPlayers.length === 0) {
        console.log("No players on leaderboard yet");
        return;
    }

    console.log("\n🏆 Leaderboard:");

    finishedPlayers.forEach((player, index) => {
        console.log(
            `${index + 1}. ${player.name} - ${player.lowestTime} seconds`
        );
    });
}


let choice = "";

while (choice !== "0") {
    console.log("\nWhat do you want to do?");
    console.log("1. Play the game");
    console.log("2. Create a new riddle");
    console.log("3. Read all riddles");
    console.log("4. Update an existing riddle");
    console.log("5. Delete a riddle");
    console.log("6. View leaderboard");
    console.log("0. Exit");

    choice = prompt("Choose an option: ");

    try {
        switch (choice) {
            case "1":
                await playGame();
                break;

            case "2":
                await addRiddle();
                break;

            case "3":
                await showRiddles();
                break;

            case "4":
                await editRiddle();
                break;

            case "5":
                await removeRiddle();
                break;

            case "6":
                await showLeaderboard();
                break;
            case "0":
                console.log("Goodbye!");
                break;

            default:
                console.log("Invalid option");
        }

    } catch (error) {
        console.log("Operation failed:", error.message);
    }
}
