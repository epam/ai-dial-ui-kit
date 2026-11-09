import { useId, type FC, type ReactNode } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { FormSectionVariant } from '@/types/form-section';

export type FormSectionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface FormSectionProps {
  /** Heading of the section; also names the `section` landmark. */
  title: ReactNode;
  /** Control at the end of the heading row — typically a small "Add" or "Change" button. */
  action?: ReactNode;
  /** Optional line under the heading saying what the section holds. */
  description?: ReactNode;
  /** Type scale of the heading and description. Defaults to `FormSectionVariant.Row`. */
  variant?: FormSectionVariant;
  /** Level of the heading element, to fit the page's outline. Defaults to `3`. */
  headingLevel?: FormSectionHeadingLevel;
  /** The section's fields or values. */
  children?: ReactNode;
  /** Additional CSS classes for the container. */
  className?: string;
  /** Additional CSS classes for the heading. */
  titleClassName?: string;
  /** Additional CSS classes for the description. */
  descriptionClassName?: string;
  /** Additional CSS classes for the content wrapper. */
  contentClassName?: string;
}

interface VariantStyles {
  header: string;
  title: string;
  description: string;
}

const VARIANT_STYLES: Record<FormSectionVariant, VariantStyles> = {
  [FormSectionVariant.Row]: {
    header: 'gap-2',
    title: 'dial-small-semi-text',
    description: 'dial-small-text',
  },
  [FormSectionVariant.Caption]: {
    header: 'gap-4',
    title: 'dial-caption-lead-semi-text',
    description: 'dial-tiny-text',
  },
  [FormSectionVariant.Setting]: {
    header: 'gap-4',
    title: 'dial-tiny-semi-text',
    description: 'dial-tiny-text',
  },
};

/**
 * A titled section of a form or a builder column: a heading with an optional
 * action at its end, an optional description and the section's content.
 * aliases: SectionRow|FieldSection|SettingsSection|FormGroup|SectionHeader
 * Design system 2.0
 *
 * The root is a `section` named by its heading, so each section is a region a
 * screen reader can jump to. `headingLevel` picks the heading element so the
 * section fits the outline of the page it is mounted in; the variant only sets
 * the type scale. The action sits at the inline end of the heading row and
 * never shrinks; the content is rendered as given, with no field styling of its
 * own. For a collapsible group, use `Accordion`; for a single labelled control,
 * the control's own `label`.
 *
 * @example
 * ```tsx
 * <FormSection
 *   title="Model"
 *   variant={FormSectionVariant.Caption}
 *   action={<GhostButton label="Change" onClick={openPicker} />}
 *   description="The model that answers in this application."
 * >
 *   <SelectedEntityCard entityId={modelId} />
 * </FormSection>
 * ```
 *
 * @param title - Heading of the section; also names the `section` landmark.
 * @param [action] - Control at the end of the heading row.
 * @param [description] - Optional line under the heading.
 * @param [variant] - Type scale of the heading and description. Defaults to `FormSectionVariant.Row`.
 * @param [headingLevel] - Level of the heading element. Defaults to `3`.
 * @param [children] - The section's fields or values.
 * @param [className] - Additional CSS classes for the container.
 * @param [titleClassName] - Additional CSS classes for the heading.
 * @param [descriptionClassName] - Additional CSS classes for the description.
 * @param [contentClassName] - Additional CSS classes for the content wrapper.
 */
export const FormSection: FC<FormSectionProps> = ({
  title,
  action,
  description,
  variant = FormSectionVariant.Row,
  headingLevel = 3,
  children,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
}) => {
  const headingId = useId();
  const styles = VARIANT_STYLES[variant];
  const Heading = `h${headingLevel}` as const;

  return (
    <section
      aria-labelledby={headingId}
      className={mergeClasses(
        'flex flex-col gap-3',
        className,
        DIAL_KIT_CLASS.formSection,
      )}
    >
      <div
        className={mergeClasses(
          'flex items-center justify-between',
          styles.header,
        )}
      >
        <Heading
          id={headingId}
          className={mergeClasses(
            'min-w-0 text-primary',
            styles.title,
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {action != null && <div className="shrink-0">{action}</div>}
      </div>
      {description != null && (
        <p
          className={mergeClasses(
            'text-secondary',
            styles.description,
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
      {children != null && (
        <div className={mergeClasses('relative', contentClassName)}>
          {children}
        </div>
      )}
    </section>
  );
};
