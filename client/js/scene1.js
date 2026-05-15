class scene1 extends Phaser.Scene {
  constructor() {
    super("scene1");
  }

   create() {
    const map = this.make.tilemap({ key: 'map' });

    const background3 = map.addTilesetImage('background3', 'background3');
    const background1 = map.addTilesetImage('background1', 'background1');
    const background2 = map.addTilesetImage('background2', 'background2');
    const mainlev_build = map.addTilesetImage('mainlev_build', 'mainlev_build');
    const props1 = map.addTilesetImage('props1', 'props1');
    const props2 = map.addTilesetImage('props2', 'props2');
    const tilesets = [
      background3,
      background1,
      background2,
      mainlev_build,
      props1,
      props2,
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

    // Botão Menu
    this.add.text(280, 40, "Menu", {
      fontSize: "12px",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 5, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("menu"))
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
