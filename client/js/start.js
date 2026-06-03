class start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("start", "start.png");
  }

  create() {
    this.add.image(160, 120, "start");

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.keyEnter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );

    this.input.on("pointerdown", () => this.startGame());
  }

  update() {
    this.input.gamepad.gamepads.forEach((gamepad) => {
      if (gamepad) {
        if (gamepad.buttons[9].pressed) {
          this.startGame();
        }
      }
    });

    if (
      this.cursors.space.isDown ||
      this.keySpace.isDown ||
      this.keyEnter.isDown ||
      this.cursors.down.isDown ||
      this.cursors.up.isDown
    ) {
      this.startGame();
    }
  }

  startGame() {
    this.scene.stop("start");
    this.scene.start("preloader");
  }
}

export default start;
