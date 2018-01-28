import Color from './Color';

export default class ColorBlock {
    constructor(color) {
        this.color = color;
        this.properX = this.properY = null;
        this.currentX = this.currentY = null;
        this.isSelected = false;
    }

    getRGBString() {
        return 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
    }

    getBlockCSSClass() {
        console.log(this);
        return {
            'grid-block': true,
            'selected': this.selected
        };
    }

    getBlockInlineStyle(blockSize) {
        let bpx = blockSize + 'px';
        console.log(bpx);
        return {
            'background-color': this.getRGBString(),
            'height': bpx,
            'width': bpx
        };
    }

    isCoordinateMatch(checkX, checkY) {
        return checkX == this.properX && checkY == this.properY;
    }

    setProperCoordinates(x, y) {
        this.properX = x;
        this.properY = y;
    }

    setCurrentCoordinates(x, y) {
        this.currentX = x;
        this.currentY = y;
    }

    setSelected(value) {
        this.isSelected = value;
    }
}
