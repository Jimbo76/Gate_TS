import { CST } from "../CST";
import { Sprite } from "../Sprite";
import { CharacterSprite } from "../CharacterSprite";

export class PlayScene extends Phaser.Scene {
    anna!: Phaser.Physics.Arcade.Sprite;
    hooded!: Phaser.Physics.Arcade.Sprite;
    assassins!: Phaser.Physics.Arcade.Group;
    fireAttacks!: Phaser.Physics.Arcade.Group;
    keyboard!: { [index: string]: Phaser.Input.Keyboard.Key};

    constructor() {
        super({
            key: CST.SCENCES.PLAY  
        });
    }
    
    init() {
    }

    preload() {
        this.anims.create({
            key: "left",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 9,
                end: 17
            })
        });

        this.anims.create({
            key: "down",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 18,
                end: 26
            })
        });

        this.anims.create({
            key: "up",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 0,
                end: 8
            })
        });

        this.anims.create({
            key: "right",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 27,
                end: 35
            })
        });

        this.anims.create({
            key: "blaze",
            frameRate: 50,
            frames: this.anims.generateFrameNames("daze", {
                prefix: "fire0",
                suffix: ".png",
                start: 0,
                end: 55
            }),
            showOnStart: true,
            hideOnComplete: true
        });
        this.textures.addSpriteSheetFromAtlas("hooded", {frameHeight: 64, frameWidth: 64, atlas: "characters", frame: "hooded"});

        this.load.image("terrain", "./assets/image/terrain_atlas.png");
        this.load.image("items", "./assets/image/items.png");

        this.load.tilemapTiledJSON("mappy", "./assets/maps/mappy.json");

    }

    create() {
        // debugger;
        this.anna = new CharacterSprite(this, 400, 400, "anna", 26);
        this.hooded = new CharacterSprite(this, 200, 200, "hooded", 26);
        this.fireAttacks = this.physics.add.group();
        this.assassins = this.physics.add.group({immovable: true});
        this.assassins.add(this.hooded);    

        // this.physics.add.existing() --> Manual Add

        window.hooded = this.hooded;
        window.anna = this.anna;

        /*
        GameObject Events:
            animationstart
            animationrepeat
            animationupdate
            animationcomplete
        */
       

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if(pointer.isDown) {    // Is Clicking
                let fire = this.add.sprite(pointer.worldX, pointer.worldY, "daze", "fire00.png").play("blaze");
                this.fireAttacks.add(fire);
                fire.on("animation.complete", () => {
                    fire.destroy();
                })
            } 

            console.log(pointer.x + " and the y " + pointer.y);
        })

        this.physics.world.addCollider(this.anna, this.hooded, (anna: CharacterSprite, hooded: CharacterSprite) => {
            anna.hp--;

            if(anna.hp <= 0) {
                anna.destroy();
            }
            
            hooded.destroy();

            console.log("colliding");
        });

        this.physics.world.addCollider(this.fireAttacks, this.assassins, (fireAttacks: Phaser.Physics.Arcade.Sprite, hooded: Phaser.Physics.Arcade.Sprite) => {
            fireAttacks.destroy();
            hooded.destroy();

            for(let i = 0; i < 2; i++){
                this.assassins.add(new CharacterSprite(this, 200, 200, "hooded", 26));
            }
        });

        let mappy = this.add.tilemap("mappy");

        let terrain = mappy.addTilesetImage("terrain_atlas", "terrain");
        let items = mappy.addTilesetImage("items");

        // Layers
        let botLayer = mappy.createStaticLayer("bot", [terrain], 0, 0).setDepth(-1);
        let topLayer = mappy.createDynamicLayer("top", [terrain], 0, 0);

        // Map Collisions
        this.physics.add.collider(this.anna, topLayer);
            // By Tile Property
            topLayer.setCollisionByProperty({collides:true});
            // By Tile Indexes
            topLayer.setCollision([269,270,271,301,302,303,333,334,335]);
            
        // Map Events
            // By Location
            topLayer.setTileLocationCallback(10, 8, 1, 1, () => {
                alert("The Sword Calls to You!");

                // Top prevent message from popping-up, need to call same function recursively
                //@ts-ignore
                topLayer.setTileLocationCallback(10, 8, 1, 1, null);
            })
            // By Index
            topLayer.setTileIndexCallback([272,273,274,304,305,306,336,337,338], () => {
                console.log("Stop Stepping in Lava");
            }, this);

            // Interactive Items from Object Layer
            let items = mappy.createFromObjects("pickup", 1114, { key: CST.SPRITES.CAT }).map((sprite: Phaser.GameObjects.Sprite) => {
                sprite.setScale(2);
                sprite.setInteractive();
            })

            this.input.on("gameobjectdown", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Sprite) => {
                obj.destroy();
            })

            this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {

                // Pixel Position to Tile Position
                let tile = mappy.getTileAt(mappy.worldToTileX(pointer.x), mappy.worldToTileY(pointer.y))

                if(tile) {
                    console.log(tile);
                }
            })

            this.cameras.main.startFollow(this.anna);
            this.physics.world.setBounds(0, 0, mappy.widthInPixels, mappy.heightInPixels);

            // Show Layer Hit Boxes
            // topLayer.renderDebug(this.add.graphics());
    }

    update(time: number, delta: number) {   // Delta 16.666 @ 60 fps

        for(let i = 0; i < this.assassins.getChildren().length; i++) {
            this.physics.accelerateToObject(this.assassins.getChildren()[i], this.anna);
        }

        if(this.anna.active === true) {
            if(this.keyboard.D.isDown === true) {
                this.anna.setVelocityX(64);
                this.anna.play("right", true);
            }

            if (this.keyboard.W.isDown === true) {
                this.anna.setVelocityY(-64);
                this.anna.play("up", true);
            }

            if(this.keyboard.A.isDown === true){
                this.anna.setVelocityX(-64);
                this.anna.anims.playReverse("left", true);
            }

            if (this.keyboard.S.isDown === true) {
                this.anna.setVelocityY(64);
                this.anna.play("down", true);
            }

            if(this.keyboard.A.isUp && this.keyboard.D.isUp) { // Not Moving on X-Axis
                this.anna.setVelocityX(0);
                // this.anna.anims.stop();
            }

            if(this.keyboard.W.isUp && this.keyboard.S.isUp) { // Not Moving on Y-Axis
                this.anna.setVelocityY(0);
                // this.anna.anims.stop();
            }
        }
    }
}