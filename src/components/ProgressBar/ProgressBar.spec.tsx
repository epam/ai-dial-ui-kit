import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ProgressBarRole } from '@/types/progress-bar';
import { ElementSize } from '@/types/size';
import { ProgressBar } from './ProgressBar';

describe('Dial UI Kit :: ProgressBar', () => {
  test('exposes the progress as a named progressbar', () => {
    render(<ProgressBar value={50} />);

    const bar = screen.getByRole('progressbar', { name: 'Progress' });

    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  test('reports a custom max', () => {
    render(<ProgressBar value={40} max={200} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      '200',
    );
  });

  test('names itself from the visible label', () => {
    render(<ProgressBar value={50} labelProps={{ label: 'Uploading' }} />);

    expect(
      screen.getByRole('progressbar', { name: 'Uploading' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Uploading')).toBeInTheDocument();
  });

  test('names itself from aria-label when there is no visible label', () => {
    render(<ProgressBar value={50} aria-label="Upload progress" />);

    expect(
      screen.getByRole('progressbar', { name: 'Upload progress' }),
    ).toBeInTheDocument();
  });

  test('prefers the visible label over the generic fallback', () => {
    render(<ProgressBar value={50} labelProps={{ label: 'Uploading' }} />);

    expect(
      screen.queryByRole('progressbar', { name: 'Progress' }),
    ).not.toBeInTheDocument();
  });

  test('exposes the label caption through its info button', () => {
    render(
      <ProgressBar
        value={50}
        labelProps={{ label: 'Uploading', caption: 'Large files take longer' }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Large files take longer' }),
    ).toBeInTheDocument();
  });

  test('renders the value readout beside the label', () => {
    render(
      <ProgressBar
        value={3.313182}
        max={500}
        labelProps={{ label: 'Cost per month' }}
        valueLabel="3.31 / 500"
      />,
    );

    expect(screen.getByText('3.31 / 500')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Cost per month' }),
    ).toBeInTheDocument();
  });

  test('renders the value readout without a label', () => {
    render(<ProgressBar value={40} valueLabel="40 / 100" />);

    expect(screen.getByText('40 / 100')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Progress' }),
    ).toBeInTheDocument();
  });

  test('keeps the value readout out of the accessible name', () => {
    render(
      <ProgressBar
        value={40}
        labelProps={{ label: 'Cost per month' }}
        valueLabel="40 / 100"
      />,
    );

    // The readout is announced through `aria-valuetext` when the caller wants
    // it; folding it into the name would repeat it on every value change.
    expect(screen.getByRole('progressbar')).toHaveAccessibleName(
      'Cost per month',
    );
  });

  test('passes aria-valuetext through for non-percentage announcements', () => {
    render(<ProgressBar value={3} max={10} aria-valuetext="3 of 10 files" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '3 of 10 files',
    );
  });

  test('clamps a value below zero', () => {
    render(<ProgressBar value={-10} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  test('clamps a value above max', () => {
    render(<ProgressBar value={150} max={100} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  });

  test.each([
    ['is empty at zero', 0, 100, '0%'],
    ['reflects the percentage', 25, 100, '25%'],
    ['is full at max', 100, 100, '100%'],
    ['scales to a custom max', 3, 10, '30%'],
  ])('fill %s', (_name, value, max, width) => {
    const { container } = render(<ProgressBar value={value} max={max} />);

    expect(container.querySelector('[style]')).toHaveStyle({ width });
  });

  test('renders an empty bar rather than NaN for a non-positive max', () => {
    const { container } = render(<ProgressBar value={5} max={0} />);

    expect(container.querySelector('[style]')).toHaveStyle({ width: '0%' });
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  test('renders an empty bar rather than NaN for a non-finite value', () => {
    const { container } = render(<ProgressBar value={Number.NaN} />);

    expect(container.querySelector('[style]')).toHaveStyle({ width: '0%' });
  });

  test('applies the small height', () => {
    render(<ProgressBar value={50} size={ElementSize.Small} />);

    expect(screen.getByRole('progressbar')).toHaveClass('h-1');
  });

  test('applies the standard height by default', () => {
    render(<ProgressBar value={50} />);

    expect(screen.getByRole('progressbar')).toHaveClass('h-2');
  });

  test('renders a progressbar by default', () => {
    render(<ProgressBar value={50} />);

    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders a meter with its range and value', () => {
    render(
      <ProgressBar
        role={ProgressBarRole.Meter}
        value={300}
        max={1000}
        aria-label="Project capacity"
        aria-valuetext="30% used"
      />,
    );

    const meter = screen.getByRole('meter', { name: 'Project capacity' });

    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '1000');
    expect(meter).toHaveAttribute('aria-valuenow', '300');
    expect(meter).toHaveAttribute('aria-valuetext', '30% used');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  test('leaves aria-valuetext off a meter when none is given', () => {
    render(
      <ProgressBar
        role={ProgressBarRole.Meter}
        value={20}
        aria-label="Quota"
      />,
    );

    expect(screen.getByRole('meter')).not.toHaveAttribute('aria-valuetext');
  });

  test('clamps a meter value above max', () => {
    render(
      <ProgressBar
        role={ProgressBarRole.Meter}
        value={1200}
        max={1000}
        aria-label="Project capacity"
      />,
    );

    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '1000');
  });

  test('names an unlabelled meter Meter rather than Progress', () => {
    render(<ProgressBar role={ProgressBarRole.Meter} value={20} />);

    expect(screen.getByRole('meter')).toHaveAccessibleName('Meter');
  });

  test('names a meter from its visible label', () => {
    render(
      <ProgressBar
        role={ProgressBarRole.Meter}
        value={20}
        labelProps={{ label: 'Storage' }}
        valueLabel="20 / 100 GB"
      />,
    );

    expect(screen.getByRole('meter')).toHaveAccessibleName('Storage');
  });

  test('applies a custom className to the track', () => {
    render(<ProgressBar value={50} className="custom-class" />);

    expect(screen.getByRole('progressbar')).toHaveClass('custom-class');
  });
});
