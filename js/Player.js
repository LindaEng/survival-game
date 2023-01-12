    export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data
        super(scene, x, y, texture, frame)
        this.touching = []
        this.scene.add.existing(this)
        //weapon - pickaxe is at cell 162
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162)
        //scale the size of weapon down
        this.spriteWeapon.setScale(0.8)
        //set the origin
        this.spriteWeapon.setOrigin(0.25, 0.75)
        this.scene.add.existing(this.spriteWeapon)

        const {Body, Bodies} = Phaser.Physics.Matter.Matter
        let playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider'})
        let playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor'})
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35
        })
        this.setExistingBody(compoundBody)
        this.setFixedRotation()
        //method to handle when player collides with game object
        this.CreateMiningCollisions(playerSensor)
        this.CreatePickupCollisions(playerCollider)
        //flip our character if our pointer is facing left
        this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x))
    }

    static preload(scene) {
        scene.load.atlas('female', 'assets/images/female.png', 'assets/images/female_atlas.json')
        scene.load.animation('female_anim', 'assets/images/female_anim.json')
        scene.load.spritesheet('items', 'assets/images/items.png', {frameWidth:32, frameHeight:32})
    }

    get velocity() {
        return this.body.velocity
    }

    update() {
        this.anims.play('female_walk', true)
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.inputKeys.left.isDown){
            playerVelocity.x = -1;
        }else if(this.inputKeys.right.isDown){
            playerVelocity.x = 1;
        }else if(this.inputKeys.up.isDown){
            playerVelocity.y = -1;
        }else if(this.inputKeys.down.isDown){
            playerVelocity.y = 1;
        }
        playerVelocity.normalize()
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play('female_walk', true)
        } else {
            this.anims.play('female_idle', true)
        }
        this.spriteWeapon.setPosition(this.x, this.y)
        this.weaponRotate()
    }

    weaponRotate() {
        //mouse click
        let pointer = this.scene.input.activePointer
        if(pointer.isDown) {
            this.weaponRotation += 6
        } else {
            this.weaponRotation = 0
        }
        if(this.weaponRotation > 100) {
            this.wackStuff()
            this.weaponRotation = 0
        }
        if(this.flipX) {
            //flip weapon to left
            this.spriteWeapon.setAngle(-this.weaponRotation - 90)
        } else {
            //if we are facing right
            this.spriteWeapon.setAngle(this.weaponRotation)
        }
    }

    CreateMiningCollisions(playerSensor) {
        //when we move towards a game object add to array
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return
                this.touching.push(other.gameObjectB)
                console.log(this.touching.length, other.gameObjectB.name)
            },
            context: this.scene,
        })
        //when we move away from a game object -> remove from array
        this.scene.matterCollision.addOnCollideEnd( {
            objectA: [playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject !== other.gameObjectB)
            }
        })
    }

    CreatePickupCollisions(playerCollider) {
        //when we move towards a game object add to array
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup()
            },
            context: this.scene,
        })
        //when we move away from a game object -> remove from array
        this.scene.matterCollision.addOnCollideActive( {
            objectA: [playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup() 
            }
        })
    }
    wackStuff() {
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead)
        this.touching.forEach(gameObject => {
            gameObject.hit()
            if(gameObject.dead) gameObject.destroy()
        })
    }
}
