<template>
    <div>
        <div id='game-grid' v-bind:style='{"width": width}'>
            <div class='grid-row' v-for='row in game.gridManager.gameGrid'>
                <grid-block v-for='block in row' v-on:blockClicked='blockClicked(block)' v-bind:block='block' v-bind:blockSize='blockSize' v-bind:blockSelected='block.isSelected'>
                </grid-block>
            </div>
        </div>
        <h2 v-if='puzzleComplete'>You got it!</h2>
    </div>
</template>

<script>
import Block from './Block.vue';
const BLOCK_SIZE = 50;

export default {
    name: 'game-grid',
    created() {

    },
    components: {
        'grid-block': Block
    },
    data () {
        return {
            puzzleComplete: false,
            width: Math.floor((this.game.gridManager.gridSize * BLOCK_SIZE) * 1.1) - 1 + 'px',
            blockSize: BLOCK_SIZE
        };
    },
    props: ['game'],
    methods: {
        blockClicked(block) {
            this.game.gridManager.handleBlockClick(block);
            if (this.game.gridManager.checkSolution()) {

            }
        },
        getBlockInlineStyle(block) {
            return block.getBlockInlineStyle();
        }
    },
    computed: {

    }
};
</script>

<style scoped>

</style>
