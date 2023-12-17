<template>
  <main>
    <div class="container">
      <div id="grid"></div>
    </div>
  </main>
</template>

<script>
import ImgMine from '../assets/img/mine.png'
import ImgCaseNonClique from '../assets/img/Minesweeper_unopened_square.svg'
import ImgCaseClique from '../assets/img/Minesweeper_0.svg'
import ImgCase1 from '../assets/img/Minesweeper_1.svg'
import ImgCase2 from '../assets/img/Minesweeper_2.svg'
import ImgCase3 from '../assets/img/Minesweeper_3.svg'
import ImgCase4 from '../assets/img/Minesweeper_4.svg'
import ImgCase5 from '../assets/img/Minesweeper_5.svg'
import ImgCase6 from '../assets/img/Minesweeper_6.svg'

const MINES_NUMBER = 10
export default {
  name: 'GameView',
  data() {
    return {
      gameState: {}
    }
  },
  mounted() {
    this.CreateGameState()
    this.PlaceMines()
    this.PlaceNumbers()
    this.CreateGrid()
  },
  methods: {
    CreateGrid() {
      let grid = document.getElementById('grid')
      let index = 0
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          let cell = document.createElement('div')
          cell.className = 'cell'
          cell.id = index
          if (this.gameState[i][j].isMine) {
            cell.onclick = function () {
              cell.style.backgroundImage = `url(${ImgMine})`
            }
          } 
          else if (this.gameState[i][j].isNumber) {
            switch (this.gameState[i][j].number) {
              case 1:
                cell.onclick = function () {
                  cell.style.backgroundImage = `url(${ImgCase1})`
                }
                break
              case 2:
                cell.onclick = function () {
                  cell.style.backgroundImage = `url(${ImgCase2})`
                }
                break
              case 3:
                cell.onclick = function () {
                  cell.style.backgroundImage = `url(${ImgCase3})`
                }
                break
              case 4:
                cell.onclick = function () {
                  cell.style.backgroundImage = `url(${ImgCase4})`
                }
                break
              case 5:
                cell.onclick = function () {
                  cell.style.backgroundImage = `url(${ImgCase5})`
                }
                break
              case 6:
                cell.onclick = function () {
                  cell.style.backgroundImage = `url(${ImgCase6})`
                }
                break
            }
          } 
          else {
            cell.onclick = function () {
              cell.style.backgroundImage = `url(${ImgCaseClique})`
            }
          }
          cell.style.backgroundImage = `url(${ImgCaseNonClique})`

          index++
          grid.appendChild(cell)
        }
      }
    },
    CreateGameState() {
      let gameState = {}
      for (let i = 0; i < 10; i++) {
        gameState[i] = {}
        for (let j = 0; j < 10; j++) {
          gameState[i][j] = {
            isMine: false,
            isClique: false,
            isFlag: false,
            isNumber: false,
            number: 0
          }
        }
      }
      this.gameState = gameState
    },
    PlaceMines() {
      let mines = 0
      while (mines < MINES_NUMBER) {
        let x = Math.floor(Math.random() * 10)
        let y = Math.floor(Math.random() * 10)
        if (!this.gameState[x][y].isMine) {
          this.gameState[x][y].isMine = true
          mines++
        }
      }
    },
    PlaceNumbers() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (!this.gameState[i][j].isMine) {
            let number = 0
            if (i > 0 && j > 0 && this.gameState[i - 1][j - 1].isMine) {
              number++
            }
            if (i > 0 && this.gameState[i - 1][j].isMine) {
              number++
            }
            if (i > 0 && j < 9 && this.gameState[i - 1][j + 1].isMine) {
              number++
            }
            if (j > 0 && this.gameState[i][j - 1].isMine) {
              number++
            }
            if (j < 9 && this.gameState[i][j + 1].isMine) {
              number++
            }
            if (i < 9 && j > 0 && this.gameState[i + 1][j - 1].isMine) {
              number++
            }
            if (i < 9 && this.gameState[i + 1][j].isMine) {
              number++
            }
            if (i < 9 && j < 9 && this.gameState[i + 1][j + 1].isMine) {
              number++
            }
            if (number > 0) {
              this.gameState[i][j].isNumber = true
              this.gameState[i][j].number = number
            }
          }
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
body {
  background-color: gray;
}
</style>
