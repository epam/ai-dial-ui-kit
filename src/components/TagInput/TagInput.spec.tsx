import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialTagInput } from './TagInput';

describe('Dial UI Kit :: DialTagInput', () => {
  test('Should render correctly', () => {
    render(<DialTagInput elementId="test-tag" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
