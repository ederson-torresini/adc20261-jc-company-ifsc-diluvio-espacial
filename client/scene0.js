class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.threshold = 0.1;
    this.speed = 100;
    this.direction = undefined;
  }

  preload() {
    this.load.image("background", "assets/fase4/fundo4.png");

    this.load.spritesheet("nv", "assets/personagens/nv.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("laser-beam", "assets/fase4/laser-beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("asteroids", "assets/fase4/asteroids.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.image("vida", "assets/fase4/vida.png");

    this.load.spritesheet("explosion", "assets/fase4/explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "./rexvirtualjoystickplugin.min.js",
      true,
    );

    this.load.audio("music4", "assets/fase4/music4.mp3");
    this.load.audio("laser", "assets/fase4/laser.mp3");
    this.load.audio("explosion", "assets/fase4/explosion.mp3");
  }

  create() {
    this.background = this.add.tileSprite(160, 120, 320, 240, "background");

    this.music = this.sound.add("music4", { loop: true });
    this.music.play();
    this.laser = this.sound.add("laser");
    this.explosion = this.sound.add("explosion");

    this.anims.create({
      key: "flying",
      frames: this.anims.generateFrameNumbers("nv", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });

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
      this.livesSprites.create(50 + i * 18, 15, "vida").setScale(0.5).setDepth(999);
    }

    this.anims.create({
      key: "laser-spinning",
      frames: this.anims.generateFrameNumbers("laser-beam", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.laserBeams = this.physics.add.group();
    this.canShoot = true;

    this.asteroids = this.physics.add.group();
    this.newAsteroid = true;

    this.explosionAnim = this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 4,
      }),
      frameRate: 10
    });

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 50,
      y: 200,
      radius: 25,
      base: this.add.circle(0, 0, 25, 0xcccccc),
      thumb: this.add.circle(0, 0, 12, 0x666666),
    });

    this.joystick.on("update", () => {
      const angle = Phaser.Math.DegToRad(this.joystick.angle);
      const force = this.joystick.force;

      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        ).normalize();
      }

      if (this.joystick.force > 0) {
        this.nv.setVelocity(
          this.direction.x * this.speed,
          0, // this.direction.y * this.speed
        );
      } else {
        this.nv.setVelocity(0, 0);
      }
    });

    this.shootButton = this.add
      .sprite(270, 200, "laser-beam")
      .setInteractive()
      .on("pointerdown", () => {
        this.shootButton.setTint(0xaaaaaa);

        if (this.canShoot) {
          this.laser.play();
          const laser = this.laserBeams.create(
            this.nv.x,
            this.nv.y - 20,
            "laser-beam",
          );
          laser.setVelocity(0, -300);
          laser.play("laser-spinning");
          this.canShoot = false;

          this.time.addEvent({
            delay: 250,
            callback: () => {
              this.canShoot = true;
            },
          });
        }
      })
      .on("pointerup", () => {
        this.shootButton.clearTint();
      })
      .setDepth(999);

    this.nextButton = this.add
      .text(280, 20, "Próxima", {
        fontSize: "12px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 5, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("scene1");
      })
      .setDepth(999);

    this.physics.add.overlap(
      this.laserBeams,
      this.asteroids,
      (laser, asteroid) => {
        this.laserBeams.remove(laser, true, true);

        if (asteroid.frame.name >= 6) {
          const explosionSprite = this.add.sprite(asteroid.x, asteroid.y, "explosion");
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
      })

    });

    let counter = 60
    this.timeText = this.add.text(10, 10, counter, {
      fontSize: "16px",
      fill: "#ffffff",
    }).setDepth(999)
    const timeCountdown = setInterval(() => {
      counter--
      if (this.timeText) {
        this.timeText.setText(counter)
      }

      if (counter === 0) {
        clearInterval(timeCountdown);
        this.game.lives = 4; // Resetar vidas
        this.scene.stop()
        this.scene.start("start");
      }
    }, 1000);

    // Limpar o interval quando a cena for destruída
    this.events.on('shutdown', () => clearInterval(timeCountdown));

  }

  update() {
    this.background.tilePositionY -= 1;

    if (this.newAsteroid) {
      const x = Phaser.Math.Between(0, this.game.config.width);
      const asteroid = this.asteroids.create(
        x,
        -50,
        "asteroids",
        Math.floor(Math.random() * 3),
      );
      asteroid.setVelocity(0, Phaser.Math.Between(90, 115));
      this.newAsteroid = false;

      this.time.addEvent({
        delay: Phaser.Math.Between(1000, 2000),
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

export default scene0;
