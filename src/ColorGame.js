import ColorBlock from './ColorBlock';
import {MathUtils} from './utils/MathUtils';
import Color from './Color';
import GridManager from './GridManager';

export default class ColorGame {
    constructor(gridSize) {
        this.gridManager = new GridManager(gridSize);
        this.gameStarted = false;
    }

    startGame() {
        this.gridManager.setNewGrid();
        this.gameStarted = true;
    }

    shuffle() {
        this.gridManager.shuffle();
    }
}
