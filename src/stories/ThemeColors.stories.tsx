import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useState } from 'react';
import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialLabelledText } from '@/components/LabelledText/LabelledText';
import { DialLoader } from '@/components/Loader/Loader';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { DialTag } from '@/components/Tag/Tag';

interface ThemeVariables {
  id?: string;
  displayName?: string;
  colors?: Record<string, string>;
  topicColors?: Record<string, string>;
  authColors?: Record<string, string>;
}

interface ThemesListingResponse {
  themes?: ThemeVariables[];
}

interface ColorRow {
  token: string;
}

const THEMES_API_URL = 'https://themes.aks.dev.dial.parts/config.json';

const createRows = (
  darkTokens: Record<string, string>,
  lightTokens: Record<string, string>,
): ColorRow[] => {
  const darkOrder = Object.keys(darkTokens);
  const lightExtra = Object.keys(lightTokens).filter(
    (token) => !darkTokens[token],
  );

  return [...darkOrder, ...lightExtra].map((token) => ({ token }));
};

const toThemesArray = (data: unknown): ThemeVariables[] => {
  if (Array.isArray(data)) {
    return data as ThemeVariables[];
  }

  if (data && typeof data === 'object' && 'themes' in data) {
    return (data as ThemesListingResponse).themes ?? [];
  }

  return [];
};

const findTheme = (themes: ThemeVariables[], key: 'dark' | 'light') =>
  themes.find((theme) => theme.id?.toLowerCase() === key) ??
  themes.find((theme) => theme.displayName?.toLowerCase() === key);

const getColorValue = (
  tokens: Record<string, string> | undefined,
  token: string,
) => tokens?.[token] ?? 'N/A';

const ColorValue = ({ value }: { value: string }) => (
  <div className="inline-flex items-center gap-2">
    <span
      className="h-4 w-4 shrink-0 rounded-sm border border-primary"
      style={{
        backgroundColor: value !== 'N/A' ? value : 'transparent',
      }}
    />
    <DialTag tag={value} bordered={false} className="bg-layer-2" />
  </div>
);

const meta = {
  title: 'DIAL/Theme Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ColorTable = ({
  title,
  rows,
  darkTokens,
  lightTokens,
}: {
  title: string;
  rows: ColorRow[];
  darkTokens: Record<string, string>;
  lightTokens: Record<string, string>;
}) => (
  <div className="mb-6 overflow-x-auto rounded border border-primary last:mb-0">
    <div className="border-b border-primary bg-layer-2 px-3 py-2 text-sm font-semibold">
      {title}
    </div>
    <div className="grid min-w-[760px] grid-cols-[minmax(280px,1fr)_minmax(220px,1fr)_minmax(220px,1fr)] text-sm">
      <div className="border-b border-r border-primary bg-layer-2 px-3 py-2 font-semibold">
        Token
      </div>
      <div className="border-b border-r border-primary bg-layer-2 px-3 py-2 font-semibold">
        Dark
      </div>
      <div className="border-b border-primary bg-layer-2 px-3 py-2 font-semibold">
        Light
      </div>
      {rows.map((row) => {
        const darkValue = getColorValue(darkTokens, row.token);
        const lightValue = getColorValue(lightTokens, row.token);

        return (
          <div key={row.token} className="contents">
            <div className="border-b border-r border-primary bg-layer-1 px-3 py-2">
              {row.token}
            </div>
            <div className="border-b border-r border-primary bg-layer-1 px-3 py-2">
              <ColorValue value={darkValue} />
            </div>
            <div className="border-b border-primary bg-layer-1 px-3 py-2">
              <ColorValue value={lightValue} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const ThemeColorsTable = () => {
  const [themes, setThemes] = useState<ThemeVariables[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadThemes = async () => {
      try {
        const response = await fetch(THEMES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as unknown;
        const parsedThemes = toThemesArray(data);

        if (isMounted) {
          setThemes(parsedThemes);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'Failed to load themes');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadThemes();

    return () => {
      isMounted = false;
    };
  }, []);

  const darkTheme = useMemo(
    () => findTheme(themes, 'dark') ?? themes[0],
    [themes],
  );
  const lightTheme = useMemo(
    () => findTheme(themes, 'light') ?? themes[1],
    [themes],
  );

  const colorRows = useMemo(
    () => createRows(darkTheme?.colors ?? {}, lightTheme?.colors ?? {}),
    [darkTheme, lightTheme],
  );
  const topicRows = useMemo(
    () =>
      createRows(darkTheme?.topicColors ?? {}, lightTheme?.topicColors ?? {}),
    [darkTheme, lightTheme],
  );
  const authRows = useMemo(
    () => createRows(darkTheme?.authColors ?? {}, lightTheme?.authColors ?? {}),
    [darkTheme, lightTheme],
  );

  if (loading) {
    return (
      <div className="flex h-[180px] items-center justify-center">
        <DialLoader fullWidth={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <DialErrorText
          errorText={`Failed to load theme colors from API: ${error}`}
        />
      </div>
    );
  }

  if (!darkTheme || !lightTheme) {
    return (
      <DialNoDataContent
        title="Dark/Light theme data is missing"
        description="Could not resolve both themes from API response."
        containerClassName="min-h-[180px]"
      />
    );
  }

  return (
    <div className="w-full p-4 text-primary">
      <div className="mb-3">
        <DialLabelledText
          label="Themes API URL"
          text={THEMES_API_URL}
          className="max-w-none"
        />
      </div>
      <ColorTable
        title="colors"
        rows={colorRows}
        darkTokens={darkTheme.colors ?? {}}
        lightTokens={lightTheme.colors ?? {}}
      />
      <ColorTable
        title="topicColors"
        rows={topicRows}
        darkTokens={darkTheme.topicColors ?? {}}
        lightTokens={lightTheme.topicColors ?? {}}
      />
      <ColorTable
        title="authColors"
        rows={authRows}
        darkTokens={darkTheme.authColors ?? {}}
        lightTokens={lightTheme.authColors ?? {}}
      />
    </div>
  );
};

export const FromThemesApi: Story = {
  render: () => <ThemeColorsTable />,
  parameters: {
    docs: {
      description: {
        story: 'Theme color matrix loaded from themes API (`config.json`).',
      },
    },
  },
};
