import DropItem from './DropItem.js'

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {name, scene, x, y, health, drops, texture, frame, depth} = data
        super(scene.matter.word, x, y, texture, frame)
    }
}