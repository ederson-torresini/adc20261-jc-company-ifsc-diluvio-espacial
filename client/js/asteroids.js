class asteroids extends Phaser.Scene {
  constructor() {
    super("asteroids");

    this.nvSpeed = 200;
    this.shootTimeout = 250;
    this.laserBeamSpeed = 500;
    this.asteroidMinSpeed = 90;
    this.asteroidMaxSpeed = 115;
    this.asteroidMinSpawnInterval = 250;
    this.asteroidMaxSpawnInterval = 500;
  }

  create() {
    this.physics.world.gravity.y = 0;

    this.background = this.add.tileSprite(160, 120, 320, 240, "background");

    this.music = this.sound.add("music4", { loop: true });
    this.music.play();
    this.laser = this.sound.add("laser");
    this.explosion = this.sound.add("explosion");

    if (!this.anims.exists("flying")) {
      this.anims.create({
        key: "flying",
        frames: this.anims.generateFrameNumbers("nv", { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.nv = this.physics.add.sprite(160, 200, "nv");
    this.nv.play("flying");
    this.nv.setCollideWorldBounds(true);
    this.canShoot = true;

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
        .setDepth(999);
    }

    if (!this.anims.exists("laser-spinning")) {
      this.anims.create({
        key: "laser-spinning",
        frames: this.anims.generateFrameNumbers("laser-beam", {
          start: 0,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.laserBeams = this.physics.add.group();
    this.canShoot = true;

    this.asteroids = this.physics.add.group();
    this.newAsteroid = true;

    if (!this.anims.exists("explosion")) {
      this.explosionAnim = this.anims.create({
        key: "explosion",
        frames: this.anims.generateFrameNumbers("explosion", {
          start: 0,
          end: 4,
        }),
        frameRate: 10,
      });
    }

    this.physics.add.overlap(
      this.laserBeams,
      this.asteroids,
      (laser, asteroid) => {
        this.laserBeams.remove(laser, true, true);

        if (asteroid.frame.name >= 6) {
          const explosionSprite = this.add.sprite(
            asteroid.x,
            asteroid.y,
            "explosion",
          );
          explosionSprite.play("explosion");
          explosionSprite.on("animationcomplete", () => {
            explosionSprite.destroy();
          });
          this.explosion.play();
          this.asteroids.remove(asteroid, true, true);
        } else {
          asteroid.setFrame(asteroid.frame.name + 3);
          asteroid.setSize(
            asteroid.body.width * 0.5,
            asteroid.body.height * 0.5,
          );
        }
      },
    );

    this.physics.add.overlap(this.nv, this.asteroids, (nv, asteroid) => {
      this.music.stop();

      this.nv.disableBody(true, true);
      this.canShoot = false;

      this.explosion.play();

      const explosionSprite = this.add.sprite(nv.x, nv.y, "explosion");
      explosionSprite.play("explosion");

      explosionSprite.on("animationcomplete", () => {
        this.nv.enableBody(true);

        this.game.lives--;
        if (this.game.lives <= 0) {
          this.game.lives = 4;
          this.scene.stop();
          this.scene.start("start");
        } else {
          this.scene.restart();
        }
      });
    });

    let counter = 60;
    this.timeText = this.add
      .text(10, 10, counter, {
        fontSize: "16px",
        fill: "#ffffff",
      })
      .setDepth(999);

    const timeCountdown = setInterval(() => {
      counter--;
      if (this.timeText) {
        this.timeText.setText(counter);
      }

      if (counter === 0) {
        clearInterval(timeCountdown);
        this.game.lives = 4; // Resetar vidas
        this.scene.stop();
        this.scene.start("start");
      }
    }, 1000);

    // Limpar o interval quando a cena for destruída
    this.events.on("shutdown", () => clearInterval(timeCountdown));
  }

  update() {
    if (this.input.gamepad.total < 1) return;

    // primeiro controle, eixos X e Y
    let xAxis = this.input.gamepad.gamepads[0].axes[0].getValue();
    let yAxis = this.input.gamepad.gamepads[0].axes[1].getValue();
    this.nv.setVelocity(xAxis * this.nvSpeed, yAxis * this.nvSpeed);

    // primeiro controle, botão 3 = Y
    if (this.input.gamepad.gamepads[0].buttons[3].pressed) {
      if (this.canShoot) {
        this.laser.play();
        const laser = this.laserBeams.create(
          this.nv.x,
          this.nv.y - 20,
          "laser-beam",
        );
        laser.setVelocity(0, -this.laserBeamSpeed);
        laser.play("laser-spinning");
        this.canShoot = false;

        this.time.addEvent({
          delay: this.shootTimeout,
          callback: () => {
            this.canShoot = true;
          },
        });
      }
    }

    this.background.tilePositionY -= 1;

    if (this.newAsteroid) {
      const x = Phaser.Math.Between(0, this.game.config.width);
      const frame = Math.floor(Math.random() * 9);
      const asteroid = this.asteroids.create(x, -50, "asteroids", frame);

      const factor = Math.floor(frame / 3);
      asteroid.setSize(
        asteroid.body.width * Math.pow(0.5, factor),
        asteroid.body.height * Math.pow(0.5, factor),
      );

      asteroid.setVelocity(
        0,
        Phaser.Math.Between(this.asteroidMinSpeed, this.asteroidMaxSpeed),
      );
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

    const laserOnScene = this.laserBeams.getChildren();
    laserOnScene.forEach((laser) => {
      if (laser.y < -50) {
        this.laserBeams.remove(laser, true, true);
      }
    });

    const asteroidsOnScene = this.asteroids.getChildren();
    asteroidsOnScene.forEach((asteroid) => {
      if (asteroid.y > this.game.config.height + 50) {
        this.asteroids.remove(asteroid, true, true);
      }
    });
  }
}

export default asteroids;
