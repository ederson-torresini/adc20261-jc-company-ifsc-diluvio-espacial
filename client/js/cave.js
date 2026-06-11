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

    // Câmera seguirá ambos os jogadores (será atualizada no update)

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

    // Criar segundo jogador
    this.player2 = this.physics.add.sprite(
      this.spawnPoint.x + 100,
      this.spawnPoint.y,
      "vd",
      0,
    );
    this.player2.setCollideWorldBounds(true);
    this.player2.body.setSize(20, 46).setOffset(22, 16);
    this.player2.setGravityY(850);
    this.player2.setBounce(0);

    if (!this.anims.exists("stopped_vd")) {
      this.anims.create({
        key: "stopped_vd",
        frames: this.anims.generateFrameNumbers("vd", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("walk_vd")) {
      this.anims.create({
        key: "walk_vd",
        frames: this.anims.generateFrameNumbers("vd", { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.physics.add.collider(this.player2, [this.teto, this.plataforma1]);
    this.physics.add.collider(this.player2, this.espinhos, () =>
      this.respawnPlayer2(),
    );

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyEnter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );

    this.pad = this.input.gamepad.gamepads[0] || null;
    this.pad2 = this.input.gamepad.gamepads[1] || null;
    this.input.gamepad.on("connected", (pad) => {
      if (!this.pad) {
        this.pad = pad;
      } else if (!this.pad2) {
        this.pad2 = pad;
      }
    });

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
    this.worms
      .create(1040, 400, "minhocadaterra")
      .body.setSize(30, 64)
      .setOffset(16, 0);

    // Minhoca 2
    this.worms
      .create(1264, 400, "minhocadaterra")
      .body.setSize(30, 64)
      .setOffset(16, 0);

    // Minhoca 3
    this.worms
      .create(2112, 400, "minhocadaterra")
      .body.setSize(30, 64)
      .setOffset(16, 0);

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
    this.physics.add.overlap(
      this.player2,
      this.worms,
      (player, worm) => {
        if (
          worm.anims.currentFrame.index >= 4 &&
          worm.anims.currentFrame.index <= 8
        ) {
          this.respawnPlayer2();
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
    this.bats.create(512, 384, "morcego");

    // Morcego 2
    this.bats.create(848, 240, "morcego");

    // Morcego 3
    this.bats.create(1152, 384, "morcego");

    // Morcego 4
    this.bats.create(1536, 448, "morcego");

    // Morcego 5
    this.bats.create(1840, 272, "morcego");

    // Morcego 6
    this.bats.create(2000, 320, "morcego");

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
    this.physics.add.overlap(
      this.player2,
      this.bats,
      () => {
        this.respawnPlayer2();
      },
      null,
      this,
    );

    // Criar grupo de artefatos UMA ÚNICA VEZ
    this.artifacts = this.physics.add.group();
    this.totalArtifacts = 7;
    this.collectedArtifacts = 0;
    this.artifactTypes = {};

    // Adicionar todos os artefatos ao mesmo grupo
    const artifactData = [
      { x: 512, y: 368, type: "artefato_1" },
      { x: 800, y: 288, type: "artefato_2" },
      { x: 1152, y: 368, type: "artefato_1" },
      { x: 1536, y: 432, type: "artefato_1" },
      { x: 1792, y: 320, type: "artefato_2" },
      { x: 1920, y: 352, type: "artefato_3" },
      { x: 2544, y: 464, type: "artefato_4" },
    ];

    artifactData.forEach((data) => {
      const artifact = this.artifacts.create(data.x, data.y, data.type);
      artifact.body.setAllowGravity(false);
      artifact.setScale(0.8);
      artifact.artifactType = data.type;
    });

    this.physics.add.overlap(
      this.player,
      this.artifacts,
      (player, artifact) => {
        this.collectArtifact(artifact);
      },
      null,
      this,
    );

    this.physics.add.overlap(
      this.player2,
      this.artifacts,
      (player, artifact) => {
        this.collectArtifact(artifact);
      },
      null,
      this,
    );

    // Resetar vidas para a fase
    this.game.lives = this.game.initialLives;

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

    if (this.player2.y > this.playerGroundLimit) {
      this.respawnPlayer2();
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
      this.sound.play("pulo");
    }

    // Controles do player 2 (gamepad ou A/D + W/Space/Enter)
    const pad2 =
      this.input.gamepad.total > 1 ? this.input.gamepad.gamepads[1] : null;
    let xAxis2 = 0;
    let jumpPressed2 = false;

    if (pad2) {
      xAxis2 = pad2.axes[0].getValue();
      jumpPressed2 = pad2.buttons[2].pressed;
    } else {
      if (this.keyA.isDown) {
        xAxis2 = -1;
      } else if (this.keyD.isDown) {
        xAxis2 = 1;
      }
      jumpPressed2 =
        this.keyW.isDown || this.keySpace.isDown || this.keyEnter.isDown;
    }

    this.player2.setVelocityX(xAxis2 * this.playerSpeed);

    if (Math.abs(xAxis2) > 0.1) {
      this.player2.setFlipX(xAxis2 < 0);
      this.player2.play("walk_vd", true);
    } else {
      this.player2.play("stopped_vd", true);
    }

    if (
      jumpPressed2 &&
      (this.player2.body.blocked.down || this.player2.body.touching.down)
    ) {
      this.player2.setVelocityY(this.playerJump);
      this.sound.play("pulo");
    }
  }

  resetBothPlayers() {
    // Atualizar sprites de vidas
    this.livesSprites.clear(true, true);
    for (let i = 0; i < this.game.lives; i++) {
      this.livesSprites
        .create(50 + i * 18, 15, "vida")
        .setScale(0.5)
        .setDepth(999)
        .setScrollFactor(0);
    }

    // Resetar ambos os jogadores
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
    this.player.play("stopped", true);

    this.player2.setPosition(this.spawnPoint.x + 100, this.spawnPoint.y);
    this.player2.setVelocity(0, 0);
    this.player2.play("stopped_vd", true);
  }

  respawnPlayer() {
    this.game.lives--;

    if (this.game.lives <= 0) {
      this.game.lives = this.game.initialLives;
      this.scene.stop();
      this.music.stop();
      this.scene.start("start");
    } else {
      this.resetBothPlayers();
    }
  }

  respawnPlayer2() {
    this.game.lives--;

    if (this.game.lives <= 0) {
      this.game.lives = this.game.initialLives;
      this.scene.stop();
      this.music.stop();
      this.scene.start("start");
    } else {
      this.resetBothPlayers();
    }
  }

  collectArtifact(artifact) {
    // Contar o tipo de artefato
    const type = artifact.artifactType;
    if (!this.artifactTypes[type]) {
      this.artifactTypes[type] = 0;
    }
    this.artifactTypes[type]++;

    this.collectedArtifacts++;
    this.artifacts.remove(artifact, true, true);

    console.log(
      `${type} coletado! Total: ${this.collectedArtifacts}/${this.totalArtifacts}`,
    );

    // Verificar se todos foram coletados
    if (this.collectedArtifacts === this.totalArtifacts) {
      console.log("Todos os artefatos foram coletados!");

      // Aguardar um pouco e transicionar para scene2
      this.time.delayedCall(1000, () => {
        this.music.stop();
        this.scene.stop();
        this.scene.start("cutscene", { list: [4], nextScene: "scene2" });
      });
    }
  }
}

export default cave;
