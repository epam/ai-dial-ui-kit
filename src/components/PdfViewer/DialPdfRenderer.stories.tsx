import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialPdfRenderer, type DialPdfRendererProps } from './DialPdfRenderer';
import type { InputHighlightData } from '@epam/pdf-highlighter-kit';
import samplePdf from '@/assets/files/pdf_sample.pdf';

// Sample highlights
const sampleHighlights: InputHighlightData[] = [
  {
    id: 'red-zone',
    bboxes: [{ x1: 180, y1: 110, x2: 340, y2: 130, page: 1 }],
    style: { backgroundColor: '#ff6b6b', opacity: 0.4 },
    tooltipText: 'Red highlight zone',
  },
  {
    id: 'blue-zone',
    bboxes: [{ x1: 30, y1: 140, x2: 400, y2: 164, page: 1 }],
    style: { backgroundColor: '#4ecdc4', opacity: 0.4 },
    tooltipText: 'Blue highlight zone',
  },
  {
    id: 'yellow-zone',
    bboxes: [{ x1: 100, y1: 200, x2: 350, y2: 220, page: 1 }],
    style: { backgroundColor: '#ffe66d', opacity: 0.4 },
    tooltipText: 'Yellow highlight zone',
  },
  {
    id: 'green-zone',
    bboxes: [
      { x1: 90, y1: 250, x2: 280, y2: 270, page: 2 },
      { x1: 300, y1: 300, x2: 450, y2: 320, page: 3 },
    ],
    style: { backgroundColor: '#03ff0bff', opacity: 0.4 },
    tooltipText: 'Green highlight zone (p2 + p3)',
  },
  {
    id: 'purple-zone',
    bboxes: [{ x1: 125, y1: 700, x2: 320, y2: 720, page: 1 }],
    style: { backgroundColor: '#9d50ff', opacity: 0.4 },
    tooltipText: 'Purple highlight zone',
  },
  {
    id: 'orange-zone',
    bboxes: [{ x1: 35, y1: 400, x2: 205, y2: 410, page: 3 }],
    style: { backgroundColor: '#ff8c00', opacity: 0.4 },
    tooltipText: 'Orange highlight zone (p3)',
  },
];

const meta = {
  title: 'Pdf Viewer/PdfRenderer',
  component: DialPdfRenderer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'DialPdfRenderer component displays PDF documents with highlighting capabilities. Uses pdf-highlighter-kit to render PDFs with text selection and highlighting support.',
      },
    },
  },
  argTypes: {
    pdf: {
      control: { type: 'text' },
      description:
        'PDF document to display, can be a URL string or Blob object',
    },
    highlights: {
      control: { type: 'object' },
      description: 'Array of highlights to display in the PDF',
    },
    zoom: {
      control: { type: 'text' },
      description:
        "Zoom level - should be 'auto' or a string representing a number",
    },
    selectedHighlightId: {
      control: { type: 'text' },
      description: 'ID of the currently selected highlight to scroll to',
    },
    containerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the container',
    },
  },
  args: {
    pdf: samplePdf,
    highlights: sampleHighlights,
    zoom: 'auto',
  },
} satisfies Meta<DialPdfRendererProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pdf: samplePdf,
    highlights: sampleHighlights,
  },
};

export const WithCustomZoom: Story = {
  args: {
    pdf: samplePdf,
    highlights: sampleHighlights,
    zoom: '1.5',
  },
};

export const WithSelectedHighlight: Story = {
  args: {
    pdf: samplePdf,
    highlights: sampleHighlights,
    selectedHighlightId: 'red-zone',
  },
};

export const NoHighlights: Story = {
  args: {
    pdf: samplePdf,
    highlights: [],
  },
};

export const WithCustomClassName: Story = {
  args: {
    pdf: samplePdf,
    highlights: sampleHighlights,
    containerClassName: 'border-2 border-primary',
  },
};
