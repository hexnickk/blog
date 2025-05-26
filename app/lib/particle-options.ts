import type { ISourceOptions } from "@tsparticles/engine";

export const particlesOptions: ISourceOptions = {
  fpsLimit: 120,
  particles: {
    // color: {
    //   value: "#ffffff",
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
        min: 0.1,
        max: 1,
      },
      animation: {
        enable: true,
        speed: 1,
      },
    },
    shape: {
      type: "emoji",
      options: {
        emoji: {
          value: "👾"
        }
      }
    },
    size: {
      value: {
        min: 2,
        max: 12,
      },
    },
  },
} as const;
