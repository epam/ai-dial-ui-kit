import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Highlight } from './Highlight';

describe('Dial UI Kit :: Highlight', () => {
  test('Should render plain text when query is empty', () => {
    render(<Highlight text="Hello world" query="" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(document.querySelector('mark')).not.toBeInTheDocument();
  });

  test('Should render plain text when query is whitespace only', () => {
    render(<Highlight text="Hello world" query="   " />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(document.querySelector('mark')).not.toBeInTheDocument();
  });

  test('Should highlight the first case-insensitive match', () => {
    render(<Highlight text="Hello World" query="world" />);
    const mark = document.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark).toHaveTextContent('World');
  });

  test('Should render plain text when query does not match', () => {
    render(<Highlight text="Hello world" query="xyz" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(document.querySelector('mark')).not.toBeInTheDocument();
  });

  test('Should only highlight the first occurrence of the query', () => {
    render(<Highlight text="cat catalog cat" query="cat" />);
    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
  });

  test('Should apply custom markClassName to the highlighted segment', () => {
    render(
      <Highlight
        text="Hello world"
        query="world"
        markClassName="custom-mark"
      />,
    );
    expect(document.querySelector('mark')).toHaveClass('custom-mark');
  });

  test('Should apply the default line-clamp-2 class', () => {
    render(<Highlight text="Hello world" query="" />);
    expect(screen.getByText('Hello world')).toHaveClass('line-clamp-2');
  });

  test('Should apply single-line truncation classes when maxLines is 1', () => {
    render(<Highlight text="Hello world" query="" maxLines={1} />);
    expect(screen.getByText('Hello world')).toHaveClass('truncate');
  });

  test('Should apply the matching line-clamp class for a supported maxLines value', () => {
    render(<Highlight text="Hello world" query="" maxLines={4} />);
    expect(screen.getByText('Hello world')).toHaveClass('line-clamp-4');
  });

  test('Should fall back to line-clamp-2 for an unsupported maxLines value', () => {
    render(<Highlight text="Hello world" query="" maxLines={10} />);
    expect(screen.getByText('Hello world')).toHaveClass('line-clamp-2');
  });

  test('Should forward className to the tooltip container', () => {
    render(<Highlight text="Hello world" query="" className="custom-class" />);
    expect(screen.getByText('Hello world')).toHaveClass('custom-class');
  });
});
