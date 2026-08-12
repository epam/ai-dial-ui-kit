# Typography CSS Utility Classes

## Design-system-compliant classes (`dial-*-text`)

Use these by default. They follow the design system type scale.

| Class                             | Design name                 | Weight   | Size / Line-height                  |
| --------------------------------- | --------------------------- | -------- | ----------------------------------- |
| `.dial-display1-text`             | Display 1                   | semibold | 32px / 48px                         |
| `.dial-display2-text`             | Display 2                   | semibold | 28px / 40px                         |
| `.dial-display3-text`             | Display 3                   | semibold | 22px / 32px                         |
| `.dial-h1-text`                   | Heading 1                   | semibold | 20px / 28px                         |
| `.dial-h2-text`                   | Heading 2                   | semibold | 18px / 26px                         |
| `.dial-h3-text`                   | Heading 3                   | semibold | 16px / 24px                         |
| `.dial-body-text`                 | Body Text                   | normal   | 16px / 24px                         |
| `.dial-body-semi-text`            | Body Text (Semi Bold)       | semibold | 16px / 24px                         |
| `.dial-body-paragraph-text`       | Body Paragraph              | normal   | 16px / 26px                         |
| `.dial-body-paragraph-semi-text`  | Body Paragraph (Semi Bold)  | semibold | 16px / 26px                         |
| `.dial-small-text`                | Small Text                  | normal   | 14px / 20px                         |
| `.dial-small-semi-text`           | Small Text (Semi Bold)      | semibold | 14px / 20px                         |
| `.dial-small-paragraph-text`      | Small Paragraph             | normal   | 14px / 24px                         |
| `.dial-small-paragraph-semi-text` | Small Paragraph (Semi Bold) | semibold | 14px / 24px                         |
| `.dial-tiny-text`                 | Tiny Text                   | normal   | 12px / 16px                         |
| `.dial-tiny-lead-text`            | Tiny Text Lead              | normal   | 12px / 16px (+0.03em, uppercase)    |
| `.dial-tiny-semi-text`            | Tiny Text (Semi Bold)       | semibold | 12px / 16px                         |
| `.dial-tiny-lead-semi-text`       | Tiny Text Lead (Semi Bold)  | semibold | 12px / 16px (+0.03em, uppercase)    |
| `.dial-caption-text`              | Caption                     | normal   | 10px / 12px                         |
| `.dial-caption-lead-semi-text`    | Caption Lead (Semi Bold)    | semibold | 10px / 12px (+0.06em, uppercase)    |
| `.dial-code-text`                 | Code                        | normal   | 14px / 20px (Fira Code / monospace) |

The three `*-lead-*` classes apply `text-transform: uppercase` themselves — pass them the sentence-case string, not a pre-uppercased one, so the accessible name stays readable.

`.dial-code-text` resolves its family through `var(--theme-font-mono, var(--font-fira-code, 'Fira Code'))` before falling back to the system monospace stack. The kit ships no font file; the host provides the face.

## Legacy classes (avoid in new code)

Classes like `dial-h1`, `dial-h2`, `dial-body`, `dial-small*`, `dial-tiny*`, `dial-caption` are legacy. They can be used in legacy projects if user explicidly specify they need legacy typography.

## Raw SCSS source
