export default class DropItem extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, frame} = data
        super(scene.matter.world, x, y, 'items', frame)
        this.scene.add.existing(this)
    }
}