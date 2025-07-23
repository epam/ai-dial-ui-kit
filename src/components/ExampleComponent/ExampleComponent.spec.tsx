import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  test('should render correctly', () => {
    render(
      <ExampleComponent
        title="Example Component"
        description="Example Description"
      />,
    );

    const heading = screen.getByRole('heading', { name: 'Example Component' });

    expect(heading).toBeInTheDocument();
  });
});
