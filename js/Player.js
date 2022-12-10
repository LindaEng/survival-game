export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data
        super(scene.matter.world, x, y, texture, frame)
        this.scene.add.existing(this)
    }
}