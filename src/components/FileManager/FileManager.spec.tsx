import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { DialFileManager } from './FileManager';
import { itemsMock } from './__mocks__/files';

const renderWithinSizedShell = (ui: React.ReactElement) =>
  render(<div style={{ height: 640, width: 1100 }}>{ui}</div>);

const getGridRegion = () =>
  screen.getByRole('region', { name: 'File Manager Grid View' });

const waitForGridTable = async () => {
  const grid = getGridRegion();
  await within(grid).findByRole('table', undefined, { timeout: 6000 });
  return grid;
};

/** Find a row element inside the grid whose textContent matches the given string or regex. */
const findInGridByRowText = async (text: string | RegExp) => {
  const grid = await waitForGridTable();
  const matcher =
    typeof text === 'string'
      ? (s: string) => s.includes(text)
      : (s: string) => text.test(s);
  let found: Element | null = null;

  await waitFor(
    () => {
      const rows = grid.querySelectorAll('.ag-center-cols-container .ag-row');
      found =
        Array.from(rows).find((r) => matcher((r.textContent ?? '').trim())) ||
        null;
      if (!found) throw new Error('row not rendered yet');
    },
    { timeout: 6000 },
  );

  return found!;
};

const queryAllInGridByRowText = async (text: string | RegExp) => {
  const grid = await waitForGridTable();
  const matcher =
    typeof text === 'string'
      ? (s: string) => s.includes(text)
      : (s: string) => text.test(s);
  const rows = grid.querySelectorAll('.ag-center-cols-container .ag-row');
  return Array.from(rows).filter((r) => matcher((r.textContent ?? '').trim()));
};

describe('Dial UI Kit :: FileManager', () => {
  test('search scans descendants; "svg" lists SVG folder and *.svg files but NOT "24px" in the grid', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files/Design/Icons"
        treeOptions={{
          expandedPaths: new Set([
            '/All files',
            '/All files/Design',
            '/All files/Design/Icons',
            '/All files/Design/Icons/SVG',
          ]),
          showFiles: true,
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const searchRegion = screen.getByRole('search', { name: 'Search' });
    const searchInput = within(searchRegion).getByRole('textbox');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'svg');

    expect(await findInGridByRowText('SVG')).toBeInTheDocument();
    expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();
    expect(await findInGridByRowText('settings.svg')).toBeInTheDocument();

    // Ensure "24px" folder is not shown in grid results for "svg"
    expect((await queryAllInGridByRowText('24px')).length).toBe(0);
  });

  test('breadcrumb navigation updates grid to show parent folder children', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files/Design/Icons/SVG/24px"
        treeOptions={{
          expandedPaths: new Set([
            '/All files',
            '/All files/Design',
            '/All files/Design/Icons',
            '/All files/Design/Icons/SVG',
            '/All files/Design/Icons/SVG/24px',
          ]),
          showFiles: true,
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const iconsCrumb = screen.getByRole('link', { name: 'Icons' });
    await userEvent.click(iconsCrumb);

    expect(await findInGridByRowText('SVG')).toBeInTheDocument();
    expect(await findInGridByRowText('PNG')).toBeInTheDocument();
    expect((await queryAllInGridByRowText('alert.svg')).length).toBe(0);
  });

  test('clicking a node in the tree updates the grid contents', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files"
        treeOptions={{
          expandedPaths: new Set(['/All files', '/All files/Media']),
          showFiles: true,
        }}
      />,
    );

    const videoNode = await screen.findByText('Video', {}, { timeout: 6000 });
    await userEvent.click(videoNode);

    expect(await findInGridByRowText('promo.mp4')).toBeInTheDocument();
  });

  test('gridOptions.filterable=false disables floating filters in grid header', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files/Design/Icons"
        treeOptions={{
          expandedPaths: new Set([
            '/All files',
            '/All files/Design',
            '/All files/Design/Icons',
          ]),
        }}
        gridOptions={{ filterable: false }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    // No textboxes inside the grid region (floating filters disabled)
    const grid = await waitForGridTable();
    const textboxesInsideGrid = within(grid).queryAllByRole('textbox');
    expect(textboxesInsideGrid.length).toBe(0);
  });
});
