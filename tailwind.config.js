const backgroundsColors = {
  transparent: 'transparent',
  'layer-0': 'var(--bg-layer-0, #000000)',
  'layer-1': 'var(--bg-layer-1, #090D13)',
  'layer-2': 'var(--bg-layer-2, #141A23)',
  'layer-3': 'var(--bg-layer-3, #222932)',
  'layer-4': 'var(--bg-layer-4, #333942)',
  blackout: 'var(--bg-blackout, #090D13B3)',
  error: 'var(--bg-error, #402027)',
  warning: 'var(--bg-warning, #3F3D25)',
  info: 'var(--bg-info, #1C2C47)',
  success: 'var(--bg-success, #1D3841)',
  'model-icon': 'var(--bg-model-icon, #FFFFFF)',
  'accent-primary': 'var(--bg-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--bg-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--bg-accent-tertiary, #A972FF)',
  'accent-primary-alpha': 'var(--bg-accent-primary-alpha, #5C8DEA2B)',
  'accent-secondary-alpha': 'var(--bg-accent-secondary-alpha, #37BABC26)',
  'accent-tertiary-alpha': 'var(--bg-accent-tertiary-alpha, #A972FF2B)',
  'red-400': 'var(--bg-red-400, #F76464)',
  'red-800': 'var(--bg-red-800, #AE2F2F)',
  'orange-400': 'var(--bg-orange-400, #D97C27)',
  'orange-800': 'var(--bg-orange-800, #B25500)',
};

const buttonsBgColors = {
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  'controls-accent-hover': 'var(--controls-bg-accent-hover, #4878D2)',
  'controls-accent-alpha': 'var(--controls-bg-accent-alpha, #5C8DEA2B)',
  'controls-secondary': 'var(--controls-secondary, #333942)',
  'controls-disable': 'var(--controls-bg-disable, #7F8792)',
  'controls-enable-primary': 'var(--controls-enable-primary, #FCFCFC)',
  'controls-enable-secondary': 'var(--controls-enable-secondary, #FCFCFC)',
};

const borderColors = {
  transparent: 'transparent',
  primary: 'var(--stroke-primary, #333942)',
  secondary: 'var(--stroke-secondary, #222932)',
  tertiary: 'var(--stroke-tertiary, #090D13)',
  error: 'var(--stroke-error, #F76464)',
  hover: 'var(--stroke-hover, #F3F4F6)',
  'accent-primary': 'var(--stroke-accent-primary, #5C8DEA)',
  'accent-primary-hover': 'var(--stroke-accent-primary-hover, #4878d2)',
  'accent-secondary': 'var(--stroke-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--stroke-accent-tertiary, #A972FF)',
  'red-900': 'var(--red-900, #402027)',
  'icon-secondary': 'var(--icon-secondary, #7F8792)',
};

const textColors = {
  transparent: 'transparent',
  white: 'var(--text-white, #FFFFFF)',
  primary: 'var(--text-primary, #F3F4F6)',
  secondary: 'var(--text-secondary, #7F8792)',
  error: 'var(--text-error, #F76464)',
  'accent-primary': 'var(--text-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--text-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--text-accent-tertiary, #A972FF)',
  'controls-permanent': 'var(--controls-text-permanent, #FCFCFC)',
  'controls-disable': 'var(--controls-text-disable, #333942)',
};

const buttonsTextColors = {
  'controls-primary': 'var(--controls-primary, #FCFCFC)',
  'controls-accent': 'var(--controls-accent, #5c8dea)',
  'controls-disable': 'var(--controls-disable, #333942)',
};

const iconColors = {
  'icon-error': 'var(--icon-error, #F76464)',
  'icon-accent-secondary': 'var(--icon-accent-secondary, #37BABC)',
  'icon-accent-tertiary': 'var(--icon-accent-tertiary, #A972FF)',
  'icon-accent-primary': 'var(--icon-accent-primary, #5C8DEA)',
  'icon-secondary': 'var(--icon-secondary, #7F8792)',
  'icon-primary': 'var(--icon-primary, #F3F4F6)',
};

/** @type {import('tailwindcss').Config} */
export default {
  important: '.dial',
  content: ['./src/**/*.{ts,tsx}', './src/**/*.scss'],
  theme: {
    backgroundColor: { ...backgroundsColors, ...buttonsBgColors },
    borderColor: borderColors,
    stroke: borderColors,
    divideColor: borderColors,
    textColor: { ...textColors, ...buttonsTextColors, ...iconColors },
    gradientColorStops: backgroundsColors,
    extend: {
      animation: {
        'spin-steps': 'spin 0.75s steps(8, end) infinite',
      },
      boxShadow: {
        DEFAULT: '0 0 4px 0 var(--bg-blackout, #090D13B3)',
      },
      borderRadius: {
        DEFAULT: '3px',
      },
      opacity: {
        15: '15%',
      },
      colors: {
        transparent: 'transparent',
      },
      fontFamily: {
        DEFAULT: ['var(--theme-font, var(--font-inter))'],
      },
      fontSize: {
        xxs: '10px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-primary, #F3F4F6)',
            a: {
              color: 'var(--text-accent-primary, #5C8DEA)',
            },
            pre: {
              border: 'none',
              borderRadius: '0',
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
