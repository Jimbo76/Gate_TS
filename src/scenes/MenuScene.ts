import { CST } from "../CST";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENCES.MENU
        });
    }

    init() {
        
    }

    preload() {

    }

    create() {
        
        // Create Images
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, CST.IMAGES.LOGO).setDepth(1);
        this.add.image(0,0, CST.IMAGES.TITLE).setOrigin(0, 0).setDepth(0);
        let playButton: Phaser.GameObjects.Image = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, CST.IMAGES.PLAY).setDepth(1);
        let optionsButton: Phaser.GameObjects.Image = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, CST.IMAGES.OPTIONS).setDepth(1);

        // Create Sprites
        let hoverSprite: Phaser.GameObjects.Sprite = this.add.sprite(100,100, CST.SPRITES.CAT);
        hoverSprite.setScale(2);
        hoverSprite.setVisible(false);

        // Create Audio
        // this.sound.pauseOnBlur = false;
        this.sound.play(CST.AUDIO.TITLE, {
            loop: true
        });

        // Create Animations
        this.anims.create({
            key: "walk",
            frameRate: 4,
            repeat: -1,  // Repeat Forever
            frames: this.anims.generateFrameNumbers(CST.SPRITES.CAT, {
                frames: [0, 1, 2, 3]
            })
        })

        /*
            PointerEvents:
                pointerover - Hovering
                pointerout - Not Hovering
                pointerup - Click and Release
                pointerdown - Just Click
        */

        // Config Play Button
        playButton.setInteractive();
        playButton.on("pointerover", () => {
            hoverSprite.setVisible(true);
            hoverSprite.x = playButton.x - playButton.width;
            hoverSprite.y = playButton.y;
            hoverSprite.anims.play("walk");
        });
        playButton.on("pointerout", () => {
            hoverSprite.setVisible(false);
            // hoverSprite.anims.pause();
        });
        playButton.on("pointerup", () => {
            this.scene.start(CST.SCENCES.PLAY);
        });

        // Config Options Button
        optionsButton.setInteractive();
        optionsButton.on("pointerover", () => {
            hoverSprite.setVisible(true);
            hoverSprite.x = optionsButton.x - optionsButton.width;
            hoverSprite.y = optionsButton.y;
            hoverSprite.anims.play("walk");
        });
        optionsButton.on("pointerout", () => {
            hoverSprite.setVisible(false);
            // hoverSprite.anims.pause();
        });
        optionsButton.on("pointerup", () => {
            // this.scene.launch();
        });
    }

    update() {
    }
}