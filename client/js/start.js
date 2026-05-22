class start extends Phaser.Scene {
  constructor() {
    super("start");

    this.pads = [];
    /*
    X = 0: valores 0 e 1
    A = 1: valores 0 e 1
    B = 2: valores 0 e 1
    Y = 3: valores 0 e 1
    L = 4: valores 0 e 1
    R = 6: valores 0 e 1
    Select = 8: valores 0 e 1
    Start = 9: valores 0 e 1

    axes[0] = eixo X: valores -1 (esquerda), 0 e 1 (direita)
    axes[1] = eixo Y: valores -1 (cima), 0 e 1 (baixo)
    */
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("start", "start.png");
  }

  create() {
    this.add.image(160, 120, "start");

    this.input.gamepad.once("connected", () => {
      this.pads.push(this.input.gamepad.gamepads[this.input.gamepad.total - 1]);

      this.pads.forEach((pad, index) => {
        pad.on("down", (button) => {
          if (index === 0 && button === 0) {
            // primeiro controle, botão X
            this.scene.stop("start");
            this.scene.start("preloader");
          }
        });
      });
    });
  }
}

export default start;
