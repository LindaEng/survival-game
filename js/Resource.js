export default class Resource extends Phaser.Physics.Matter.Sprite {
    static preload(scene) {
        scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
    }
    constructor(data) {
        let {scene, resource} = data
        super(scene.matter.world, resource.x, resource.y, 'resources', resource.properties[0].value)
        this.scene.add.existing(this)

        let yOrigin = resource.properties[1].value

        this.x += this.width/2
        this.y -= this.height/2
        this.y = this.y + this.height * (yOrigin - 0.9)

        const {Body,Bodies} = Phaser.Physics.Matter.Matter
        let circleCollider = Bodies.circle(this.x, this.y, 12, {isSensor: false, label:'collider'})

        this.setExistingBody(circleCollider)
        this.setStatic(true)
        this.setOrigin(0.5)
    }
}