class preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.add.image(160, 120, "start");

    const bar = this.add.rectangle(0, 220, 4, 20, 0xffccff).setOrigin(0, 0);

    this.load.on("progress", (progress) => {
      bar.width = 320 * progress;
      if (progress < 0.25) bar.fillColor = 0xcccccc;
      else if (progress < 0.5) bar.fillColor = 0x88cc88;
      else if (progress < 0.75) bar.fillColor = 0x44cc44;
      else bar.fillColor = 0x00cc00;
    });

    this.load.setPath("assets/");

    this.load.font("pixelify-sans", "pixelify-sans.ttf");

    this.load.image(
      "background3",
      "diluvioespacial/assets/fase1/background3.png",
    );
    this.load.image(
      "background1",
      "diluvioespacial/assets/fase1/background1.png",
    );
    this.load.image(
      "mainlev_build",
      "diluvioespacial/assets/fase1/mainlev_build.png",
    );
    this.load.image(
      "background2",
      "diluvioespacial/assets/fase1/background2.png",
    );
    this.load.image("props2", "diluvioespacial/assets/fase1/props2.png");
    this.load.image("props1", "diluvioespacial/assets/fase1/props1.png");

    this.load.tilemapTiledJSON("map", "diluvioespacial/mapabom.json");

    this.load.image(
      "CloudsBack",
      "diluvioespacial/assets/fase2/CloudsBack.png",
    );
    this.load.image("BGFront", "diluvioespacial/assets/fase2/BGFront.png");
    this.load.image(
      "CloudsFront",
      "diluvioespacial/assets/fase2/CloudsFront.png",
    );
    this.load.image("Tileset", "diluvioespacial/assets/fase2/Tileset.png");
    this.load.image(
      "TilesExamples",
      "diluvioespacial/assets/fase2/TilesExamples.png",
    );
    this.load.image("Trees", "diluvioespacial/assets/fase2/Trees.png");

    this.load.image("fundo3_0", "diluvioespacial/assets/fase3/fundo3_0.png");
    this.load.image("fundo3_1", "diluvioespacial/assets/fase3/fundo3_1.png");
    this.load.image("fundo3_2", "diluvioespacial/assets/fase3/fundo3_2.png");
    this.load.image(
      "plataformas3",
      "diluvioespacial/assets/fase3/plataformas3.png",
    );

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
  }

  create() {
    const nextScene = this.scene.settings.data?.nextScene;
    this.scene.stop("preloader");
    if (nextScene) {
      this.scene.start(nextScene);
    } else {
      this.scene.start("menu");
    }
  }
}

export default preloader;
