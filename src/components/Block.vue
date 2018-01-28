<template>
    <div v-bind:class='cssClassObject' v-on:click='blockClicked(block)' v-bind:style="block.getBlockInlineStyle()">
        <div class='inner-grid-block' v-bind:style="block.getBlockInlineStyle()">
            {{block.properX + ', ' + block.properY }}
        </div>
    </div>
</template>

<script>

export default {
    name: 'block',

    data () {
        return {
        };
    },
    props: ['block'],
    methods: {
        blockClicked() {
            this.$emit('blockClicked', this.block);
        }
    },
    computed: {
        cssClassObject: function () {
            return {
                'grid-block': true,
                'selected': this.block.isSelected
            };
        }
    }
};
</script>

<style scoped>
    .grid-block {
        float: left;
        width: 50px;
        height: 50px;
    }

    .inner-grid-block {
        float: left;
        width: 50px;
        height: 50px;
    }

    .grid-block.selected .inner-grid-block{
        width: 60px;
        height: 60px;
        z-index: 100;
        top: -5px;
        left: -5px;
        position: relative;
    }
</style>
