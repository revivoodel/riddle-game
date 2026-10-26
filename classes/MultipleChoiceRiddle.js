import Riddle from './Riddle.js';

export default class MultipleChoiceRiddle extends Riddle {
  constructor(id, name, taskDescription, correctAnswer,choices) {
    super(id, name, taskDescription, correctAnswer);
    this.choices = choices;
  }
  ask(prompt) {
        let answer;
        console.log(`----- ${this.name} -----`);
        console.log(this.taskDescription);
        this.choices.forEach((c,index) => {
        console.log(`[${index+1}] ${c}`);     
        });
        do {
            answer = prompt("Enter your answer: ");
            (answer === this.correctAnswer) ? console.log("Correct!") : console.log("Wrong answer, try again!");
        } while (answer !== this.correctAnswer);
        console.log("---------------------");
    }

}
