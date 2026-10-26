// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
export default class Player {
    constructor(name) {
        this.name = name;
        this.times = [];
    }
    recordTime(start, end,sumPenalties) {
        const duration = ((end - start) / 1000)+sumPenalties;
        this.times.push(duration);
    }
    showStats(){
        let sumTime=0
        this.times.forEach(time => { sumTime+=time});
        console.log("\n\n\n");
        console.log("--------- GAME STATS ---------");
        console.log(`Total Riddles: ${this.times.length}`);
        console.log(`Total Time: ${sumTime} seconds`);
        console.log(`Average Time: ${sumTime/this.times.length} seconds`);
        console.log("------------------------------");
    }

}