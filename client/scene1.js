class scene1 extends Phaser.Scene {
  constructor() {
    super("scene1");
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/diluvioespacial/mapabom.json');
    this.load.image('background3', 'assets/diluvioespacial/fase1/background3.png');
    this.load.image('background1', 'assets/diluvioespacial/fase1/background1.png');
    this.load.image('mainlev_build', 'assets/diluvioespacial/fase1/mainlev_build.png');
    this.load.image('props1', 'assets/diluvioespacial/fase1/props1.png');
    this.load.image('props2', 'assets/diluvioespacial/fase1/props2.png');
    this.load.image('CloudsBack', 'assets/diluvioespacial/fase2/CloudsBack.png');
    this.load.image('BGFront', 'assets/diluvioespacial/fase2/BGFront.png');
    this.load.image('CloudsFront', 'assets/diluvioespacial/fase2/CloudsFront.png');
    this.load.image('Tileset', 'assets/diluvioespacial/fase2/Tileset.png');
    this.load.image('TilesExamples', 'assets/diluvioespacial/fase2/TilesExamples.png');
    this.load.image('Trees', 'assets/diluvioespacial/fase2/Trees.png');
    this.load.image('fundo3_0', 'assets/diluvioespacial/fase3/fundo3_0.png');
    this.load.image('fundo3_1', 'assets/diluvioespacial/fase3/fundo3_1.png');
    this.load.image('fundo3_2', 'assets/diluvioespacial/fase3/fundo3_2.png');
    this.load.image('plataformas3', 'assets/diluvioespacial/fase3/plataformas3.png');
    this.load.spritesheet("az", "assets/personagens/az.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });

    const background3 = map.addTilesetImage('background3', 'background3');
    const background1 = map.addTilesetImage('background1', 'background1');
    const mainlev_build = map.addTilesetImage('mainlev_build', 'mainlev_build');
    const props1 = map.addTilesetImage('props1', 'props1');
    const props2 = map.addTilesetImage('props2', 'props2');
    const CloudsBack = map.addTilesetImage('CloudsBack', 'CloudsBack');
    const BGFront = map.addTilesetImage('BGFront', 'BGFront');
    const CloudsFront = map.addTilesetImage('CloudsFront', 'CloudsFront');
    const Tileset = map.addTilesetImage('Tileset', 'Tileset');
    const TilesExamples = map.addTilesetImage('TilesExamples', 'TilesExamples');
    const Trees = map.addTilesetImage('Trees', 'Trees');
    const fundo3_0 = map.addTilesetImage('fundo3_0', 'fundo3_0');
    const fundo3_1 = map.addTilesetImage('fundo3_1', 'fundo3_1');
    const fundo3_2 = map.addTilesetImage('fundo3_2', 'fundo3_2');
    const plataformas3 = map.addTilesetImage('plataformas3', 'plataformas3');
    const tilesets = [
      background3,
      background1,
      mainlev_build,
      props1,
      props2,
      CloudsBack,
      BGFront,
      CloudsFront,
      Tileset,
      TilesExamples,
      Trees,
      fundo3_0,
      fundo3_1,
      fundo3_2,
      plataformas3,
    ].filter(Boolean);

    const fundo0 = map.createLayer('fase1/fundo0', tilesets);
    const fundo1 = map.createLayer('fase1/fundo1', tilesets);
    const teto = map.createLayer('fase1/teto', tilesets);
    const casafinal = map.createLayer('fase1/casafinal', tilesets);
    const plataforma1 = map.createLayer('fase1/plataforma1', tilesets);
    
    
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    this.player = this.physics.add.sprite(160, 300, "az", 0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 46).setOffset(22, 16);
    this.player.setGravityY(850);
    this.player.setBounce(0);
    
    plataforma1.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, [teto, plataforma1]);

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

    this.nextButton = this.add.text(280, 20, "Próxima", {
      fontSize: "12px",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 5, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("scene2"))
      .setScrollFactor(0)
      .setDepth(999);

    if (!this.anims.exists("walk")) {
      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("az", { start: 0, end: 3 }),
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
      this.player.setVelocityY(-260);
    }
  }
}

export default scene1;
