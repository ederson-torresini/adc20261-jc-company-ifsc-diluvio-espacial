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
  }

  update() {
    if (this.input.gamepad.total < 1) return;

    // primeiro controle, botão Start
    if (this.input.gamepad.gamepads[0].buttons[9].pressed || this.input.gamepad.gamepads[1].buttons[9].pressed) {
      this.scene.stop("start");
      this.scene.start("preloader");
    }
  }
}

export default start;
