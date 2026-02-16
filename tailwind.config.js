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
  'accent-primary-alpha': 'var(--bg-accent-primary-alpha, #74A4FF26)',
  'accent-secondary-alpha': 'var(--bg-accent-secondary-alpha, #37BABC26)',
  'accent-tertiary-alpha': 'var(--bg-accent-tertiary-alpha, #A972FF26)',

  'model-icon': 'var(--bg-model-icon, #FFFFFF)', // TODO: use?

  // TODO: need review
  'accent-primary': 'var(--bg-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--bg-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--bg-accent-tertiary, #A972FF)',

  // TODO: need review and change names
  'red-400': 'var(--bg-red-400, #F76464)',
  'orange-400': 'var(--bg-orange-400, #D97C27)',
  'orange-800': 'var(--bg-orange-800, #B25500)',
};

const buttonsBgColors = {
  'controls-accent-primary': 'var(--controls-bg-accent-primary, #3970DA)',
  'controls-accent-primary-hover':
    'var(--controls-bg-accent-primary-hover, #215DD0)',
  'controls-error': 'var(--controls-bg-error, #CC4545)',
  'controls-error-hover': 'var(--controls-bg-error-hover, #BF3939)',
  'controls-disable-accent': 'var(--controls-bg-disable-accent, #69727C)',
  'controls-neutral-hover': 'var(--controls-bg-neutral-hover, #333942)',

  // TODO: old names, need to remove
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  'controls-accent-hover': 'var(--controls-bg-accent-hover, #4878D2)',
  'controls-accent-alpha': 'var(--controls-bg-accent-alpha, #5C8DEA2B)',
  'controls-disable': 'var(--controls-bg-disable, #7F8792)',
  'controls-enable-primary': 'var(--controls-enable-primary, #FCFCFC)',
};

const borderColors = {
  transparent: 'transparent',
  primary: 'var(--stroke-primary, #69727C)',
  secondary: 'var(--stroke-secondary, #333942)',
  tertiary: 'var(--stroke-tertiary, #090D13)',
  focus: 'var(--stroke-focus, #F3F4F6)',
  error: 'var(--stroke-error, #F76464)',
  warning: 'var(--stroke-warning, #EEC840)',
  info: 'var(--stroke-info, #74A4FF)',
  success: 'var(--stroke-success, #37BABC)',
  'accent-primary': 'var(--stroke-accent-primary, #74A4FF)',
  'accent-secondary': 'var(--stroke-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--stroke-accent-tertiary, #A972FF)',

  // TODO: need review
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  'accent-primary-hover': 'var(--stroke-accent-primary-hover, #4878d2)',
  hover: 'var(--stroke-hover, #F3F4F6)',
  'red-900': 'var(--red-900, #402027)',
};

const textColors = {
  transparent: 'transparent',
  primary: 'var(--text-primary, #F3F4F6)',
  secondary: 'var(--text-secondary, #9AA2AD)',
  error: 'var(--text-error, #F76464)',
  warning: 'var(--text-warning, #EEC840)',
  'warning-icon': 'var(--text-warning-icon, #EEC840)',
  info: 'var(--text-info, #74A4FF)',
  success: 'var(--text-success, #37BABC)',
  'accent-primary': 'var(--text-accent-primary, #74A4FF)',
  'accent-secondary': 'var(--text-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--text-accent-tertiary, #A972FF)',

  // TODO: need review
  'controls-disable': 'var(--controls-text-disable, #090D13)',
};

const placeholderColor = {
  primary: 'var(--text-primary, #F3F4F6)',
};

const buttonsTextColors = {
  'controls-permanent': 'var(--controls-text-permanent, #FCFCFC)',
  'controls-accent-disable': 'var(--controls-text-accent-disable, #333942)',
  'controls-neutral': 'var(--controls-text-neutral, #FCFCFC)',
  'controls-accent-primary-hover':
    'var(--controls-text-accent-primary-hover, #3970DA)',
  'controls-secondary-disable': 'var(--controls-secondary-disable, #5B6570)',

  // TODO: old names, need to remove
  'controls-primary': 'var(--controls-primary, #FCFCFC)',
  'controls-disable': 'var(--controls-disable, #5B6570)',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './src/**/*.scss'],
  theme: {
    backgroundColor: { ...backgroundsColors, ...buttonsBgColors },
    borderColor: borderColors,
    stroke: borderColors,
    divideColor: borderColors,
    placeholderColor: placeholderColor,
    textColor: { ...textColors, ...buttonsTextColors },
    gradientColorStops: backgroundsColors,

    extend: {
      animation: {
        'spin-steps': 'spin 0.75s steps(8, end) infinite',
      },
      boxShadow: {
        DEFAULT: '0 0 4px 0 var(--bg-blackout, #090D13B3)',
      },
      borderRadius: {
        DEFAULT: '4px',
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
              color: 'var(--text-accent-primary, #74A4FF)',
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
