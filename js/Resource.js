import DropItem from './DropItem.js'

export default class Resource extends Phaser.Physics.Matter.Sprite {
    static preload(scene) {
        scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
        scene.load.audio('tree', 'assets/audio/tree.mp3')
        scene.load.audio('rock', 'assets/audio/rock.mp3')
        scene.load.audio('bush', 'assets/audio/bush.mp3')
    }
    constructor(data) {
        let {scene, resource} = data
        super(scene.matter.world, resource.x, resource.y, 'resources', resource.properties.find(item => item.name === 'type').value)
        this.scene.add.existing(this)
        //adding health to item
        this.health = 5
        this.drops = JSON.parse(resource.properties.find(item => item.name == 'drops').value)
        //required when working with collider
        this.name = resource.properties.find(item => item.name === 'type').value
        console.log(this.name , 'NAMAMAME')
        //assigning audio to sound
        this.sound = this.scene.sound.add(this.name)
        let yOrigin = resource.properties.find(item => item.name === 'yOrigin').value

        this.x += this.width/2
        this.y -= this.height/2
        this.y = this.y + this.height * (yOrigin - 0.9)

        const {Body,Bodies} = Phaser.Physics.Matter.Matter
        let circleCollider = Bodies.circle(this.x, this.y, 12, {isSensor: false, label:'collider'})

        this.setExistingBody(circleCollider)
        this.setStatic(true)
        this.setOrigin(0.5)
    }

    get dead() {
        return this.health <= 0
    }

    hit = () => {
        if(this.sound) this.sound.play()
        this.health--
        console.log(`Hitting ${this.nae} Health: ${this.health}`)
        if(this.dead) {
            console.log('DROPS ', this.drops)
            this.drops.forEach(drop => new DropItem({scene: this.scene, x: this.x, y: this.y, frame: drop}))
        }
    }
}
