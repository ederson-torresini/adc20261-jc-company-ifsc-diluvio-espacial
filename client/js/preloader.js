class preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  init(data) {
    this.nextScene = data?.nextScene;
  }

  preload() {
    this.cameras.main.setBackgroundColor("#000000");

    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);

    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });

    this.load.setPath("assets/");

    this.load.font("pixelify-sans", "pixelify-sans.ttf");

    this.load.image("background3", "background3.png");
    this.load.image("background1", "background1.png");
    this.load.image("mainlev_build", "mainlev_build.png");
    this.load.image("background2", "background2.png");
    this.load.image("props2", "props2.png");
    this.load.image("props1", "props1.png");

    this.load.tilemapTiledJSON("map", "mapabom.json");

    this.load.image("CloudsBack", "CloudsBack.png");
    this.load.image("BGFront", "BGFront.png");
    this.load.image("CloudsFront", "CloudsFront.png");
    this.load.image("Tileset", "Tileset.png");
    this.load.image("TilesExamples", "TilesExamples.png");
    this.load.image("Trees", "Trees.png");

    this.load.image("fundo3_0", "fundo3_0.png");
    this.load.image("fundo3_1", "fundo3_1.png");
    this.load.image("fundo3_2", "fundo3_2.png");
    this.load.image("plataformas3", "plataformas3.png");

    this.load.image("background", "fundo4.png");

    this.load.image("vida", "vida.png");

    this.load.spritesheet("az", "az.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("vd", "vd.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("nv", "nv.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("laser-beam", "laser-beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("asteroids", "asteroids.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("explosion", "explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("music4", "fase4/music4.mp3");
    this.load.audio("laser", "fase4/laser.mp3");
    this.load.audio("explosion", "fase4/explosion.mp3");

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "./rexvirtualjoystickplugin.min.js",
      true,
    );
  }

  create() {
    const nextScene = this.nextScene || (this.game.room ? "player" : "room");
    this.scene.stop("preloader");
    this.scene.start(nextScene);
  }
}

export default preloader;
