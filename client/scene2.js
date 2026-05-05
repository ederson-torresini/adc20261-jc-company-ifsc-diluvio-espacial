class scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/fase2/tiled4.json');
    this.load.image('background3', 'assets/fase2/jogo-boi/Diluvio-Espacial-main/Assets/Caverna/background3.png');
    this.load.image('background4a', 'assets/fase2/jogo-boi/Diluvio-Espacial-main/Assets/Caverna/background4a.png');
    this.load.image('background1', 'assets/fase2/jogo-boi/Diluvio-Espacial-main/Assets/Caverna/background1.png');
    this.load.image('mainlev_build', 'assets/fase2/jogo-boi/Diluvio-Espacial-main/Assets/Caverna/mainlev_build.png');
    this.load.image('props1', 'assets/fase2/jogo-boi/Diluvio-Espacial-main/Assets/Caverna/props1.png');
    this.load.image('CloudsBack', 'assets/fase2/jogo-boi/FreePlatformerNA/Background/CloudsBack.png');
    this.load.image('BGFront', 'assets/fase2/jogo-boi/FreePlatformerNA/Background/BGFront.png');
    this.load.image('CloudsFront', 'assets/fase2/jogo-boi/FreePlatformerNA/Background/CloudsFront.png');
    this.load.image('Tileset', 'assets/fase2/jogo-boi/FreePlatformerNA/Foreground/Tileset.png');
    this.load.image('TilesExamples', 'assets/fase2/jogo-boi/FreePlatformerNA/Foreground/TilesExamples.png');
    this.load.image('props2', 'assets/fase2/jogo-boi/Diluvio-Espacial-main/Assets/Caverna/props2.png');
    this.load.spritesheet("vd", "assets/personagens/az.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });

    const background3 = map.addTilesetImage('background3', 'background3');
    const background4a = map.addTilesetImage('background4a', 'background4a');
    const background1 = map.addTilesetImage('background1', 'background1');
    const mainlev_build = map.addTilesetImage('mainlev_build', 'mainlev_build');
    const props1 = map.addTilesetImage('props1', 'props1');
    const CloudsBack = map.addTilesetImage('CloudsBack', 'CloudsBack');
    const BGFront = map.addTilesetImage('BGFront', 'BGFront');
    const CloudsFront = map.addTilesetImage('CloudsFront', 'CloudsFront');
    const Tileset = map.addTilesetImage('Tileset', 'Tileset');
    const TilesExamples = map.addTilesetImage('TilesExamples', 'TilesExamples');
    const props2 = map.addTilesetImage('props2', 'props2');
    const tilesets = [background3, background4a, background1, mainlev_build, props1, CloudsBack, BGFront, CloudsFront, Tileset, TilesExamples, props2].filter(Boolean);

    map.createLayer('fundo 0', tilesets, 0, 0);
    map.createLayer('fundo 1', tilesets, 0, 0);
    map.createLayer('fundo 2', tilesets, 0, 0);
    const terra = map.createLayer('terra', tilesets, 0, 0);
    const porta = map.createLayer('Porta caverna', tilesets, 0, 0);

    terra.setCollisionByExclusion([-1]);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = this.physics.add.sprite(160, 1248, "vd", 0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 46).setOffset(22, 16);
    this.player.setGravityY(300);
    this.player.setBounce(0);

    this.physics.add.collider(this.player, terra);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add.text(10, 20, "Pulo: ↑ / W / Espaço", {
      fontSize: "12px",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 4, y: 4 },
    })
      .setScrollFactor(0)
      .setDepth(999);

    this.backButton = this.add.text(280, 20, "Voltar", {
      fontSize: "12px",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 5, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("scene1"))
      .setScrollFactor(0)
      .setDepth(999);

    if (!this.anims.exists("walk")) {
      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("vd", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  update() {
    this.player.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.play("walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.play("walk", true);
    } else {
      this.player.stop();
    }

    const onGround =
      this.player.body.blocked.down || this.player.body.touching.down;

    if (
      (this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown) &&
      onGround
    ) {
      this.player.setVelocityY(-330);
    }
  }
}

export default scene2;
