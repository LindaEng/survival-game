import MatterEntity from "./MatterEntity.js"

export default class Resource extends MatterEntity{
    static preload(scene) {
        scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
        scene.load.audio('tree', 'assets/audio/tree.mp3')
        scene.load.audio('rock', 'assets/audio/rock.mp3')
        scene.load.audio('bush', 'assets/audio/bush.mp3')
        scene.load.audio('pickup', 'assets/audio/pickup.mp3')
    }

    constructor(data) {
        let {scene, resource} = data
        let drops = JSON.parse(resource.properties.find(item => item.name == 'drops').value)
        let depth = resource.properties.find(item => item.name == 'depth').value
        let name = resource.properties.find(item => item.name === 'type').value 

        super({scene, x: resource.x, y: resource.y, texture: 'resources', frame: name, drops, depth, health: 5, name})

        this.scene.add.existing(this)

        let yOrigin = resource.properties.find(item => item.name === 'yOrigin').value
        this.y = this.y + this.height * (yOrigin - 0.9)

        const {Bodies} = Phaser.Physics.Matter.Matter
        let circleCollider = Bodies.circle(this.x, this.y, 12, {isSensor: false, label:'collider'})
        this.setExistingBody(circleCollider)
        
        this.setStatic(true)
        this.setOrigin(0.5)
    }

}
