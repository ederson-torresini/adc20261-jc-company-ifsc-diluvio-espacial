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

    this.add
      .text(10, 20, "Controle: direcional / A", {
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

    this.asteroids = this.physics.add.group();

    // Asteroid 1
    this.asteroids.create(450, 0, "asteroids");

    this.asteroids.children.iterate((asteroid) => {
      asteroid.body.setAllowGravity(false);
      asteroid.setVelocityY(500);

      this.time.addEvent({
        delay: 1000,
        callback: () => {
          asteroid.y = 0;
        },
      });
    });

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
  }

  respawnPlayer() {
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
  }
}

export default scene3;
