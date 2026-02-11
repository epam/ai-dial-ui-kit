import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialPdfViewer, type DialPdfViewerProps } from './DialPdfViewer';
import { DocumentPreviewCacheProvider } from './DocumentPreviewCacheContext';
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

// Mock file loader function
const mockLoadFileCb = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load document');
  }
  return response.blob();
};

const meta = {
  title: 'Pdf Viewer/PdfViewer',
  component: DialPdfViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'DialPdfViewer component provides a full-featured PDF document preview with navigation controls, zoom functionality, and highlight navigation. Must be wrapped in DocumentPreviewCacheProvider.',
      },
    },
  },
  decorators: [
    (Story) => (
      <DocumentPreviewCacheProvider>
        <div style={{ height: '100vh', width: 'max-w-[400px]' }}>
          <Story />
        </div>
      </DocumentPreviewCacheProvider>
    ),
  ],
  argTypes: {
    fileUrl: {
      control: { type: 'text' },
      description: 'URL of the document file to load',
    },
    fileName: {
      control: { type: 'text' },
      description: 'Name of the file to display',
    },
    loadFileCb: {
      control: false,
      description: 'Callback function to load the file as a Blob',
    },
    highlights: {
      control: { type: 'object' },
      description: 'Array of highlights to display in the document',
    },
    errorLabel: {
      control: { type: 'text' },
      description: 'Custom label for error message when document fails to load',
    },
    occurencesLabel: {
      control: { type: 'text' },
      description: 'Custom label for the occurrences counter',
    },
  },
  args: {
    fileUrl: samplePdf,
    fileName: 'Attention Is All You Need.pdf',
    loadFileCb: mockLoadFileCb,
    highlights: sampleHighlights,
  },
} satisfies Meta<DialPdfViewerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileUrl: samplePdf,
    fileName: 'Attention Is All You Need.pdf',
    loadFileCb: mockLoadFileCb,
    highlights: sampleHighlights,
  },
};

export const SingleHighlight: Story = {
  args: {
    fileUrl: samplePdf,
    fileName: 'document.pdf',
    loadFileCb: mockLoadFileCb,
    highlights: [sampleHighlights[0]],
  },
};

export const MultipleHighlights: Story = {
  args: {
    fileUrl: samplePdf,
    fileName: 'research-paper.pdf',
    loadFileCb: mockLoadFileCb,
    highlights: sampleHighlights,
  },
};

export const CustomLabels: Story = {
  args: {
    fileUrl: samplePdf,
    fileName: 'document.pdf',
    loadFileCb: mockLoadFileCb,
    highlights: sampleHighlights,
    occurencesLabel: 'Matches',
  },
};

export const LongFileName: Story = {
  args: {
    fileUrl: samplePdf,
    fileName:
      'Annual_Report_and_Comprehensive_Analysis_of_Financial_Performance_and_Market_Trends_for_Global_Enterprise_Solutions_2025_Executive_Summary_Detailed_Appendices_Charts_Tables_Recommendations_and_Future_Outlook_Reviewed_and_Approved_by_Board_of_Directors_Final_Version.pdf',
    loadFileCb: mockLoadFileCb,
    highlights: sampleHighlights,
  },
};

export const LoadError: Story = {
  args: {
    fileUrl: 'https://invalid-url.example.com/nonexistent.pdf',
    fileName: 'broken-document.pdf',
    loadFileCb: async () => {
      throw new Error('Failed to load');
    },
    highlights: sampleHighlights,
    errorLabel: 'Unable to load the document. Please try again.',
  },
};

export const CustomErrorLabel: Story = {
  args: {
    fileUrl: 'https://invalid-url.example.com/nonexistent.pdf',
    fileName: 'error-document.pdf',
    loadFileCb: async () => {
      throw new Error('Network error');
    },
    highlights: sampleHighlights,
    errorLabel: (
      <div className="flex flex-col gap-2">
        <div className="dial-small-semi-text">Document Unavailable</div>
        The requested document could not be loaded.
      </div>
    ),
  },
};
