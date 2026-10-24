import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { FormSectionVariant } from '@/types/form-section';

import { FormSection } from './FormSection';

describe('Dial UI Kit :: FormSection', () => {
  test('renders the title as an h3 and names the region after it', () => {
    render(<FormSection title="Model">Content</FormSection>);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Model' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Model' })).toHaveTextContent(
      'Content',
    );
  });

  test('renders the heading at the given level', () => {
    render(<FormSection title="Model" headingLevel={2} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Model' }),
    ).toBeInTheDocument();
  });

  test('renders the description when given and omits it otherwise', () => {
    const { rerender } = render(
      <FormSection title="Variables" description="Passed to the runtime." />,
    );

    expect(screen.getByText('Passed to the runtime.')).toBeInTheDocument();

    rerender(<FormSection title="Variables" />);

    expect(
      screen.queryByText('Passed to the runtime.'),
    ).not.toBeInTheDocument();
  });

  test('renders the action and leaves it interactive', async () => {
    const onClick = vi.fn();
    render(
      <FormSection
        title="Variables"
        action={
          <button type="button" onClick={onClick}>
            Add
          </button>
        }
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  test('sets the heading type scale from the variant', () => {
    const { rerender } = render(<FormSection title="Skills" />);
    const heading = () => screen.getByRole('heading', { name: 'Skills' });

    expect(heading()).toHaveClass('dial-small-semi-text');

    rerender(
      <FormSection title="Skills" variant={FormSectionVariant.Caption} />,
    );
    expect(heading()).toHaveClass('dial-caption-lead-semi-text');

    rerender(
      <FormSection title="Skills" variant={FormSectionVariant.Setting} />,
    );
    expect(heading()).toHaveClass('dial-tiny-semi-text');
  });

  test('merges the caller classes onto the root, title, description and content', () => {
    render(
      <FormSection
        title="Model"
        description="Answers in the app."
        className="custom-root"
        titleClassName="custom-title"
        descriptionClassName="custom-description"
        contentClassName="custom-content"
      >
        Content
      </FormSection>,
    );

    expect(screen.getByRole('region', { name: 'Model' })).toHaveClass(
      'custom-root',
    );
    expect(screen.getByRole('heading', { name: 'Model' })).toHaveClass(
      'custom-title',
    );
    expect(screen.getByText('Answers in the app.')).toHaveClass(
      'custom-description',
    );
    expect(screen.getByText('Content')).toHaveClass('custom-content');
  });
});
