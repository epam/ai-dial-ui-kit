// Default color palette is light when no themes presented

const backgroundsColors = {
  transparent: 'transparent',
  'layer-sunken': 'var(--bg-layer-sunken, #EEF1F7)', // grey-300
  'layer-base': 'var(--bg-layer-base, #F5F7FA)', // grey-200
  'layer-raised': 'var(--bg-layer-raised, #FCFCFC)', // grey-100
  error: 'var(--bg-error, #F3D6D8)', // red-100
  warning: 'var(--bg-warning, #FAF0CF)', // yellow-100
  info: 'var(--bg-info, #E1EAF9)', // blue-100
  success: 'var(--bg-success, #DBF1EB)', // green-100
  backdrop: 'var(--bg-backdrop, #161B2D4D)', // grey-1000 with 70% opacity
};

const controlsBgColors = {
  'control-accent-alpha': 'var(--bg-control-accent-alpha, #2764D90F)', // blue-500 alpha-6
  'control-accent-alpha-hover':
    'var(--bg-control-accent-alpha-hover, #2764D924)', // blue-500 alpha-14
  'control-accent-alpha-active':
    'var(--bg-control-accent-alpha-active, #2764D933)', // blue-500 alpha-20

  'control-accent': 'var(--bg-control-accent, #124ACE)', // blue-500

  'control-neutral': 'var(--bg-control-neutral, #FCFCFC)', // grey-100
  'control-neutral-hover': 'var(--bg-control-neutral-hover, #E0E6F0)', // grey-500
  'control-neutral-active': 'var(--bg-control-neutral-active, #D1DBEA)', // grey-600

  'control-error': 'var(--bg-control-error, #AE2F2F)', // red-800
  'control-error-hover': 'var(--bg-control-error-hover, #BF3939)', // red-700
  'control-error-active': 'var(--bg-control-error-active, #CC4545)', // red-600
  'control-error-alpha-hover': 'var(--bg-control-error-alpha-hover, #F764641A)', // red-800 alpha-10
  'control-error-alpha-active':
    'var(--bg-control-error-alpha-active, #F7646433)', // red-800 alpha-20

  'control-disable': 'var(--bg-control-disable, #DCE0E8)', // grey-550
};

const borderColors = {
  transparent: 'transparent',
  primary: 'var(--stroke-primary, #6B7280)', // grey-800
  secondary: 'var(--stroke-secondary, #D1DBEA)', // grey-600
  tertiary: 'var(--stroke-tertiary, #E0E6F0)', // grey-500
  error: 'var(--stroke-error, #AE2F2F)', // red-800
  warning: 'var(--stroke-warning, #EEC840)', // yellow-500
  info: 'var(--stroke-info, #124ACE)', // blue-500
  success: 'var(--stroke-success, #007274)', // green-800
  // controls
  'hover-alpha': 'var(--stroke-hover-alpha, #2764D933)', // blue-500 alpha-20
  'focus-black': 'var(--stroke-focus-black, var(--stroke-focus, #161B2D))', // grey-1000
  'focus-blue': 'var(--stroke-focus-blue, #6785FB)', // blue-200
  'accent-alpha': 'var(--stroke-accent-alpha, #2764D933)', // blue-500 alpha-20
  'error-alpha': 'var(--stroke-error-alpha, #AE2F2F73)', // red-800 alpha-45
};

const textColors = {
  transparent: 'transparent',
  primary: 'var(--text-primary, #161B2D)', // grey-1000
  secondary: 'var(--text-secondary, #57647a)', // grey-800
  tertiary: 'var(--text-tertiary, #848e9c)', // grey-700
  accent: 'var(--text-accent, #1D4ED8)', // blue-500
  error: 'var(--text-error, #AE2F2F)', // red-500
  warning: 'var(--text-warning, #7F6300)', // yellow-700
  'warning-icon': 'var(--text-warning-icon, #EEC840)', // yellow-500
  info: 'var(--text-info, #1D4ED8)', // blue-500
  success: 'var(--text-success, #007274)', // green-800
};

const placeholderColor = {
  primary: 'var(--text-primary, #161B2D)', // grey-1000
  secondary: 'var(--controls-text-secondary-disable, #575F73)',
};

const controlsTextColors = {
  'control-permanent': 'var(--text-control-permanent, #FCFCFC)', // grey-100
  'control-disable-alpha': 'var(--text-control-disable-alpha, #848E9C)', // grey-700
  'control-disable-beta': 'var(--text-control-disable-beta, #DCE0E8)', // grey-550
  'control-blue-hover': 'var(--text-control-blue-hover, #5976E9)', // blue-300
  'control-blue-active': 'var(--text-control-blue-active, #6785FB)', // blue-200
};

