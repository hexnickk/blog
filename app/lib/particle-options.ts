export const particlesOptions = {
  fpsLimit: 120,
  particles: {
    color: {
      value: "#ffffff",
    },
    move: {
      enable: true,
      speed: {
        min: 0.1,
        max: 1,
      },
    },
    number: {
      value: 160,
    },
    opacity: {
      value: {
        min: 0.1,
        max: 2,
      },
      animation: {
        enable: true,
        speed: 1,
      },
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
    },
  },
} as const;
