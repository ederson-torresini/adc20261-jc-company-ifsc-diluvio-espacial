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

    this.playerSpeed = 200;
    this.playerJump = -520;

    this.spawnPoint = { x: 500, y: 1240 };
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, "az", 0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 46).setOffset(22, 16);
    this.player.setGravityY(850);
    this.player.setBounce(0);

    terra.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, terra);

    porta.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, porta);

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


    if (!this.anims.exists("stopped")) {
      this.anims.create({
        key: "stopped",
        frames: this.anims.generateFrameNumbers("az", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("walk")) {
      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("az", { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  update() {
    // Movement logic unified with `cave` scene
    const pad = this.input.gamepad.total > 0 ? this.input.gamepad.gamepads[0] : null;
    let xAxis = 0;
    let jumpPressed = false;

    if (pad) {
      xAxis = pad.axes[0].getValue();
      jumpPressed = pad.buttons[2] && pad.buttons[2].pressed;
    } else {
      if (this.cursors.left.isDown) {
        xAxis = -1;
      } else if (this.cursors.right.isDown) {
        xAxis = 1;
      }
      jumpPressed = this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown;
    }

    this.player.setVelocityX(xAxis * this.playerSpeed);

    if (Math.abs(xAxis) > 0.1) {
      this.player.setFlipX(xAxis < 0);
      this.player.play("walk", true);
    } else {
      this.player.play("stopped", true);
    }

    if (jumpPressed && (this.player.body.blocked.down || this.player.body.touching.down)) {
      this.player.setVelocityY(this.playerJump);
    }
  }

  respawnPlayer() {
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
  }
}

export default scene2;
