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

    this.load.image("background3", "diluvioespacial/fase1/background3.png");
    this.load.image("background1", "diluvioespacial/fase1/background1.png");
    this.load.image("mainlev_build", "diluvioespacial/fase1/mainlev_build.png");
    this.load.image("background2", "diluvioespacial/fase1/background2.png");
    this.load.image("props2", "diluvioespacial/fase1/props2.png");
    this.load.image("props1", "diluvioespacial/fase1/props1.png");

    this.load.tilemapTiledJSON("map", "diluvioespacial/mapabom.json");

    this.load.image("CloudsBack", "diluvioespacial/fase2/CloudsBack.png");
    this.load.image("BGFront", "diluvioespacial/fase2/BGFront.png");
    this.load.image("CloudsFront", "diluvioespacial/fase2/CloudsFront.png");
    this.load.image("Tileset", "diluvioespacial/fase2/Tileset.png");
    this.load.image("TilesExamples", "diluvioespacial/fase2/TilesExamples.png");
    this.load.image("Trees", "diluvioespacial/fase2/Trees.png");

    this.load.image("fundo3_0", "diluvioespacial/fase3/fundo3_0.png");
    this.load.image("fundo3_1", "diluvioespacial/fase3/fundo3_1.png");
    this.load.image("fundo3_2", "diluvioespacial/fase3/fundo3_2.png");
    this.load.image("plataformas3", "diluvioespacial/fase3/plataformas3.png");

    this.load.image("background", "fase4/fundo4.png");

    this.load.image("vida", "fase4/vida.png");

    this.load.spritesheet("az", "personagens/az.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("vd", "personagens/vd.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("nv", "personagens/nv.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("laser-beam", "fase4/laser-beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("asteroids", "fase4/asteroids.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("explosion", "fase4/explosion.png", {
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