// TODO: remove colors
const backgroundsColorsToRemove = {
  'layer-0': 'var(--bg-layer-0, #FCFCFC)',
  'layer-1': 'var(--bg-layer-1, #E0E6F0)',
  'layer-2': 'var(--bg-layer-2, #EEF1F7)',
  'layer-3': 'var(--bg-layer-3, #FCFCFC)',
  'layer-4': 'var(--bg-layer-4, #D1DBEA)',
  blackout: 'var(--bg-blackout, #0C101D4D)',
  error: 'var(--bg-error, #F3D6D8)',
  warning: 'var(--bg-warning, #FAF0CF)',
  info: 'var(--bg-info, #D6E2F9)',
  success: 'var(--bg-success, #D9F0F1)',
  neutral: 'var(--bg-neutral, #FCFCFC)',
  'accent-primary-alpha': 'var(--bg-accent-primary-alpha, #7DA4FF26)',
  'accent-secondary-alpha': 'var(--bg-accent-secondary-alpha, #37BABC2E)',
  'accent-tertiary-alpha': 'var(--bg-accent-tertiary-alpha, #A972FF2E)',
  'accent-primary': 'var(--bg-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--bg-accent-secondary, #37BABC)',
  'red-400': 'var(--bg-red-400, #F76464)',

  // controls

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
  'controls-enable-primary': 'var(--controls-enable-primary, #FCFCFC)',
};

const borderColorsToRemove = {
  'accent-primary': 'var(--stroke-accent-primary, #124ACE)',
  'accent-secondary': 'var(--stroke-accent-secondary, #007274)',
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  hover: 'var(--stroke-hover, #EEF1F7)',
  'red-900': 'var(--red-900, #402027)',
};

const textColorsToRemove = {
  'accent-primary': 'var(--text-accent-primary, #7DA4FF)',
  'accent-secondary': 'var(--text-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--text-accent-tertiary, #A972FF)',
  // Controls
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
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './src/**/*.scss'],
  theme: {
    backgroundColor: {
      ...backgroundsColors,
      ...backgroundsColorsToRemove,
      ...controlsBgColors,
    },
    borderColor: {
      ...borderColors,
      ...borderColorsToRemove,
    },
    stroke: {
      ...borderColors,
      ...borderColorsToRemove,
    },
    divideColor: {
      ...borderColors,
      ...borderColorsToRemove,
    },
    placeholderColor: placeholderColor,
    textColor: { ...textColors, ...textColorsToRemove, ...controlsTextColors },
    gradientColorStops: backgroundsColors,

    extend: {
      // `outline` utility emits a 1px solid ring, `outline-focus-black` paints it
      // with the focus token — see the focus-visible states in buttons.scss
      outlineWidth: { DEFAULT: '1px' },
      outlineColor: {
        ...borderColors,
        ...borderColorsToRemove,
      },
      screens: {
        mobile: { max: '768px' },
        desktop: { min: '769px' },
      },
      animation: {
        'spin-steps': 'spin 0.75s steps(8, end) infinite',
      },
      boxShadow: {
        DEFAULT: '0 0 4px 0 var(--shadow-default, rgba(0, 0, 0, 0.30))',
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
      backgroundImage: {
        'control-accent-gradient':
          'linear-gradient(99.78deg, var(--bg-control-accent-gradient-from, #1D4ED8) 8.59%, var(--bg-control-accent-gradient-to, #885DF2) 98.14%)',
        'control-accent-gradient-hover':
          'linear-gradient(99.78deg, var(--bg-control-accent-gradient-hover-from, #6785FB) 8.59%, var(--bg-control-accent-gradient-to, #885DF2) 98.14%)',
        'control-accent-gradient-active':
          'linear-gradient(99.78deg, var(--bg-control-accent-gradient-from, #1D4ED8) 8.59%, var(--bg-control-accent-gradient-active-to, #7C3AED) 98.14%)',
      },
      colors: {
        transparent: 'transparent',
      },
      fontFamily: {
        DEFAULT: ['var(--theme-font, var(--font-inter))'],
        // The kit ships no font file: the host supplies the face and we only
        // name it, mirroring the `--theme-font` / `--font-inter` hook above.
        mono: [
          "var(--theme-font-mono, var(--font-fira-code, 'Fira Code'))",
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
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
              color: 'var(--text-accent, #1D4ED8)',
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
