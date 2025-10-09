import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialTag } from './Tag';

describe('Dial UI Kit :: DialTag', () => {
  test('Should render correctly', () => {
    render(<DialTag tag="tag" />);
    expect(screen.getByText('tag')).toBeInTheDocument();
  });
});
