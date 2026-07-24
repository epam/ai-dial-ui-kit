// Default color palette is light when no themes presented

const backgroundsColors = {
  transparent: 'transparent',
  'layer-0': 'var(--bg-layer-0, #FCFCFC)',
  'layer-1': 'var(--bg-layer-1, #E0E6F0)',
  'layer-2': 'var(--bg-layer-2, #EEF1F7)',
  'layer-3': 'var(--bg-layer-3, #FCFCFC)',
  'layer-4': 'var(--bg-layer-4, #D1DBEA)',
  'layer-5': 'var(--bg-layer-5, #F5F7FA)',
  'layer-6': 'var(--bg-layer-6, #F8FAFC)',
  'layer-7': 'var(--bg-layer-7, #00000006)',
  'layer-8': 'var(--bg-layer-8, #f0f2f5)',
  blackout: 'var(--bg-blackout, #0C101D4D)',
  overlay: 'var(--bg-overlay, #FCFCFC80)',
  error: 'var(--bg-error, #F3D6D8)',
  warning: 'var(--bg-warning, #FAF0CF)',
  info: 'var(--bg-info, #D6E2F9)',
  success: 'var(--bg-success, #D9F0F1)',
  neutral: 'var(--bg-neutral, #FCFCFC)',
  inverted: 'var(--bg-inverted, #161B2D)',
  secondary: 'var(--text-secondary, #9FA6BD)',
  'accent-primary-alpha': 'var(--bg-accent-primary-alpha, #7DA4FF26)',
  'accent-secondary-alpha': 'var(--bg-accent-secondary-alpha, #37BABC2E)',
  'accent-tertiary-alpha': 'var(--bg-accent-tertiary-alpha, #A972FF2E)',

  // TODO: need review
  'accent-primary': 'var(--bg-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--bg-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--bg-accent-tertiary, #A972FF)',

  // TODO: need review and change names
  'red-400': 'var(--bg-red-400, #F76464)',
  'orange-400': 'var(--bg-orange-400, #D97C27)',
  'orange-800': 'var(--bg-orange-800, #B25500)',

  // new colors
  'layer-sunken': 'var(--bg-layer-sunken, #EEF1F7)',
  'layer-base': 'var(--bg-layer-base, #F5F7FA)',
  'layer-raised': 'var(--bg-layer-raised, #FCFCFC)',
  error: 'var(--bg-error, #F3D6D8)',
  warning: 'var(--bg-warning, #FAF0CF)',
  info: 'var(--bg-info, #E1EAF9)',
  success: 'var(--bg-success, #DBF1EB)',
  backdrop: 'var(--bg-backdrop, #0C101D4D)',

  // shadow colors
  'shadow-blue': 'var(--shadow-blue-500, #2764D924)',
  'shadow-grey': 'var(--shadow-grey-1000, #161B2D08)',
};

const controlsBgColors = {
  'controls-accent-primary': 'var(--controls-bg-accent-primary, #124ACE)',
  'controls-accent-primary-hover':
    'var(--controls-bg-accent-primary-hover, #2656D9)',
  'controls-accent-primary-active':
    'var(--controls-bg-accent-primary-active, #3664E2)',
  'controls-accent-primary-alpha-active':
    'var(--controls-bg-accent-primary-alpha-active, #7DA4FF5C)',

  'controls-accent-secondary-alpha-active':
    'var(--controls-bg-accent-secondary-alpha-active, #37BABC5C)',

  'controls-accent-tertiary-alpha-active':
    'var(--controls-bg-accent-tertiary-alpha-active, #A972FF5C)',

  'controls-error': 'var(--controls-bg-error, #AE2F2F)',
  'controls-error-hover': 'var(--controls-bg-error-hover, #BF3939)',
  'controls-error-active': 'var(--controls-bg-error-active, #CC4545)',
  'controls-error-alpha-hover': 'var(--controls-bg-alpha-hover, #F764642E)',
  'controls-error-alpha-active':
    'var(--controls-bg-error-alpha-active, #F764645C)',

  'controls-disable-accent': 'var(--controls-bg-disable-accent, #7C8293)',
  'controls-disable': 'var(--controls-bg-disable, #D1DBEA)',

  'controls-neutral-hover': 'var(--controls-bg-neutral-hover, #D1DBEA)',
  'controls-neutral-active': 'var(--controls-bg-neutral-active, #9FA6BD)',

  'controls-accent-success-alpha-hover':
    'var(--controls-bg-accent-success-alpha-hover, #37BABC2E)',
  'controls-accent-success-alpha-active':
    'var(--controls-bg-accent-success-alpha-active, #37BABC5C)',
  // TODO: old names, need to remove
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  'controls-accent-hover': 'var(--controls-bg-accent-hover, #4878D2)',
  'controls-accent-alpha': 'var(--controls-bg-accent-alpha, #5C8DEA2B)',
  'controls-enable-primary': 'var(--controls-enable-primary, #FCFCFC)',

  // new colors
  'control-accent-alpha': 'var(--bg-control-accent-alpha, #2764D914)',
  'control-accent-alpha-hover':
    'var(--bg-control-accent-alpha-hover, #2764D924)',
  'control-accent-alpha-active':
    'var(--bg-control-accent-alpha-active, #2764D933)',

  'control-accent': 'var(--bg-control-accent, #124ACE)',

  'control-neutral': 'var(--bg-control-neutral, #FCFCFC)',
  'control-neutral-hover': 'var(--bg-control-neutral-hover, #E0E6F0)',
  'control-neutral-active': 'var(--bg-control-neutral-active, #D1DBEA)',

  'control-error': 'var(--bg-control-error, #AE2F2F)',
  'control-error-hover': 'var(--bg-control-error-hover, #BF3939)',
  'control-error-active': 'var(--bg-control-error-active, #CC4545)',
  'control-disable': 'var(--bg-control-disable, #C7CBD4)',
};

