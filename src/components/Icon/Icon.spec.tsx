import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DialIcon } from './Icon';

describe('Dial UI Kit :: DialIcon', () => {
  it('renders icon when provided', () => {
    const testIcon = <div>Icon Content</div>;

    render(<DialIcon icon={testIcon} />);

    expect(screen.getByText('Icon Content')).toBeInTheDocument();
  });

  it('returns null when no icon is provided', () => {
    const { container } = render(<DialIcon />);

    expect(container.firstChild).toBeNull();
  });

  it('applies additional className when provided', () => {
    const testIcon = <div>Icon</div>;

    render(<DialIcon icon={testIcon} className="text-red-500" />);

    const wrapper = screen.getByText('Icon').parentElement;
    expect(wrapper).toHaveClass('flex-shrink-0', 'text-red-500');
  });
});
