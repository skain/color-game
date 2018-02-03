import {MathUtils} from './utils/MathUtils';
import ColorBlock from './ColorBlock';
import Color from './Color';

export default class GridManager {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.gameGrid = [];
        this.numBlocks = this.gridSize * this.gridSize;
        this.isShuffled = false;
        this.puzzleComplete = false;
        this.anchorCoords = null;
        this.selectedBlock = null;
    }

    setNewGrid() {
        this.isShuffled = false;
        let generator = new GridGenerator(this.gridSize);
        this.gameGrid = generator.generateGrid();
        this.puzzleComplete = false;
        this.selectedBlock = null;
        this.setAnchors();
    }

    setAnchors() {
        let stratBuilder = new AnchorStrategyBuilder(this.gridSize);
        this.anchorCoords = stratBuilder.getRandomAnchorCoords();
        this.anchorCoords.forEach(anchor => {
            this.gameGrid[anchor.x][anchor.y].setIsAnchor(true);
        });
    }

    shuffle() {
        let anchorCoordsLookup = [];
        this.anchorCoords.forEach(anchor => {
            anchorCoordsLookup.push(anchor.x + ',' + anchor.y);
        });

        let coordsWithoutAnchors = [];
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!anchorCoordsLookup.includes(row + ',' + col)) {
                    coordsWithoutAnchors.push({x: row, y: col});
                }
            }
        }

        let shuffledCoordsWithoutAnchors = [];

        let shuffleIterations = 0;
        let shuffledGrid = null;
        while(true){
            shuffleIterations++;
            coordsWithoutAnchors = [];
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    if (!anchorCoordsLookup.includes(row + ',' + col)) {
                        coordsWithoutAnchors.push({x: row, y: col});
                    }
                }
            }
            shuffledCoordsWithoutAnchors = MathUtils.shuffleArray(coordsWithoutAnchors);
            shuffledGrid = [];

            for (let row = 0; row < this.gridSize; row++) {
                let curRow = [];
                for (let col = 0; col < this.gridSize; col++) {
                    let block = null;
                    if (anchorCoordsLookup.includes(row + ',' + col)) {
                        block = this.gameGrid[row][col];
                    } else {
                        let coord = shuffledCoordsWithoutAnchors.pop();
                        block = this.gameGrid[coord.x][coord.y];
                        block.setCurrentCoordinates(col, row);
                    }
                    curRow.push(block);
                }
                shuffledGrid.push(curRow);
            }


            if (!this.isPuzzleComplete(shuffledGrid)) {
                break;
            }
        }

        this.gameGrid = shuffledGrid;
        this.isShuffled = true;
    }

    handleBlockClick(clickedBlock) {
        if (!this.isShuffled || clickedBlock.isAnchor || this.puzzleComplete) {
            return;
        }

        // debugger;
        if (this.selectedBlock !== null) {
            if (clickedBlock !== this.selectedBlock) {
                let clickedX = clickedBlock.currentX;
                let clickedY = clickedBlock.currentY;

                //set the previously selected block location to the clicked block
                this.gameGrid[this.selectedBlock.currentY][this.selectedBlock.currentX] = clickedBlock;
                clickedBlock.setCurrentCoordinates(this.selectedBlock.currentX, this.selectedBlock.currentY);

                //set the clicked block location to the previously selected block
                this.gameGrid[clickedY][clickedX] = this.selectedBlock;
                this.selectedBlock.setCurrentCoordinates(clickedX, clickedY);
                this.checkSolution();
            }
            this.selectedBlock.setSelected(false);
            this.selectedBlock = null;
            clickedBlock.setSelected(false);
        } else {
            this.selectedBlock = clickedBlock;
            clickedBlock.setSelected(true);
        }
    }

    isPuzzleComplete(gameGrid) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                let block = gameGrid[row][col];
                if (!block.isCurrentPositionCorrect()) {
                    return false;
                }
            }
        }

        return true;
    }

    checkSolution() {
        this.puzzleComplete = this.isPuzzleComplete(this.gameGrid);
    }
}

