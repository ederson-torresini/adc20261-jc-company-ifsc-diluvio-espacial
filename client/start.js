class start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("start", "start.png");
  }

  create() {
    const startImage = this.add.image(160, 120, "start");
    startImage.setInteractive();
    startImage.on("pointerdown", () => {
      this.scene.start("scene0");
    });
  }
}

export default start;