class preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  init() {
    this.add.image(160, 120, "start");

    const bar = this.add.rectangle(0, 220, 4, 20, 0xffccff).setOrigin(0, 0);

    this.load.on("progress", (progress) => {
      bar.width = 320 * progress;
      if (progress < 0.25) bar.fillColor = 0xcccccc;
      else if (progress < 0.5) bar.fillColor = 0x88cc88;
      else if (progress < 0.75) bar.fillColor = 0x44cc44;
      else bar.fillColor = 0x00cc00;
    });
  }

  preload() {
    this.load.setPath("assets/");

    this.load.font("pixelify-sans", "pixelify-sans.ttf");

    this.load.image("background3", "cave/background3.png");
    this.load.image("background1", "cave/background1.png");
    this.load.image("mainlev_build", "cave/mainlev_build.png");
    this.load.image("background2", "cave/background2.png");
    this.load.image("props2", "cave/props2.png");
    this.load.image("props1", "cave/props1.png");

    this.load.tilemapTiledJSON("map", "mapabom.json");

    this.load.image("CloudsBack", "fase2/CloudsBack.png");
    this.load.image("BGFront", "fase2/BGFront.png");
    this.load.image("CloudsFront", "fase2/CloudsFront.png");
    this.load.image("Tileset", "fase2/Tileset.png");
    this.load.image("TilesExamples", "fase2/TilesExamples.png");
    this.load.image("Trees", "fase2/Trees.png");

    this.load.image("fundo3_0", "fase3/fundo3_0.png");
    this.load.image("fundo3_1", "fase3/fundo3_1.png");
    this.load.image("fundo3_2", "fase3/fundo3_2.png");
    this.load.image("plataformas3", "fase3/plataformas3.png");
    this.load.image("colisao3", "fase3/colisao3.png");

    this.load.image("background", "asteroids/fundo4.png");

    this.load.image("vida", "asteroids/vida.png");

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
    this.load.spritesheet("laser-beam", "asteroids/laser-beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("asteroids", "asteroids/asteroids.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("explosion", "asteroids/explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("music4", "asteroids/music4.mp3");
    this.load.audio("laser", "asteroids/laser.mp3");
    this.load.audio("explosion", "asteroids/explosion.mp3");
  }

  create() {
    this.scene.stop("preloader");
    this.scene.start("scene2");
  }
}

export default preloader;
