<template>
    <div v-bind:class='outerCssClassObject' class='grid-block' v-on:click='blockClicked(block)' v-bind:style="outerBlockInlineStyle">
        <div class='inner-grid-block' v-bind:class='innerCssClassObject' v-bind:style="innerBlockInlineStyle">
            <div v-if='debug'>
                {{block.properX + ', ' + block.properY }}
                <br />
                {{block.currentX + ', ' + block.currentY }}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'block',
    created() {
    },
    data () {
        return {
        };
    },
    props: ['block', 'blockSize', 'debug'],
    methods: {
        blockClicked() {
            this.$emit('blockClicked', this.block);
        }
    },
    computed: {
        outerCssClassObject: function () {
            return {
                'selected': this.block.isSelected
            };
        },
        innerCssClassObject: function () {
            return {
                'anchor': this.block.isAnchor
            }
        },
        outerBlockInlineStyle: function () {
            let blockSize = this.blockSize;

            let bpx = blockSize + 'px';
            return {
                'background-color': this.block.getRGBString(),
                'height': bpx,
                'width': bpx
            };
        },
        innerBlockInlineStyle: function () {
            return {
                'background-color': this.block.getRGBString()
            };
        }
    }
};
</script>

<style scoped>
    .grid-block {
        float: left;
    }

    .inner-grid-block {
        float: left;
        height: 100%;
        width: 100%;
    }

    .inner-grid-block.anchor {
        border: solid 1px white;
        height: 95%;
        width: 95%;
    }

    .grid-block.selected .inner-grid-block{
        z-index: 100;
        top: -5%;
        left: -5%;
        height: 110%;
        width: 110%;
        position: relative;
    }
</style>
