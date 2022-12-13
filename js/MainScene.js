import Player from './Player.js'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene")
    }

    preload() {
        Player.preload(this)
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/images/map.json')
        this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
    }

    create() {
        const map = this.make.tilemap({key: 'map'})
        this.map = map

        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0)
        const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0)
        const layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0)
        layer1.setCollisionByProperty({collides: true})
        this.matter.world.convertTilemapLayer(layer1)

        //this.addResources()

        this.player = new Player({scene: this.matter.world, x: 100, y: 100, texture: 'female', frame: 'townsfolk_f_idle_1'});

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
    }

    // addResources() {
    //     const resources = this.map.getObjectLayer('Resources')
    //     console.log('Resources ', resources)
    //     resources.objects.forEach( resource => {
    //         let resourceItem = new Phaser.Matter.Sprite(this.matter.world, resource.x, resource.y, 'resources', resource.type)

    //         let yOrigin = resource.properties.find(p => p.name == 'yOrigin').useDebugValue(value)
    //         resourceItem.x += resourceItem.width/2
    //         resourceItem.y -= resourceItem.height/2
    //         resourceItem = resourceItem.y + resourceItem.height * (yOrigin - 0.5)

    //         const {Body,Bodies} = Phaser.Physics.Matter.Matter
    //         let circleCollider = Bodies.circle(resourceItem.x, resourceItem.y, 12, {isSensor: false, label:'collider'})
    //         resourceItem.setExistingBody(circleCollider)
    //         resourceItem.setStatic(true)
    //         resourceItem.setOrigin(0.5,yOrigin)
    //         this.add.existing(resourceItem)
    //     })
    // }

    update() {
        this.player.update()
    }
}