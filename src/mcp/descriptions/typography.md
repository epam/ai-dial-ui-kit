# Typography CSS Utility Classes

## Design-system-compliant classes (`dial-*-text`)

Use these by default. They follow the design system type scale.

| Class                             | Weight   | Size / Line-height      |
| --------------------------------- | -------- | ----------------------- |
| `.dial-display1-text`             | semibold | 32px / 48px             |
| `.dial-display2-text`             | semibold | 28px / 40px             |
| `.dial-h1-text`                   | semibold | 22px / 32px             |
| `.dial-h2-text`                   | semibold | 20px / 28px             |
| `.dial-h3-text`                   | semibold | 18px / 26px             |
| `.dial-body-text`                 | normal   | 16px / 24px             |
| `.dial-body-semi-text`            | semibold | 16px / 24px             |
| `.dial-body-paragraph-text`       | normal   | 16px / 26px             |
| `.dial-body-paragraph-semi-text`  | semibold | 16px / 26px             |
| `.dial-small-text`                | normal   | 14px / 20px             |
| `.dial-small-semi-text`           | semibold | 14px / 20px             |
| `.dial-small-paragraph-text`      | normal   | 14px / 24px             |
| `.dial-small-paragraph-semi-text` | semibold | 14px / 24px             |
| `.dial-tiny-text`                 | normal   | 12px / 16px             |
| `.dial-tiny-lead-text`            | normal   | 12px / 16px (+0.03em)   |
| `.dial-tiny-semi-text`            | semibold | 12px / 16px             |
| `.dial-caption-text`              | normal   | 10px / 12px             |
| `.dial-caption-semi-text`         | semibold | 10px / 12px (+0.06em)   |
| `.dial-code-text`                 | normal   | 14px / 20px (monospace) |

## Legacy classes (avoid in new code)

Classes like `dial-h1`, `dial-h2`, `dial-body`, `dial-small*`, `dial-tiny*`, `dial-caption` are legacy. They can be used in legacy projects if user explicidly specify they need legacy typography.

## Raw SCSS source
