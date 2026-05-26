class cave extends Phaser.Scene {
  constructor() {
    super("cave");

    this.playerSpeed = 200;
    this.playerJump = -520;
    this.playerGroundLimit = 600;
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });

    this.background3 = this.map.addTilesetImage("background3", "background3");
    this.background1 = this.map.addTilesetImage("background1", "background1");
    this.mainlev_build = this.map.addTilesetImage(
      "mainlev_build",
      "mainlev_build",
    );
    this.props1 = this.map.addTilesetImage("props1", "props1");
    this.props2 = this.map.addTilesetImage("props2", "props2");
    this.tilesets = [
      this.background3,
      this.background1,
      this.mainlev_build,
      this.props1,
      this.props2,
    ];

    this.fundo10 = this.map.createLayer("fundo10", this.tilesets);
    this.fundo11 = this.map.createLayer("fundo11", this.tilesets);
    this.teto = this.map.createLayer("teto", this.tilesets);
    this.espinhos = this.map.createLayer("espinhos", this.tilesets);
    this.casafinal = this.map.createLayer("casafinal", this.tilesets);
    this.plataforma1 = this.map.createLayer("plataforma1", this.tilesets);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );

    this.spawnPoint = { x: 350, y: 300 };
    this.player = this.physics.add.sprite(
      this.spawnPoint.x,
      this.spawnPoint.y,
      "az",
      0,
    );
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 46).setOffset(22, 16);
    this.player.setGravityY(850);
    this.player.setBounce(0);

    this.plataforma1.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, [this.teto, this.plataforma1]);
    this.physics.add.collider(this.player, this.espinhos, () =>
      this.respawnPlayer(),
    );

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

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

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    // Reiniciar o jogo se o jogador cair no chão
    if (this.player.y > this.playerGroundLimit) {
      this.respawnPlayer();
      return;
    }

    const pad = this.input.gamepad.total > 0 ? this.input.gamepad.gamepads[0] : null;
    let xAxis = 0;
    let jumpPressed = false;

    if (pad) {
      xAxis = pad.axes[0].getValue();
      jumpPressed = pad.buttons[2].pressed;
    } else {
      if (this.cursors.left.isDown) {
        xAxis = -1;
      } else if (this.cursors.right.isDown) {
        xAxis = 1;
      }
      jumpPressed =
        this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown;
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
    this.player.play("stopped", true);
  }
}

export default cave;
