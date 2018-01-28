export class MathUtils {
    static getRandomInt(min, max){
        let rand = Math.floor(Math.random() * (max-min));
        let plusMin = rand + min;
        return plusMin;
    }

    static getRandomInts(min, max, num_ints){
        let ints = [];
        for (let i = 0; i < num_ints; i++) {
            ints.push(MathUtils.getRandomInt(min, max));
        }

        return ints;
    }

    static rollPercentDice(percent_hit) {
        let roll = MathUtils.getRandomInt(1, 100);
        return roll <= percent_hit;
    }

    /**
    * Randomize array element order in-place.
    * Using Durstenfeld shuffle algorithm.
    */
    static shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }
}
