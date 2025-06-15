import type { ISourceOptions } from "@tsparticles/engine";

export const particlesOptions: ISourceOptions = {
  fpsLimit: 120,
  particles: {
    color: {
      value: "#000",
    },
    // shape: {
    //   type: "emoji",
    //   options: {
    //     emoji: {
    //       value: "👾"
    //     }
    //   }
    // },
    move: {
      enable: true,
      speed: {
        min: 0.1,
        max: 1,
      },
    },
    number: {
      value: 128,
    },
    opacity: {
      value: {
        min: 0.05,
        max: 0.5,
      },
      animation: {
        enable: true,
        speed: 0.5,
      },
    },
    size: {
      value: {
        min: 2,
        max: 4,
      },
    },
  },
} as const;
