<template>
  <main>
    <form>
      <input ref="largeur" type="number" placeholder="Largeur du tableau" />
      <input ref="hauteur" type="number" placeholder="Hauteur du tableau" />
    </form>
    <button @click="CreateGame">Create game</button>

    <form>
      <input ref="gameId" type="text" placeholder="GameId" />
    </form>
    <button @click="JoinGame">Join game</button>
    <div id="divPlayers"></div>
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
import RedFlag from '../assets/img/Minesweeper_flag_red.svg'
import BlueFlag from '../assets/img/Minesweeper_flag_blue.svg'
const MINES_NUMBER = 10

let divPlayers = null
let clientId = null
let gameId = null
let ws = new WebSocket('ws://localhost:3000')
const dicoImages = {
  0: ImgCaseClique,
  1: ImgCase1,
  2: ImgCase2,
  3: ImgCase3,
  4: ImgCase4,
  5: ImgCase5,
  6: ImgCase6
}
export default {
  name: 'GameView',
  data() {
    return {
      gameState: {},
      userColor: null
    }
  },
  created() {
    ws.onmessage = (message) => {
      const response = JSON.parse(message.data)
      console.log(response)
      if (response.action === 'connect') {
        clientId = response.clientId
        console.log('Connected to server with id: ' + clientId)
      }
      if (response.action === 'create') {
        gameId = response.game.gameId
        console.log(
          'Game created ' +
            response.game.gameId +
            'with length ' +
            response.game.largeur +
            ' and height ' +
            response.game.hauteur
        )
      }
      if (response.action === 'join') {
        const game = response.game

        while (divPlayers.firstChild) {
          divPlayers.removeChild(divPlayers.firstChild)
        }
        this.userColor = game.clients.find((client) => client.clientId === clientId).color
        game.clients.forEach((client) => {
          const div = document.createElement('div')
          div.style.width = '200px'
          div.style.backgroundColor = client.color
          div.textContent = client.clientId
          divPlayers.appendChild(div)
        })
      }
    }
  },
  mounted() {
    divPlayers = document.getElementById('divPlayers')
    console.log(divPlayers)
    this.CreateGameState()
    this.PlaceMines()
    this.PlaceNumbers()
    this.CreateGrid()
  },
  methods: {
    /**
     * Fonction pour gèrer la création d'une partie et l'envoyer au websocket
     * @param {*} e Event
     */
    CreateGame(e) {
      const payload = {
        action: 'create',
        clientId: clientId,
        largeur: this.$refs.largeur.value,
        hauteur: this.$refs.hauteur.value
      }
      console.log(JSON.stringify(payload))
      ws.send(JSON.stringify(payload))
    },

    /**
     * Fonction pour gèrer la connexion à une partie et l'envoyer au websocket
     * @param {*} e Event
     */
    JoinGame(e) {
      console.log(clientId)
      if (!gameId) {
        gameId = this.$refs.gameId.value
      }
      const payload = {
        action: 'join',
        clientId: clientId,
        gameId: gameId
      }
      ws.send(JSON.stringify(payload))
    },

    /**
     * Fonction pour créer le plateau de jeu dans le HTML
     */
    CreateGrid() {
      let grid = document.getElementById('grid')
      let index = 0
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          let cell = document.createElement('div')
          cell.className = 'cell'
          cell.id = index
          cell.dataset.row = i
          cell.dataset.col = j
          // On gère le clique droit sur une case
          cell.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            
            //Si la case n'est pas cliquée, on affiche le drapeau
            if (!this.gameState[i][j].isClicked) {
              if (!this.gameState[i][j].isFlag) {
                cell.style.backgroundImage = `url(${RedFlag})`
                this.gameState[i][j].isFlag = true
              }
              //Si la case est déjà un drapeau, on l'enlève
              else {
                cell.style.backgroundImage = `url(${ImgCaseNonClique})`
                this.gameState[i][j].isFlag = false
              }
            }
          })

          //Si la case est une mine, on affiche l'image de la mine au clique
          if (this.gameState[i][j].isMine) {
            cell.onclick = () => {
              cell.style.backgroundImage = `url(${ImgMine})`
            }
          }
          //Si la case est un nombre, on affiche l'image du nombre au clique
          else if (this.gameState[i][j].isNumber) {
            cell.onclick = () => {
              cell.style.backgroundImage = `url(${dicoImages[this.gameState[i][j].number]})`
              this.gameState[i][j].isClicked = true
            }
            cell.right
          }
          //Si la case est vide, on affiche l'image de la case vide au clique
          else {
            cell.onclick = () => {
              this.ClickOpenSpace(i, j)
              this.gameState[cell.dataset.row][cell.dataset.col].isClicked = true
              //on affiche les nombres autour de chaque case vide
              for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                  console.log(cell.dataset.row, cell.dataset.col)
                  if (this.gameState[i][j].visited) {
                    if (i > 0 && j > 0) {
                      this.ShowNumber(i - 1, j - 1, this.gameState[i - 1][j - 1].id)
                    }
                    if (i > 0) {
                      this.ShowNumber(i - 1, j, this.gameState[i - 1][j].id)
                    }
                    if (i > 0 && j < 9) {
                      this.ShowNumber(i - 1, j + 1, this.gameState[i - 1][j + 1].id)
                    }
                    if (j > 0) {
                      this.ShowNumber(i, j - 1, this.gameState[i][j - 1].id)
                    }
                    if (j < 9) {
                      this.ShowNumber(i, j + 1, this.gameState[i][j + 1].id)
                    }
                    if (i < 9 && j > 0) {
                      this.ShowNumber(i + 1, j - 1, this.gameState[i + 1][j - 1].id)
                    }
                    if (i < 9) {
                      this.ShowNumber(i + 1, j, this.gameState[i + 1][j].id)
                    }
                    if (i < 9 && j < 9) {
                      this.ShowNumber(i + 1, j + 1, this.gameState[i + 1][j + 1].id)
                    }
                  }
                }
              }
            }
          }
          cell.style.backgroundImage = `url(${ImgCaseNonClique})`

          index++
          grid.appendChild(cell)
        }
      }
    },

    /**
     * Fonction pour créer le tableau de jeu (dictionnaire)
     */
    CreateGameState() {
      let gameState = {}
      const largeur = this.$refs.largeur.value
      const hauteur = this.$refs.hauteur.value

      let index = 0
      for (let i = 0; i < 10; i++) {
        gameState[i] = {}
        for (let j = 0; j < 10; j++) {
          gameState[i][j] = {
            isMine: false,
            isFlag: false,
            isNumber: false,
            visited: false,
            isClicked: false,
            id: index,
            number: 0
          }
          index++
        }
      }
      this.gameState = gameState
    },

    /**
     * Fonction pour placer les mines aléatoirement sur le plateau
     */
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

    /**
     * Fonction pour placer les nombres sur les cases selon le nombre de mines autour
     */
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
    },

    /**
     * Fonction récursive pour gérer le clique sur une case vide et monter tout la zone vide
     * @param {*} row La ligne de la case
     * @param {*} col La colonne de la case
     */
    ClickOpenSpace(row, col) {
      if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
        if (this.gameState[row][col].visited) {
          return
        }
        if (!this.gameState[row][col].isNumber && !this.gameState[row][col].isMine) {
          this.gameState[row][col].visited = true
          this.gameState[row][col].isClicked = true
          document.getElementById(this.gameState[row][col].id).style.backgroundImage =
            `url(${ImgCaseClique})`
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              this.ClickOpenSpace(row + i, col + j)
            }
          }
        }
      }
      return
    },

    /**
     * Fonction pour mettre à jour l'image de la case en fonction du nombre
     * @param {*} row La ligne de la case
     * @param {*} col La colonne de la case
     * @param {*} id L'id de la case
     */
    ShowNumber(row, col, id) {
      let cell = document.getElementById(id)
      cell.style.backgroundImage = `url(${dicoImages[this.gameState[row][col].number]})`
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
