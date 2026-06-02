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

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.pad = this.input.gamepad.gamepads[0] || null;
    this.input.gamepad.once("connected", (pad) => {
      this.pad = pad;
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
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

    // Inicializar meteoros com sistema dinâmico
    this.asteroids = this.physics.add.group();
    this.newAsteroid = true;
    this.asteroidMinSpeed = 150;
    this.asteroidMaxSpeed = 300;
    this.asteroidMinSpawnInterval = 500;
    this.asteroidMaxSpawnInterval = 1500;
    this.asteroidHorizontalSpeed = 100;

    this.physics.add.overlap(
      this.player,
      this.asteroids,
      () => {
        this.respawnPlayer();
      },
      null,
      this,
    );
  }

  update() {
    // Reiniciar o jogo se o jogador cair abaixo de Y = 2160
    if (this.player.y > 2160) {
      this.respawnPlayer();
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
    }

    // Sistema de spawn dinâmico de meteoros
    if (this.newAsteroid) {
      const cameraLeft = this.cameras.main.worldView.x;
      const cameraRight = this.cameras.main.worldView.x + this.cameras.main.worldView.width;
      const x = Phaser.Math.Between(cameraLeft, cameraRight);
      const cameraTop = this.cameras.main.worldView.y;

      const asteroid = this.asteroids.create(x, cameraTop - 50, "asteroids");
      asteroid.body.setAllowGravity(false);

      const velocityY = Phaser.Math.Between(
        this.asteroidMinSpeed,
        this.asteroidMaxSpeed,
      );
      const velocityX = Phaser.Math.Between(-this.asteroidHorizontalSpeed, this.asteroidHorizontalSpeed);

      asteroid.setVelocity(velocityX, velocityY);
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
      const cameraBottom = this.cameras.main.worldView.y + this.cameras.main.worldView.height;
      const cameraLeft = this.cameras.main.worldView.x;
      const cameraRight = this.cameras.main.worldView.x + this.cameras.main.worldView.width;

      if (
        asteroid.y > cameraBottom + 100 ||
        asteroid.x < cameraLeft - 50 ||
        asteroid.x > cameraRight + 50
      ) {
        this.asteroids.remove(asteroid, true, true);
      }
    });
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
    }
  }
}

export default scene3;
