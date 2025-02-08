/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(252, 61, 74)'
      },
      keyframes: {
        zoomIn: {
          from: {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3)"
          },
          "50%": {
            opacity: 1
          }
        },
        zoomOut: {
          from: {
            opacity: 1,
          },
          "50%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3)",
          },
          to: {
            opacity: 0,
          }
        },
        fadeIn: {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        },
        fadeOut: {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          }
        },
        fadeOutRight: {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
            transform: "translate3d(50%, 0, 0)"
          }
        },
        fadeInLeft: {
          from: {
            opacity: 0,
            transform: "translate3d(50%, 0, 0)"
          },
          to: {
            opacity: 1,
          }
        },
        qrLeave: {
          from: {
            right: 0,
          },
          to: {
            right: '50%',
            transform: "translateX(75%) scale3d(1.5, 1.5, 1.5)"
          }
        },
        qrEnter: {
          from: {
            right: '50%',
            transform: "translateX(75%) scale3d(1.5, 1.5, 1.5)"
          },
          to: {
            right: 0,
          }
        },
        playerEnterUp: {
          from: {
            top: "100%",
          },
          to: {
            top: "0%"
          }
        },
        playerLeaveDown: {
          from: {
            top: "0%",
          },
          to: {
            top: "100%"
          }
        },
        tooltipFadeIn: {
          from: {
            visibility: "hidden",
            opacity: 0
          },
          to: {
            visibility: "visible",
            opacity: 1
          }
        },
        sideSheetEnterRight: {
          from: {
            transform: "translateX(100%)",
          },
          to: {
            transform: "translateX(0%)",
          }
        },
        sideSheetLeaveRight: {
          to: {
            transform: "translateX(100%)",
          }
        },
        sideSheetEnterLeft: {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(0%)",
          }
        },
        sideSheetLeaveLeft: {
          to: {
            transform: "translateX(-100%)",
          }
        },
        sideSheetEnterTop: {
          from: {
            transform: "translateY(-100%)",
          },
          to: {
            transform: "translateY(0%)",
          }
        },
        sideSheetLeaveTop: {
          to: {
            transform: "translateY(-100%)",
          }
        },
        sideSheetEnterBottom: {
          from: {
            transform: "translateY(100%)",
          },
          to: {
            transform: "translateY(0%)",
          }
        },
        sideSheetLeaveBottom: {
          to: {
            transform: "translateY(100%)",
          }
        }
      },
      animation: {
      },
      fontSize: {
        zero: "0rem"
      }
    },
  },
  plugins: [],
}

