import Color from './Color';

export default class ColorBlock {
    constructor(color, properX, properY) {
        this.color = color;
        this.setProperCoordinates(properX, properY);
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

    getBlockInlineStyle() {
        return {
            'background-color': this.getRGBString(),
        };
    }

    isCoordinateMatch(checkX, checkY) {
        return checkX == this.properX && checkY == this.properY;
    }

    setProperCoordinates(x, y) {
        this.properX = x;
        this.properY = y;
    }

    setSelected(value) {
        this.isSelected = value;
    }
}
