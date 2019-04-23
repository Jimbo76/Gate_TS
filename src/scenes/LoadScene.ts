import { CST } from "../CST";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENCES.LOAD
        });
    }

    init() {
    }

    loadImages() {
        this.load.setPath("./assets/image");

        for(let prop in CST.IMAGES) {
            this.load.image(CST.IMAGES[prop], CST.IMAGES[prop]);
        }
    }

    loadAudio() {
        this.load.setPath("./assets/audio");

        for(let prop in CST.AUDIO) {
            this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop]);
        }
    }

    loadSprites(frameConfig?: Phaser.Loader.FileTypes.ImageFrameConfig) {
        this.load.setPath("./assets/sprite");

        for(let prop in CST.SPRITES) {
            this.load.spritesheet(CST.SPRITES[prop], CST.SPRITES[prop], frameConfig);
        }
    }

    preload() {

        this.load.spritesheet("anna", "./assets/sprite/anna.png", { frameHeight: 64, frameWidth: 64 });
        this.load.spritesheet("rapier", "./assets/sprite/WEAPON_rapier.png", {frameWidth: 192, frameHeight: 192})

        // Load Atlases
        this.load.atlas("characters", "./assets/atlas/characters.png", "./assets/atlas/characters.json");
        this.load.atlas("daze", "./assets/atlas/daze.png", "./assets/atlas/daze.json");

        // Load Images, Spritesheets, Sound
        this.loadImages();
        this.loadAudio();
        this.loadSprites({
            frameHeight: 32,
            frameWidth: 32
        });

        // Create Loading Bar
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff // White
            }
        });

        // Simulate Large Load
        /*
        for(let i=0; i < 100; i++) {
            this.load.spritesheet("cat"+i, "./dist/assets/sprite/cat.png", {
                frameHeight: 32,
                frameWidth: 32
            }); 
        }
        */
       
        /* Loader Events:
            complete - When Done Loading Everything
            progress - Loader Number Progress in Decimal
        */
       this.load.on("progress", (percent: number) => {
           loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
           console.log(percent);
       });
       this.load.on("complete", () => {
        // this.scene.start(CST.SCENCES.MENU);
       }); 
       this.load.on("load", (file: Phaser.Loader.File) => {
           console.log(file.src);
       });
    }

    create() {
        this.scene.start(CST.SCENCES.MENU);
    }

    update() {
    }
}