import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { DialErrorText } from './ErrorText';

describe('Common components :: ErrorText', () => {
  test('Should render error text when provided', () => {
    render(<DialErrorText errorText="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  test('Should render nothing when errorText is not provided', () => {
    const { container } = render(<DialErrorText />);
    expect(container).toBeEmptyDOMElement();
  });
});
