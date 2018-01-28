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
    }

    setNewGrid() {
        this.isShuffled = false;
        let generator = new GridGenerator(this.gridSize);
        this.gameGrid = generator.generateGrid();
        this.puzzleComplete = false;
    }

    shuffle() {
        /**
        This is pretty crazy so I'll explain. My thinking here was to create a range representing each block in the original grid.
        I then shuffle this range to get a randomized list of indexes into a single-dimensional array of blocks.
        It gets complicated because I actually store the blocks in a 2-dimensional array so I use modulus and division to convert back and forth between the two.

        Pretty sure there's a better way but since I was just kind of improvising and figuring out what I even wanted as I went it's ok for now...
        **/
        let gridRange = [];
        for (let i = 0; i < this.numBlocks; i++) {
            gridRange.push(i);
        }
        let shuffledGridRange = MathUtils.shuffleArray(gridRange);
        let shuffledGrid = [];
        for (let row = 0; row < this.gridSize; row++) {
            let curRow = [];
            for (let col = 0; col < this.gridSize; col++) {
                let shuffledIndex = (row * this.gridSize) + col;
                let shuffledValue = shuffledGridRange[shuffledIndex];
                let origRow = shuffledValue % this.gridSize;
                let origCol = Math.floor(shuffledValue / this.gridSize);
                let block = this.gameGrid[origRow][origCol];
                block.setCurrentCoordinates(row, col);
                curRow.push(block);
            }
            shuffledGrid.push(curRow);
            this.puzzleComplete = false;
        }

        this.gameGrid = shuffledGrid;
        this.isShuffled = true;
    }

    handleBlockClick(clickedBlock) {
        if (!this.isShuffled) {
            return;
        }

        if (this.selectedBlock) {
            if (clickedBlock !== this.selectedBlock) {
                let clickedX = clickedBlock.currentX;
                let clickedY = clickedBlock.currentY;

                this.gameGrid[this.selectedBlock.currentX][this.selectedBlock.currentY] = clickedBlock;
                clickedBlock.setCurrentCoordinates(this.selectedBlock.currentX, this.selectedBlock.currentY);
                this.gameGrid[clickedX][clickedY] = this.selectedBlock;
                this.selectedBlock.setCurrentCoordinates(clickedX, clickedY);
            }
            this.selectedBlock.setSelected(false);
            this.selectedBlock = null;
            clickedBlock.setSelected(false);
        } else {
            this.selectedBlock = clickedBlock;
            clickedBlock.setSelected(true);
        }
    }

    checkSolution() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                let block = this.gameGrid[row][col];
                if (block.currentX !== block.properX || block.currentY !== block.currentY) {
                    return;
                }
            }
        }

        this.puzzleComplete = true;
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
