<template>
  <div id="app">
      <div class='pure-g'>
          <h1 class='pure-u-1-1'>Color Game</h1>
          <div class='pure-u-1-1'>
              <game-grid v-bind:game='game'></game-grid>
          </div>
          <p class='pure-u-1-1'>
              <button class='pure-button' v-on:click='newGameClicked'>New Game</button>
              <button class='pure-button' v-on:click='shuffleClicked' v-bind:disabled='shuffleDisabled'>Shuffle</button>
              <button class='pure-button' v-on:click='debugClicked'>Debug</button>
          </p>
      </div>
  </div>
</template>

<script>
import ColorGame from './ColorGame';
import GameGrid from './components/GameGrid.vue';

const colorGame = new ColorGame(10);
colorGame.startGame();

export default {
    name: 'app',
    components: {
        'game-grid': GameGrid
    },
    data () {
        return {
            game: colorGame
        };
    },
    methods: {
        newGameClicked() {
            this.game.startGame();
        },
        shuffleClicked() {
            this.game.shuffle();
        },
        debugClicked() {
            this.game.debug = !this.game.debug;
        }
    },
    computed: {
        shuffleDisabled() {
            return this.game.isStarted && this.game.isShuffled;
        }
    }
};
</script>

<style>
    #app {
        margin: 0px 10px 10px 20px;
    }
</style>