const borderColors = {
  'accent-primary': 'var(--stroke-accent-primary, #124ACE)',
  'accent-primary-hover': 'var(--stroke-accent-primary-hover, #7DA4FF)',
  'accent-secondary': 'var(--stroke-accent-secondary, #007274)',
  'accent-tertiary': 'var(--stroke-accent-tertiary, #7E39EC)',
  'hover-tint': 'var(--stroke-hover-tint, #0000001f)',
  hairline: 'var(--stroke-hairline, #0000000d)',

  // new colors
  transparent: 'transparent',
  primary: 'var(--stroke-primary, #7C8293)',
  secondary: 'var(--stroke-secondary, #D1DBEA)',
  tertiary: 'var(--stroke-tertiary, #E0E6F0)',
  error: 'var(--stroke-error, #AE2F2F)',
  warning: 'var(--stroke-warning, #EEC840)',
  info: 'var(--stroke-info, #2764D9)',
  success: 'var(--stroke-success, #007274)',
  // controls
  focus: 'var(--stroke-focus, #161B2D)',
  'accent-alpha': 'var(--stroke-accent-alpha, #2764D933)',

  // TODO: need review
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  'accent-primary-hover': 'var(--stroke-accent-primary-hover, #4878d2)',
  hover: 'var(--stroke-hover, #EEF1F7)',
  'red-900': 'var(--red-900, #402027)',
};

const controlsBorderColors = {
  'controls-focus': 'var(--controls-stroke-focus, #EEF1F7)',
};

const textColors = {
  // new colors
  transparent: 'transparent',
  primary: 'var(--text-primary, #161B2D)',
  secondary: 'var(--text-secondary, #575F73)',
  tertiary: 'var(--text-tertiary, #808898)', // TODO: ASK Dash 808898 or C7CBD4
  accent: 'var(--text-accent, #2764D9)',
  error: 'var(--text-error, #AE2F2F)',
  warning: 'var(--text-warning, #7F6300)',
  'warning-icon': 'var(--text-warning-icon, #EEC840)',
  info: 'var(--text-info, #2764D9)',
  success: 'var(--text-success, #007274)',

  // TODO: need review
  'accent-primary': 'var(--text-accent-primary, #7DA4FF)',
  'accent-secondary': 'var(--text-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--text-accent-tertiary, #A972FF)',
  'controls-disable': 'var(--controls-text-disable, #0C101D)',
};

const placeholderColor = {
  primary: 'var(--text-primary, #161B2D)',
  secondary: 'var(--controls-text-secondary-disable, #575F73)',
};

const controlsTextColors = {
  // ui kit
  'controls-permanent': 'var(--controls-text-permanent, #FCFCFC)',
  'controls-accent-disable': 'var(--controls-text-accent-disable, #D1DBEA)',
  'controls-primary-disable': 'var(--controls-text-primary-disable, #696E7C)',
  'controls-secondary-disable':
    'var(--controls-text-secondary-disable, #9FA6BD)',
  'controls-neutral': 'var(--controls-text-neutral, #161B2D)',
  'controls-accent-primary-hover':
    'var(--controls-text-accent-primary-hover, #3664E2)',
  'controls-accent-primary-active':
    'var(--controls-text-accent-primary-active, #7DA4FF)',

  // new colors
  'control-permanent': 'var(--text-control-permanent, #FCFCFC)',
  'control-disable': 'var(--text-control-disable, #7C8293)',

  // TODO: old names, need to remove
  'controls-primary': 'var(--controls-primary, #FCFCFC)',
  'controls-disable': 'var(--controls-text-disable, #575F73)',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './src/**/*.scss'],
  theme: {
    backgroundColor: { ...backgroundsColors, ...controlsBgColors },
    borderColor: { ...borderColors, ...controlsBorderColors },
    stroke: { ...borderColors, ...controlsBorderColors },
    divideColor: { ...borderColors, ...controlsBorderColors },
    placeholderColor: placeholderColor,
    textColor: { ...textColors, ...controlsTextColors },
    gradientColorStops: backgroundsColors,

    extend: {
      screens: {
        mobile: { max: '768px' },
        desktop: { min: '769px' },
      },
      animation: {
        'spin-steps': 'spin 0.75s steps(8, end) infinite',
      },
      boxShadow: {
        DEFAULT: '0 0 4px 0 var(--shadow-default, rgba(0, 0, 0, 0.30))',
        'main-inset': 'inset 1px 0 8px rgba(0, 0, 0, 0.04)',
        'main-inset-rtl': 'inset -1px 0 8px rgba(0, 0, 0, 0.04)',
        xs: '0 1px 4px 0 var(--shadow-grey-1000, #161B2D08), 0 1px 2px 0 var(--shadow-blue-500, #2764D924)',
        sm: '0 2px 12px 0 var(--shadow-grey-1000, #161B2D08), 0 2px 6px 0 var(--shadow-blue-500, #2764D924)',
        md: '0 6px 24px 0 var(--shadow-grey-1000, #161B2D08), 0 6px 16px 0 var(--shadow-blue-500, #2764D924)',
        lg: '0 10px 36px 0 var(--shadow-grey-1000, #161B2D08), 0 10px 24px 0 var(--shadow-blue-500, #2764D924)',
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 100ms ease-in',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-primary, #161B2D)',
            a: {
              color: 'var(--text-accent-primary, #124ACE)',
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
