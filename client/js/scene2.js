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

    this.music = this.sound.add("aventura_fase_inteira", { loop: true });
    this.music.play();

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.levelHeight = map.heightInPixels;

    this.playerSpeed = 200;
    this.playerJump = -520;

    this.spawnPoint = { x: 500, y: 1200 };
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
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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
    this.player2 = this.physics.add.sprite(this.spawnPoint.x + 100, this.spawnPoint.y, "vd", 0);
    this.player2.setCollideWorldBounds(true);
    this.player2.body.setSize(20, 46).setOffset(22, 16);
    this.player2.setGravityY(850);
    this.player2.setBounce(0);

    if (!this.anims.exists("stopped_vd")) {
      this.anims.create({
        key: "stopped_vd",
        frames: this.anims.generateFrameNumbers("vd", { start: 0, end: 5 }),
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

    terra.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player2, terra);

    porta.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player2, porta);

    // Criar animações dos animais
    if (!this.anims.exists("cinza_anim")) {
      this.anims.create({
        key: "cinza_anim",
        frames: this.anims.generateFrameNumbers("cinza", { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("esquilo_anim")) {
      this.anims.create({
        key: "esquilo_anim",
        frames: this.anims.generateFrameNumbers("esquilo", { start: 0, end: 7 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    if (!this.anims.exists("panda_vermelho_anim")) {
      this.anims.create({
        key: "panda_vermelho_anim",
        frames: this.anims.generateFrameNumbers("panda_vermelho", { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("lontra_anim")) {
      this.anims.create({
        key: "lontra_anim",
        frames: this.anims.generateFrameNumbers("lontra", { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Criar grupo de animais para coletar
    this.animals = this.physics.add.group();
    this.totalAnimals = 8;
    this.collectedAnimals = 0;
    this.animalTypes = {};

    // Dados dos animais com suas posições
    const animalData = [
      { x: 1056, y: 1264, type: "cinza" },
      { x: 592, y: 1232, type: "esquilo" },
      { x: 1280, y: 1264, type: "panda_vermelho" },
      { x: 816, y: 1264, type: "lontra" },
      { x: 1904, y: 1168, type: "cinza" },
      { x: 1728, y: 1280, type: "esquilo" },
      { x: 2352, y: 1280, type: "panda_vermelho" },
      { x: 1616, y: 1280, type: "lontra" },
    ];

    animalData.forEach((data) => {
      const animal = this.animals.create(data.x, data.y, data.type);
      animal.body.setAllowGravity(true);
      animal.setScale(0.8);
      animal.animalType = data.type;

      // Tocar animação correspondente ao tipo de animal
      const animKey = `${data.type}_anim`;
      animal.play(animKey, true);
    });

    this.physics.add.collider(this.animals, terra);

    this.physics.add.overlap(
      this.player,
      this.animals,
      (player, animal) => {
        this.collectAnimal(animal);
      },
      null,
      this,
    );

    this.physics.add.overlap(
      this.player2,
      this.animals,
      (player, animal) => {
        this.collectAnimal(animal);
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
    // Reiniciar o jogo se o jogador cair abaixo de Y = 1392
    if (this.player.y > 1392) {
      this.respawnPlayer();
      return;
    }

    if (this.player2.y > 1392) {
      this.respawnPlayer2();
      return;
    }

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
      this.sound.play("pulo");
    }

    // Controles do player 2 (gamepad ou A/D + W/Space/Enter)
    const pad2 = this.input.gamepad.total > 1 ? this.input.gamepad.gamepads[1] : null;
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
      jumpPressed2 = this.keyW.isDown || this.keySpace.isDown || this.keyEnter.isDown;
    }

    this.player2.setVelocityX(xAxis2 * this.playerSpeed);

    if (Math.abs(xAxis2) > 0.1) {
      this.player2.setFlipX(xAxis2 < 0);
      this.player2.play("walk_vd", true);
    } else {
      this.player2.play("stopped_vd", true);
    }

    if (jumpPressed2 && (this.player2.body.blocked.down || this.player2.body.touching.down)) {
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

    this.player2.setPosition(this.spawnPoint.x + 100, this.spawnPoint.y);
    this.player2.setVelocity(0, 0);
  }

  respawnPlayer() {
    this.game.lives--;

    if (this.game.lives <= 0) {
      this.game.lives = 4;
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
      this.game.lives = 4;
      this.scene.stop();
      this.music.stop();
      this.scene.start("start");
    } else {
      this.resetBothPlayers();
    }
  }

  collectAnimal(animal) {
    // Contar o tipo de animal
    const type = animal.animalType;
    if (!this.animalTypes[type]) {
      this.animalTypes[type] = 0;
    }
    this.animalTypes[type]++;

    this.collectedAnimals++;
    this.animals.remove(animal, true, true);

    console.log(`${type} coletado! Total: ${this.collectedAnimals}/${this.totalAnimals}`);

    // Verificar se todos foram coletados
    if (this.collectedAnimals === this.totalAnimals) {
      console.log("Todos os animais foram coletados!");

      // Aguardar um pouco e transicionar para scene3
      this.time.delayedCall(1000, () => {
        this.music.stop();
        this.scene.stop();
        this.scene.start("scene3");
      });
    }
  }


}

export default scene2;
