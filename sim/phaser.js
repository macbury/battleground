require('./mock_dom')
const Phaser = require('phaser')

export default function boot(callback) {
  document.addEventListener('DOMContentLoaded', () => {
    const game = new Phaser.Game({
      type: Phaser.HEADLESS,
      parent: document.querySelector("#game"),
      width: 800,
      height: 600,
      fps: {
        forceSetTimeOut: true
      },
      physics: {
        default: "arcade",
        matter: {
          gravity: {
            x: 0,
            y: 0
          },
          debug: true
        }
      },
      callbacks: {
        postBoot: () => {
          callback(game)
        }
      }
    })

    game.hasFocus = true
    game.texturesReady()
  })
}
