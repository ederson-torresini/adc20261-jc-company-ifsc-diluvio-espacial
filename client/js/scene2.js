class scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });

    const CloudsBack = map.addTilesetImage('CloudsBack', 'CloudsBack');
    const BGFront = map.addTilesetImage('BGFront', 'BGFront');
    const CloudsFront = map.addTilesetImage('CloudsFront', 'CloudsFront');
    const Tileset = map.addTilesetImage('Tileset', 'Tileset');
    const TilesExamples = map.addTilesetImage('TilesExamples', 'TilesExamples');
    const Trees = map.addTilesetImage('Trees', 'Trees');
    const props2 = map.addTilesetImage('props2', 'props2');
    const mainlev_build = map.addTilesetImage('mainlev_build', 'mainlev_build');
    const tilesets = [
      CloudsBack,
      BGFront,
      CloudsFront,
      Tileset,
      TilesExamples,
      Trees,
      props2,
      mainlev_build,
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

    const fundo20 = map.createLayer('fundo20', tilesets);
    const fundo21 = map.createLayer('fundo21', tilesets);
    const fundo22 = map.createLayer('fundo22', tilesets);
    const terra = map.createLayer('terra', tilesets);
    const porta = map.createLayer('portacaverna', tilesets);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.levelHeight = map.heightInPixels;

    this.spawnPoint = { x: 160, y: 1240 };
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, "az", 0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 50).setOffset(22, 18);
    this.player.setGravityY(850);
    this.player.setBounce(0);

    terra.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, terra);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.pad = this.input.gamepad.gamepads[0] || null;
    this.input.gamepad.once("connected", (pad) => {
      this.pad = pad;
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add.text(10, 20, "Controle: direcional / A", {
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

    const pad = this.pad || this.input.gamepad.gamepads[0] || null;
    const onGround =
      this.player.body.blocked.down || this.player.body.touching.down;

    if (
      this.player.body &&
      this.player.body.bottom > this.levelHeight + 100
    ) {
      this.respawnPlayer();
      return;
    }

    if (pad) {
      const axisX = pad.axes.length ? pad.axes[0].getValue() : 0;
      if (Math.abs(axisX) > 0.1) {
        this.player.setVelocityX(200 * axisX);
        this.player.play("walk", true);
      } else {
        this.player.stop();
      }

      const jumpPressed =
        pad.A || pad.Y || pad.up || (pad.buttons[0] && pad.buttons[0].pressed);
      if (jumpPressed && onGround) {
        this.player.setVelocityY(-520);
      }
    } else {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
        this.player.play("walk", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
        this.player.play("walk", true);
      } else {
        this.player.stop();
      }

      if (
        (this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown) &&
        onGround
      ) {
        this.player.setVelocityY(-520);
      }
    }
  }

  respawnPlayer() {
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
  }
}

export default scene2;
