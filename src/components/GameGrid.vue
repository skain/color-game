<template>
    <div>
        <div id='game-grid' v-for='row in game.gridManager.gameGrid'>
            <grid-block v-for='block in row' v-on:blockClicked='blockClicked(block)' v-bind:block='block' v-bind:blockSelected='block.isSelected'>
            </grid-block>
        </div>
    </div>
</template>

<script>
import Block from './Block.vue';

export default {
    name: 'game-grid',
    components: {
        'grid-block': Block
    },
    data () {
        return {
        };
    },
    props: ['game'],
    methods: {
        blockClicked(block) {
            this.game.gridManager.handleBlockClick(block);
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
    #game-grid {
        width: 540px;
    }

</style>
