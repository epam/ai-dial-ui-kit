import type { TabModel } from '@/models/tab';
import { DialFileManagerTabs } from '@/types/file-manager';
import { useMemo, useState } from 'react';

export const useDialFileManagerTabs = (
  tabLabels?: Record<DialFileManagerTabs, string>,
) => {
  const [activeTab, setActiveTab] = useState<DialFileManagerTabs>(
    DialFileManagerTabs.MyFiles,
  );

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
