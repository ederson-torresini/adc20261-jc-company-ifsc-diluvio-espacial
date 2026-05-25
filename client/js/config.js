var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  input: {
    gamepad: true,
  },
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 1000 },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default config;
