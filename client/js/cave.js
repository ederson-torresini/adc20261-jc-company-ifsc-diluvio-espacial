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

    this.music = this.sound.add("aventura_fase_inteira", { loop: true });
    this.music.play();

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

    this.espinhos.setCollisionByProperty({ collides: true });
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
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.anims.create({
      key: "worm",
      frames: this.anims.generateFrameNumbers("minhocadaterra", {
        start: 0,
        end: 28,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.worms = this.physics.add.group();

    // Minhoca 1
    this.worms.create(1040, 400, "minhocadaterra");

    // Minhoca 2
    this.worms.create(1264, 400, "minhocadaterra");

    // Minhoca 3
    this.worms.create(2112, 400, "minhocadaterra");

    this.worms.children.iterate((worm) => {
      worm.play("worm", true);
    });

    this.physics.add.collider(this.worms, this.plataforma1);
    this.physics.add.overlap(
      this.player,
      this.worms,
      (player, worm) => {
        if (
          worm.anims.currentFrame.index >= 4 &&
          worm.anims.currentFrame.index <= 8
        ) {
          this.respawnPlayer();
        }
      },
      null,
      this,
    );

    this.anims.create({
      key: "bat",
      frames: this.anims.generateFrameNumbers("morcego", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.bats = this.physics.add.group();

    // Morcego 1
    this.bats.create(848, 240, "morcego");

    // Morcego 2
    this.bats.create(1840, 272, "morcego");

    this.bats.children.iterate((bat) => {
      bat.body.setAllowGravity(false);
      bat.play("bat", true);
      bat.setVelocityY(60);

      this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: () => {
          bat.setVelocityY(-bat.body.velocity.y);
        },
      });
    });

    this.physics.add.overlap(
      this.player,
      this.bats,
      () => {
        this.respawnPlayer();
      },
      null,
      this,
    );

    // Inicializar vidas
    if (!this.game.lives) {
      this.game.lives = 4;
    }

    // Criar sprites das vidas
    this.livesSprites = this.add.group();
    this.livesSprites.clear(true, true);
    for (let i = 0; i < this.game.lives; i++) {
      this.livesSprites
        .create(50 + i * 18, 15, "vida")
        .setScale(0.5)
        .setDepth(999)
        .setScrollFactor(0);
    }
  }

  update() {
    // Reiniciar o jogo se o jogador cair no chão
    if (this.player.y > this.playerGroundLimit) {
      this.respawnPlayer();
      return;
    }

    const pad =
      this.input.gamepad.total > 0 ? this.input.gamepad.gamepads[0] : null;
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

    if (
      jumpPressed &&
      (this.player.body.blocked.down || this.player.body.touching.down)
    ) {
      this.player.setVelocityY(this.playerJump);
    }
  }

  respawnPlayer() {
    this.game.lives--;

    if (this.game.lives <= 0) {
      this.game.lives = 4;
      this.scene.stop();
      this.music.stop();
      this.scene.start("start");
    } else {
      // Atualizar sprites de vidas
      this.livesSprites.clear(true, true);
      for (let i = 0; i < this.game.lives; i++) {
        this.livesSprites
          .create(50 + i * 18, 15, "vida")
          .setScale(0.5)
          .setDepth(999)
          .setScrollFactor(0);
      }

      this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
      this.player.setVelocity(0, 0);
      this.player.play("stopped", true);
    }
  }
}

export default cave;
