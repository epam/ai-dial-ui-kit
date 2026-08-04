import type { TabModel } from '@/models/tab';
import { DialFileManagerTabs } from '@/types/file-manager';
import { useMemo, useState } from 'react';

/**
 * @deprecated Import `useDialFileManagerTabs` from `@epam/ai-dial-react-file-manager` instead.
 */
export const useDialFileManagerTabs = (
  tabLabels?: Record<DialFileManagerTabs, string>,
  initialTab: DialFileManagerTabs = DialFileManagerTabs.MyFiles,
) => {
  const validInitialTab = Object.values(DialFileManagerTabs).includes(
    initialTab,
  )
    ? initialTab
    : DialFileManagerTabs.MyFiles;

  const [activeTab, setActiveTab] =
    useState<DialFileManagerTabs>(validInitialTab);

  const handleTabChange = (tab: DialFileManagerTabs) => {
    setActiveTab(tab);
  };

  const tabs: TabModel[] | undefined = useMemo(() => {
    if (!tabLabels) return void 0;
    return Object.values(DialFileManagerTabs).map((tab) => ({
      id: tab,
      label: tabLabels?.[tab] || tab.replace('_', ' '),
    }));
  }, [tabLabels]);

  return {
    activeTab,
    handleTabChange,
    tabs,
  };
};
