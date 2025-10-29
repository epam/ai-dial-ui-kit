import { useState } from 'react';

export const useShowHiddenFiles = (initialState = false) => {
  const [areHiddenFilesVisible, setAreHiddenFilesVisible] =
    useState(initialState);

  const toggleHiddenFilesVisibility = () => {
    setAreHiddenFilesVisible((prev) => !prev);
  };

  return {
    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,
    setAreHiddenFilesVisible,
  };
};
