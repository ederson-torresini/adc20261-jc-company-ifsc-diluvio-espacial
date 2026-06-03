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
    this.bats.create(2000, 336, "morcego");

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

    // Criar UI de artefatos no canto superior direito
    this.createArtifactUI();

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

  collectArtifact(artifact) {
    // Contar o tipo de artefato
    const type = artifact.artifactType;
    if (!this.artifactTypes[type]) {
      this.artifactTypes[type] = 0;
    }
    this.artifactTypes[type]++;

    this.collectedArtifacts++;
    this.artifacts.remove(artifact, true, true);

    console.log(`${type} coletado! Total: ${this.collectedArtifacts}/${this.totalArtifacts}`);

    // Atualizar UI
    this.updateArtifactUI();

    // Verificar se todos foram coletados
    if (this.collectedArtifacts === this.totalArtifacts) {
      console.log("Todos os artefatos foram coletados!");
    }
  }

  createArtifactUI() {
    // Container de artefatos no canto superior direito
    this.artifactUIContainer = this.add.container(800, 16).setScrollFactor(0).setDepth(1000);

    // Background para o painel (maior agora)
    const bg = this.add.rectangle(0, 0, 200, 185, 0x000000, 0.8).setOrigin(0, 0);
    this.artifactUIContainer.add(bg);

    // Título
    const title = this.add.text(10, 8, "ARTEFATOS", {
      fontSize: "13px",
      fontFamily: "Arial",
      fill: "#FFD700",
      fontStyle: "bold",
    });
    this.artifactUIContainer.add(title);

    // Contador total
    this.artifactCountText = this.add.text(10, 27, `Total: 0/${this.totalArtifacts}`, {
      fontSize: "11px",
      fontFamily: "Arial",
      fill: "#FFFFFF",
    });
    this.artifactUIContainer.add(this.artifactCountText);

    // Separador
    const line1 = this.add.line(0, 42, 10, 42, 190, 42, 0xFFD700);
    line1.setLineWidth(1);
    this.artifactUIContainer.add(line1);

    // Dicionário com a contagem total de cada tipo
    this.artifactTotals = {
      artefato_1: 3,
      artefato_2: 2,
      artefato_3: 1,
      artefato_4: 1,
    };

    // Container para cada tipo de artefato com imagem
    this.artifactCounters = {};
    let yPosition = 50;

    Object.keys(this.artifactTotals).forEach((type) => {
      // Imagem do artefato
      const img = this.add.sprite(20, yPosition, type);
      img.setScale(0.6);
      this.artifactUIContainer.add(img);

      // Contador: coletado/total
      this.artifactCounters[type] = this.add.text(40, yPosition - 5, `0/${this.artifactTotals[type]}`, {
        fontSize: "12px",
        fontFamily: "Arial",
        fill: "#AAAAFF",
        fontStyle: "bold",
      });
      this.artifactUIContainer.add(this.artifactCounters[type]);

      yPosition += 30;
    });
  }

  updateArtifactUI() {
    const remaining = this.totalArtifacts - this.collectedArtifacts;

    // Atualizar contador total
    this.artifactCountText.setText(`Total: ${this.collectedArtifacts}/${this.totalArtifacts}`);

    // Atualizar cor do contador total
    if (this.collectedArtifacts === this.totalArtifacts) {
      this.artifactCountText.setFill("#00FF00");
    } else if (this.collectedArtifacts > 0) {
      this.artifactCountText.setFill("#FFFFFF");
    }

    // Atualizar contadores de cada tipo de artefato
    Object.keys(this.artifactTotals).forEach((type) => {
      const collected = this.artifactTypes[type] || 0;
      const total = this.artifactTotals[type];
      const ratio = total > 0 ? collected / total : 0;

      // Atualizar o texto do contador
      this.artifactCounters[type].setText(`${collected}/${total}`);

      // Mudar cor baseado no progresso
      if (collected === total) {
        this.artifactCounters[type].setFill("#00FF00");
      } else if (collected > 0) {
        this.artifactCounters[type].setFill("#FFFF00");
      } else {
        this.artifactCounters[type].setFill("#AAAAFF");
      }
    });
  }
}

export default cave;
