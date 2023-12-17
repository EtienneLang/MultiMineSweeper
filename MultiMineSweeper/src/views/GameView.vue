<template>
  <main>
    <div class="container">
      <div id="grid"></div>
    </div>

  </main>
</template>

<script>
import ImgCaseNonClique from '../assets/img/Minesweeper_unopened_square.svg'
import ImgCaseClique from '../assets/img/Minesweeper_0.svg'
export default {
  name: 'GameView',
  data() {
    return {}
  },
  mounted() {
    this.CreateGrid()
  },
  methods: {
    CreateGrid() {
      var grid = document.getElementById('grid')
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          var cell = document.createElement('div')
          cell.className = 'cell'
          cell.id = j
          cell.style.backgroundImage = `url(${ImgCaseNonClique})`
          cell.onclick = function() {
            this.style.backgroundImage = `url(${ImgCaseClique})`;
          }
          grid.appendChild(cell)
        }
      }
    }
  }
}
</script>

<style>
.cell {
  width: 25px;
  height: 25px;
  border: 1px solid black;
  display: inline-block;
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.container {
  width: 1200px;
}
#grid {
  display: grid;
  grid-template-columns: repeat(10, 25px);
  grid-template-rows: repeat(10, 25px);
  grid-gap: 0px;
}
</style>
