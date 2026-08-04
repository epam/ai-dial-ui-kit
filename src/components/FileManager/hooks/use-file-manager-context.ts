import { useContext } from 'react';
import { FileManagerContext } from '@/components/FileManager/FileManagerContext';

/**
 * Hook to read the File Manager context.
 * Throws if used outside of the provider.
 *
 * @deprecated Import `useFileManagerContext` from `@epam/ai-dial-react-file-manager` instead.
 */
export const useFileManagerContext = () => {
  const ctx = useContext(FileManagerContext);
  if (!ctx) {
    throw new Error(
      'useFileManagerContext must be used within <FileManagerProvider>',
    );
  }
  return ctx;
};
