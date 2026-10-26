// Riddle number 1.
// Export a riddle object as the default export, with these properties:
// - id (number)
// - name (string)
// - taskDescription (string, the riddle text shown to the player)
// - correctAnswer (string)
// Question 1 - Easy
 
export default {
    id: 1,
    name: "Easy Math",
    taskDescription: "What is 5 + 3?",
    correctAnswer: "1",
    choices: ["8", "10", "11", "7"],
    difficulty:"1",
    timeLimit:5,
    hint:"5 + 2 = 7"
};