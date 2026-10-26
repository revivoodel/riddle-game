import Riddle from './Riddle.js';

export default class MultipleChoiceRiddle extends Riddle {
    constructor(id, name, taskDescription, correctAnswer, choices, difficulty, timeLimit, hint) {
        super(id, name, taskDescription, correctAnswer);
        this.choices = choices;
        this.difficulty = difficulty;
        this.timeLimit = timeLimit;
        this.hint = hint;
    }
    ask(prompt) {
        let hint=false;
        let sumPenalties = 0
        let answer;
        console.log(`----- ${this.name} -----`);
        console.log(this.taskDescription);
        console.log(`time limit:${this.timeLimit}`);
        const start = Date.now();
        this.choices.forEach((c, index) => {
            console.log(`[${index + 1}] ${c}`);
        });
        do {
            answer= (hint)?prompt("Enter your answer: "):prompt("Enter your answer: Enter hint to receive a clue (adds 10 seconds penalty) ");

            if (answer === "hint") {
                console.log(this.hint);
                sumPenalties += 10;
                hint=true
            }
            if (((Date.now() - start) / 1000) > this.timeLimit) {
                console.log("Too slow! 5 seconds penalty applied.");
                sumPenalties += 5;
            }

            (answer === this.correctAnswer) ? console.log("Correct!") : console.log("Wrong answer, try again!");
        } while (answer !== this.correctAnswer);
        console.log("---------------------");
        return sumPenalties
    }

}
