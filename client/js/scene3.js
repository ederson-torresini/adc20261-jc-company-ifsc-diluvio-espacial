class scene3 extends Phaser.Scene {
  constructor() {
    super("scene3");
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });

    const fundo3_0 = map.addTilesetImage('fundo3_0', 'fundo3_0');
    const fundo3_1 = map.addTilesetImage('fundo3_1', 'fundo3_1');
    const fundo3_2 = map.addTilesetImage('fundo3_2', 'fundo3 _2');
    const plataformas_3 = map.addTilesetImage('plataformas3', 'plataformas3');
    const tilesets = [
      fundo3_0,
      fundo3_1,
      fundo3_2,
      plataformas_3,
    ].filter(Boolean);

    const layerIndexByName = (name, occurrence = 0) => {
      const indices = map.layers.reduce((arr, layer, index) => {
        if (layer.name === name) {
          arr.push(index);
        }
        return arr;
      }, []);
      return indices[occurrence] ?? -1;
    };

    const fundo30 = map.createLayer('fundo30', tilesets);
    const fundo31 = map.createLayer('fundo31', tilesets);
    const fundo32 = map.createLayer('fundo32', tilesets);
    const detalhes = map.createLayer('detalhes', tilesets);
    const plataformas3 = map.createLayer('plataformas3', tilesets);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = this.physics.add.sprite(160, 1240, "az", 0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 50).setOffset(22, 18);
    this.player.setGravityY(850);
    this.player.setBounce(0);

    plataformas3.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, plataformas3);

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
      this.player.setVelocityY(-330);
    }
  }
}

export default scene3
