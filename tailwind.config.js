const backgroundsColors = {
  transparent: 'transparent',
  'layer-0': 'var(--bg-layer-0, #000000)',
  'layer-1': 'var(--bg-layer-1, #090D13)',
  'layer-2': 'var(--bg-layer-2, #141A23)',
  'layer-3': 'var(--bg-layer-3, #222932)',
  'layer-4': 'var(--bg-layer-4, #333942)',
  blackout: 'var(--bg-blackout, #090D13B2)',
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
  'red-800': 'var(--bg-red-800, #AE2F2F)',
  'orange-400': 'var(--bg-orange-400, #D97C27)',
  'orange-800': 'var(--bg-orange-800, #B25500)',
};

const buttonsBgColors = {
  'controls-solid-primary': 'var(--controls-bg-solid-primary, #3970DA)',
  'controls-solid-primary-hover':
    'var(--controls-bg-solid-primary-hover, #215DD0)',
  'controls-solid-error': 'var(--controls-bg-solid-error, #CC4545)',
  'controls-solid-error-hover': 'var(--controls-bg-solid-error-hover, #AE2F2F)',
  'controls-solid-disable': 'var(--controls-bg-solid-disable, #69727C)',
  'controls-outlined-neutral-hover':
    'var(--controls-bg-outlined-neutral-hover, #333942)',

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
  secondary: 'var(--stroke-secondary, #222932)',
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

// TODO: need review
const buttonsTextColors = {
  'controls-solid': 'var(--controls-text-solid, #FCFCFC)',
  'controls-solid-disable': 'var(--controls-text-solid-disable, #333942)',
  'controls-outlined': 'var(--controls-text-outlined, #FCFCFC)',
  'controls-link-primary-hover':
    'var(--controls-text-link-primary-hover, #3970DA)',
  'controls-disable': 'var(--controls-text-disable, #5B6570)',

  // TODO: old names, need to remove
  'controls-primary': 'var(--controls-primary, #FCFCFC)',
  'controls-disable': 'var(--controls-disable, #333942)',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./src/**/*.{html,js,ts,tsx,yaml}'],
  theme: {
    backgroundColor: { ...backgroundsColors, ...buttonsBgColors },
    borderColor: borderColors,
    stroke: borderColors,
    divideColor: borderColors,
    placeholderColor: placeholderColor,
    textColor: { ...textColors, ...buttonsTextColors },
    gradientColorStops: backgroundsColors,

    extend: {
      boxShadow: {
        DEFAULT: '0 0 4px 0 var(--bg-blackout, #090D13B2)',
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
