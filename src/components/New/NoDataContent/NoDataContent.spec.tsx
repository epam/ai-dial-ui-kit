import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { NoDataContent } from './NoDataContent';

describe('Dial UI Kit :: NoDataContent', () => {
  test('renders the title and description', () => {
    render(<NoDataContent title="No results" description="Try again" />);

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  test('omits the description when none is given', () => {
    render(<NoDataContent title="No results" />);

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  test('hides the default icon from assistive tech', () => {
    const { container } = render(<NoDataContent title="No results" />);

    const icon = container.querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('renders a custom icon instead of the default one', () => {
    render(<NoDataContent title="No results" icon={<span>Icon</span>} />);

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  test('is silent by default and announced with live', () => {
    const { rerender } = render(<NoDataContent title="No results" />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(<NoDataContent title="No results" live />);

    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  test('merges custom classes into the container and the text', () => {
    const { container } = render(
      <NoDataContent
        title="No results"
        description="Try again"
        className="my-container"
        titleClassName="my-title"
        descriptionClassName="my-description"
      />,
    );

    expect(container.firstElementChild).toHaveClass('my-container');
    expect(screen.getByText('No results')).toHaveClass('my-title');
    expect(screen.getByText('Try again')).toHaveClass('my-description');
  });
});
