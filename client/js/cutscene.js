class cutscene extends Phaser.Scene {
  constructor() {
    super("cutscene");
    this.index = 0;
    this.frames = [];
    this.buttonTimeout = 0;
    this.buttonPressed = false;
    this.timer = null;
    this.fadeDuration = 250;
  }

  create(data) {
    this.index = 0;
    this.buttonTimeout = 200;
    this.buttonPressed = false;

    data.list.forEach((num) => {
      this.frames.push(this.add.image(160, 120, `cutscene-${num}`));
    });

    this.frames.forEach((frame) => frame.setVisible(false));

    this.cameras.main.fadeIn(this.fadeDuration);
    this.frames[this.index].setVisible(true);
    this.timer = this.time.addEvent({
      delay: this.buttonTimeout * 10,
      callback: () => {
        this.nextFrame();
      },
    });
  }

  update() {
    console.log(this.index, this.buttonPressed);

    this.input.gamepad.gamepads.forEach((gamepad) => {
      if (gamepad) {
        if (gamepad.buttons[9].pressed && !this.buttonPressed) {
          this.buttonPressed = true;
          this.nextFrame();

          this.time.addEvent({
            delay: this.buttonTimeout,
            callback: () => {
              this.buttonPressed = false;
            },
          });
        }
      }
    });
  }

  nextFrame() {
    this.cameras.main.fadeOut(this.fadeDuration);
    this.frames[this.index].setVisible(false);
    this.index++;

    if (this.index >= this.frames.length) {
        this.scene.stop("cutscene");
        this.scene.start("cave");
    } else {
      this.cameras.main.fadeIn(this.fadeDuration);
      this.frames[this.index].setVisible(true);

      if (this.timer) this.timer.remove();
      this.timer = this.time.addEvent({
        delay: this.buttonTimeout * 10,
        callback: () => {
          this.nextFrame();
        },
      });
    }
  }
}

export default cutscene;
