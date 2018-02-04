<template>
    <div>
        <div id='game-grid' v-bind:style='{"width": width}'>
            <div class='grid-row' v-for='row in game.gridManager.gameGrid'>
                <grid-block v-for='block in row' v-on:blockClicked='blockClicked(block)'
                    v-bind:block='block' v-bind:blockSize='blockSize'
                    v-bind:debug='game.debug' v-bind:blockSelected='block.isSelected'>
                </grid-block>
            </div>
        </div>
        <h2 v-if='showIntro()'>Ooh, so pretty! You <i>shuffle</i>?</h2>
        <h2 v-if='showShuffle()'>Oh noooo! <i>Fix it</i>!</h2>
        <h2 v-if='showComplete()'>You got it!</h2>
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
            width: Math.floor((this.game.gridManager.gridSize * BLOCK_SIZE) * 1.1) - 1 + 'px',
            blockSize: BLOCK_SIZE
        };
    },
    props: ['game'],
    methods: {
        blockClicked(block) {
            this.game.gridManager.handleBlockClick(block);
        },
        getBlockInlineStyle(block) {
            return block.getBlockInlineStyle();
        },
        showIntro() {
            return this.game.gameStarted && !this.game.gridManager.isShuffled;
        },
        showShuffle() {
            return this.game.gameStarted && this.game.gridManager.isShuffled && !this.game.gridManager.puzzleComplete;
        },
        showComplete() {
            return this.game.gridManager.puzzleComplete;
        }
    },
    computed: {
    }
};
</script>

<style scoped>
    #game-grid {
        display: inline-block;
    }

    h2 {
        display: inline-block;
        vertical-align: top;
    }
</style>
