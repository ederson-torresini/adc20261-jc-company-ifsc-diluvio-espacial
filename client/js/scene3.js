class scene3 extends Phaser.Scene {
  constructor() {
    super("scene3");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });

    const fundo3_0 = map.addTilesetImage("fundo3_0", "fundo3_0");
    const fundo3_1 = map.addTilesetImage("fundo3_1", "fundo3_1");
    const fundo3_2 = map.addTilesetImage("fundo3_2", "fundo3_2");
    const plataformas_3 = map.addTilesetImage("plataformas3", "plataformas3");
    const colisao_3 = map.addTilesetImage("colisao3", "colisao3");
    const tilesets = [
      fundo3_0,
      fundo3_1,
      fundo3_2,
      plataformas_3,
      colisao_3,
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

    const fundo30 = map.createLayer("fundo30", tilesets);
    const fundo31 = map.createLayer("fundo31", tilesets);
    const fundo32 = map.createLayer("fundo32", tilesets);
    const detalhes = map.createLayer("detalhes", tilesets);
    const plataformas3 = map.createLayer("plataformas3", tilesets);

    this.music = this.sound.add("aventura_fase_inteira", { loop: true });
    this.music.play();

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.levelHeight = map.heightInPixels;
    this.winZoneY = 100; // Zona de vitória no topo

    this.playerSpeed = 200;
    this.playerJump = -520;

    const getSpawnPoint = () => {
      const objectLayers = map.layers.filter(
        (layer) => layer.type === "objectgroup",
      );
      for (const layer of objectLayers) {
        const spawnObject = layer.objects.find((obj) => {
          const name = String(obj.name || "").toLowerCase();
          return ["spawn", "player", "start"].some((term) =>
            name.includes(term),
          );
        });
        if (spawnObject) {
          return {
            x: spawnObject.x + (spawnObject.width || 0) / 2,
            y: spawnObject.y - (spawnObject.height || 0) / 2,
          };
        }
      }
      return { x: 500, y: 2000 };
    };

    this.spawnPoint = getSpawnPoint();
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

    plataformas3.setCollisionByProperty({ collides: true });
    if (
      !plataformas3.collideIndexes ||
      plataformas3.collideIndexes.length === 0
    ) {
      plataformas3.setCollisionByExclusion([-1]);
    }
    this.physics.add.collider(this.player, plataformas3);

    // Câmera seguirá o ponto médio entre os dois jogadores (será atualizada no update)

    this.pad = this.input.gamepad.gamepads[0] || null;
    this.pad2 = this.input.gamepad.gamepads[1] || null;
    this.input.gamepad.once("connected", (pad) => {
      if (!this.pad) {
        this.pad = pad;
      } else if (!this.pad2) {
        this.pad2 = pad;
      }
    });

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
      this.spawnPoint.x + 50,
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
        frames: this.anims.generateFrameNumbers("vd", { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("walk_vd")) {
      this.anims.create({
        key: "walk_vd",
        frames: this.anims.generateFrameNumbers("vd", { start: 5, end: 11 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    plataformas3.setCollisionByProperty({ collides: true });
    if (
      !plataformas3.collideIndexes ||
      plataformas3.collideIndexes.length === 0
    ) {
      plataformas3.setCollisionByExclusion([-1]);
    }
    this.physics.add.collider(this.player2, plataformas3);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.pad = this.input.gamepad.gamepads[0] || null;
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

    // Inicializar meteoros com sistema dinâmico
    this.asteroids = this.physics.add.group();
    this.newAsteroid = true;
    this.asteroidMinSpeed = 100;
    this.asteroidMaxSpeed = 200;
    this.asteroidMinSpawnInterval = 1000;
    this.asteroidMaxSpawnInterval = 2500;
    this.asteroidHorizontalSpeed = 100;

    // Definir zonas de segurança (onde não spawnam meteoros)
    this.safeZoneTopHeight = 500; // Zona de segurança no começo (primeiros 500px)
    this.safeZoneBottomHeight = 500; // Zona de segurança no final (últimos 500px)

    this.physics.add.overlap(
      this.player,
      this.asteroids,
      () => {
        this.respawnPlayer();
      },
      null,
      this,
    );
    this.physics.add.overlap(
      this.player2,
      this.asteroids,
      () => {
        this.respawnPlayer2();
      },
      null,
      this,
    );
  }

  update() {
    // Verificar se algum jogador venceu a fase (chegou ao topo)
    if (this.player.y < this.winZoneY || this.player2.y < this.winZoneY) {
      this.music.stop();
      this.scene.stop();
      this.scene.start("cutscene", { list: [6], nextScene: "asteroids" });
      return;
    }

    // Reiniciar o jogo se o jogador cair abaixo de Y = 2160
    if (this.player.y > 2160) {
      this.respawnPlayer();
      return;
    }

    if (this.player2.y > 2160) {
      this.respawnPlayer2();
      return;
    }

    // Movement logic unified with `cave` scene
    const pad =
      this.input.gamepad.total > 0 ? this.input.gamepad.gamepads[0] : null;
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
      jumpPressed2 = pad2.buttons[2] && pad2.buttons[2].pressed;
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

    // Sistema de spawn dinâmico de meteoros
    if (this.newAsteroid) {
      const cameraLeft = this.cameras.main.worldView.x;
      const cameraRight =
        this.cameras.main.worldView.x + this.cameras.main.worldView.width;
      const cameraTop = this.cameras.main.worldView.y;

      // Verificar se está em zona de segurança
      const isInTopSafeZone = cameraTop < this.safeZoneTopHeight;
      const isInBottomSafeZone =
        cameraTop > this.levelHeight - this.safeZoneBottomHeight;

      // Só spawnar se NÃO estiver em zona de segurança
      if (!isInTopSafeZone && !isInBottomSafeZone) {
        const x = Phaser.Math.Between(cameraLeft, cameraRight);

        const asteroid = this.asteroids.create(x, cameraTop - 50, "asteroids");
        asteroid.body.setAllowGravity(false);

        const velocityY = Phaser.Math.Between(
          this.asteroidMinSpeed,
          this.asteroidMaxSpeed,
        );
        const velocityX = 0;

        asteroid.setVelocity(velocityX, velocityY);
      }

      this.newAsteroid = false;

      this.time.addEvent({
        delay: Phaser.Math.Between(
          this.asteroidMinSpawnInterval,
          this.asteroidMaxSpawnInterval,
        ),
        callback: () => {
          this.newAsteroid = true;
        },
      });
    }

    // Remover meteoros que saem da tela
    const asteroidsOnScene = this.asteroids.getChildren();
    asteroidsOnScene.forEach((asteroid) => {
      const cameraBottom =
        this.cameras.main.worldView.y + this.cameras.main.worldView.height;
      const cameraLeft = this.cameras.main.worldView.x;
      const cameraRight =
        this.cameras.main.worldView.x + this.cameras.main.worldView.width;

      if (
        asteroid.y > cameraBottom + 100 ||
        asteroid.x < cameraLeft - 50 ||
        asteroid.x > cameraRight + 50
      ) {
        this.asteroids.remove(asteroid, true, true);
      }
    });
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

    this.player2.setPosition(this.spawnPoint.x + 50, this.spawnPoint.y);
    this.player2.setVelocity(0, 0);
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
      this.scene.start("cutscene", { list: [6], nextScene: "asteroids" });
    } else {
      this.resetBothPlayers();
    }
  }
}

export default scene3;