class AnchorStrategyBuilder {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.strategies = [
            this.getFourCorners,
            this.getTopBottom,
            this.getTwoSides
        ];
    }

    getFourCorners(gridSize) {
        let max = gridSize - 1;
        return [
            {x: 0, y: 0},
            {x: 0, y: max},
            {x: max, y: 0},
            {x: max, y: max}
        ];
    }

    getTopBottom(gridSize) {
        let max = gridSize - 1;
        let coords = [];

        for (let i = 0; i < gridSize; i++) {
            coords.push({x: 0, y: i});
            coords.push({x: max, y: i});
        }

        return coords;
    }

    getTwoSides(gridSize) {
        let max = gridSize - 1;
        let coords = [];

        for (let i = 0; i < gridSize; i++) {
            coords.push({x: i, y: 0});
            coords.push({x: i, y: max});
        }

        return coords;
    }

    getRandomAnchorCoords() {
        let rnd = MathUtils.getRandomInt(0, this.strategies.length);
        let coords = this.strategies[rnd](this.gridSize);
        return coords;
    }
}

class GridGenerator {
    constructor(gridSize) {
        this.gridSize = gridSize;
    }

    generateGrid() {
        let cornerColors = this.generateCornerColors();
        let gameGrid = [];
        // let firstRow = this.generateGradientStrip(cornerColors.topLeft, cornerColors.topRight);
        // let lastRow = [];
        let firstCol = this.generateGradientStrip(cornerColors.topLeft, cornerColors.bottomLeft);
        let lastCol = this.generateGradientStrip(cornerColors.topRight, cornerColors.bottomRight);

        for (let row = 0; row < this.gridSize; row++) {
            let curRow = this.generateGradientStrip(firstCol[row].color, lastCol[row].color);
            curRow.forEach((block, col) => {
                block.setProperCoordinates(col, row);
                block.setCurrentCoordinates(col, row);
            });
            gameGrid.push(curRow);
        }

        return gameGrid;
    }

    generateGradientStrip(startColor, endColor) {
        let numBlocksToGen = this.gridSize - 1;
        let strip = [];

        strip.push(new ColorBlock(startColor));

        let rStepSize = this.calculateStepSize(startColor.r, endColor.r, numBlocksToGen);
        let gStepSize = this.calculateStepSize(startColor.g, endColor.g, numBlocksToGen);
        let bStepSize = this.calculateStepSize(startColor.b, endColor.b, numBlocksToGen);

        for (let i = 1; i < numBlocksToGen; i++) {
            let r = this.calculateGradientValue(rStepSize, startColor.r, i);
            let g = this.calculateGradientValue(gStepSize, startColor.g, i);
            let b = this.calculateGradientValue(bStepSize, startColor.b, i);

            let color = new Color(r, g, b);
            strip.push(new ColorBlock(color));
        }

        strip.push(new ColorBlock(endColor));

        return strip;
    }

    calculateStepSize(startValue, endValue, numStepsInSequence) {
        let diff = endValue - startValue;
        let stepSize = Math.floor(diff / numStepsInSequence);
        return stepSize;
    }

    calculateGradientValue(stepSize, startValue, curStepIndex) {
        let stepAmt = curStepIndex * stepSize;
        let value = startValue + stepAmt;
        return value;
    }

    generateRandomColor() {
        let [r, g, b] = MathUtils.getRandomInts(0, 255, 3);
        return new Color(r, g, b);
    }

    generateCornerColors() {
        let cornerColors = {
            topLeft: null,
            bottomLeft: null,
            topRight: null,
            bottomRight: null
        };

        cornerColors.topLeft = this.generateRandomColor();
        cornerColors.bottomLeft = this.generateRandomColor();
        cornerColors.topRight = this.generateRandomColor();
        cornerColors.bottomRight = this.generateRandomColor();
        return cornerColors;
    }
}
