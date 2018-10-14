import Scene from './index'

import spritesImagePath from '@images/sprites.png'
import spritesAtlasPath from '@images/sprites.json'

import mapTilesImagePath from '@maps/terrainTiles.png'
import mapTilesJsonPath from '@maps/vs.json'

export class LoadingScene extends Scene {
  preload() {
    this.load.atlas('sprites', spritesImagePath, spritesAtlasPath)
    
    this.load.image('tileset', mapTilesImagePath)
    this.load.tilemapTiledJSON('vs', mapTilesJsonPath)
  }

  create() {
    console.log("Starting LoadingScene scene")
    this.scene.start('game:pending')
  }
}
