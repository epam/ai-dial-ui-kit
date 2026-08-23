import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { RadioGroupPopupField } from './RadioGroupPopupField';

const items = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In review' },
  { value: 'published', label: 'Published' },
];

const baseProps = {
  items,
  header: 'Select status',
  labelProps: { label: 'Status' },
  placeholder: 'None',
};

describe('Dial UI Kit :: RadioGroupPopupField', () => {
  test('shows the placeholder while nothing is selected', () => {
    render(<RadioGroupPopupField {...baseProps} onApply={vi.fn()} />);

    expect(screen.getByText('None')).toBeInTheDocument();
  });

  test("shows the selected option's label", () => {
    render(
      <RadioGroupPopupField {...baseProps} value="review" onApply={vi.fn()} />,
    );

    expect(screen.getByText('In review')).toBeInTheDocument();
    expect(screen.queryByText('None')).not.toBeInTheDocument();
  });

  test('shows customValue in place of the option label', () => {
    render(
      <RadioGroupPopupField
        {...baseProps}
        value="draft"
        customValue="Draft (auto-saved)"
        onApply={vi.fn()}
      />,
    );

    expect(screen.getByText('Draft (auto-saved)')).toBeInTheDocument();
    expect(screen.queryByText('Draft')).not.toBeInTheDocument();
  });

  test('names the field with its label followed by the current value', () => {
    render(
      <RadioGroupPopupField {...baseProps} value="review" onApply={vi.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: 'Status In review' }),
    ).toBeInTheDocument();
  });

  test('names the field with ariaLabel when there is no visible label', () => {
    render(
      <RadioGroupPopupField
        {...baseProps}
        labelProps={undefined}
        ariaLabel="Status"
        value="draft"
        onApply={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Status Draft' }),
    ).toBeInTheDocument();
  });

  test('announces the field as collapsed until it is opened', async () => {
    const user = userEvent.setup();
    render(<RadioGroupPopupField {...baseProps} onApply={vi.fn()} />);

    const field = screen.getByRole('button', { name: 'Status None' });

    expect(field).toHaveAttribute('aria-haspopup', 'dialog');
    expect(field).toHaveAttribute('aria-expanded', 'false');

    await user.click(field);

    expect(field).toHaveAttribute('aria-expanded', 'true');
  });

  test('opens a dialog named by the header, holding the options', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroupPopupField {...baseProps} value="review" onApply={vi.fn()} />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Status In review' }));

    expect(
      screen.getByRole('dialog', { name: 'Select status' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'In review' })).toBeChecked();
  });

  test('does not open while disabled', async () => {
    const user = userEvent.setup();
    render(<RadioGroupPopupField {...baseProps} disabled onApply={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Status None' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('applies the selection and closes', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(
      <RadioGroupPopupField {...baseProps} value="draft" onApply={onApply} />,
    );

    await user.click(screen.getByRole('button', { name: 'Status Draft' }));
    await user.click(screen.getByRole('radio', { name: 'Published' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onApply).toHaveBeenCalledWith('published');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('commits nothing on cancel and forgets the draft', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <RadioGroupPopupField
        {...baseProps}
        value="draft"
        onApply={onApply}
        onCancel={onCancel}
        onClose={onClose}
      />,
    );

    const field = screen.getByRole('button', { name: 'Status Draft' });

    await user.click(field);
    await user.click(screen.getByRole('radio', { name: 'Published' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onApply).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(field);

    expect(screen.getByRole('radio', { name: 'Draft' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Published' })).not.toBeChecked();
  });

  test('reflects the committed value after an apply into a controlled parent', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState('draft');

      return (
        <RadioGroupPopupField
          {...baseProps}
          value={value}
          onApply={(next) => setValue(next ?? '')}
        />
      );
    };
    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Status Draft' }));
    await user.click(screen.getByRole('radio', { name: 'Published' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(
      screen.getByRole('button', { name: 'Status Published' }),
    ).toBeInTheDocument();
  });

  test('disables Apply while the selection is not valid', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroupPopupField {...baseProps} isValid={false} onApply={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Status None' }));

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  test('lets the parent drive the draft selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <RadioGroupPopupField
        {...baseProps}
        value="draft"
        selectedValue="review"
        onSelectionChange={onSelectionChange}
        onApply={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Status Draft' }));

    // The field still shows the committed value, the popup the controlled draft.
    expect(screen.getByRole('radio', { name: 'In review' })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'Published' }));

    expect(onSelectionChange).toHaveBeenCalledWith('published');
    // Nothing moved on its own: the parent owns the draft.
    expect(screen.getByRole('radio', { name: 'In review' })).toBeChecked();
  });

  test('applies the controlled draft rather than the committed value', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(
      <RadioGroupPopupField
        {...baseProps}
        value="draft"
        selectedValue="review"
        onSelectionChange={vi.fn()}
        onApply={onApply}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Status Draft' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onApply).toHaveBeenCalledWith('review');
  });

  test('describes the field by its error', () => {
    render(
      <RadioGroupPopupField
        {...baseProps}
        invalid
        error="Pick a status"
        onApply={vi.fn()}
      />,
    );

    const error = screen.getByText('Pick a status');

    expect(screen.getByRole('button', { name: 'Status None' })).toHaveAttribute(
      'aria-describedby',
      error.id,
    );
  });

  test('describes the field by its caption', () => {
    render(
      <RadioGroupPopupField
        {...baseProps}
        caption="Drafts stay private"
        onApply={vi.fn()}
      />,
    );

    const caption = screen.getByText('Drafts stay private');

    expect(screen.getByRole('button', { name: 'Status None' })).toHaveAttribute(
      'aria-describedby',
      caption.id,
    );
  });

  test('carries the shared 2.0 field box and not an enhanced target', () => {
    // `dial-kit-input` clips its overflow, so the 44px pseudo-element would be
    // cut back to the field's own 40px: the field takes the same documented
    // 2.5.5 exception as `Input` and `Select`. jsdom does no layout, so only the
    // classes can be asserted here.
    render(<RadioGroupPopupField {...baseProps} onApply={vi.fn()} />);

    const field = screen.getByRole('button', { name: 'Status None' });

    expect(field).toHaveClass('dial-kit-input');
    expect(field).not.toHaveClass('dial-kit-enhanced-target');
  });
});
