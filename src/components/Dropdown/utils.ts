import { ALL_ID } from './constants';

export const isMultiSelectClickAvailable = (
  multipleValues?: string[] | null,
  id?: string,
  allItemsCount?: number,
) => {
  if (!multipleValues) return true;

  if (id !== ALL_ID) return true;

  return multipleValues.length !== allItemsCount;
};
export const isChecked = (
  multipleValues?: string[] | null,
  id?: string,
  allItemsCount?: number,
) => {
  if (!multipleValues || !id) return false;

  if (id === ALL_ID) {
    return allItemsCount === multipleValues.length;
  }

  return multipleValues.includes(id);
};

export const isIndeterminate = (
  multipleValues?: string[] | null,
  id?: string,
  allItemsCount?: number,
) => {
  if (id !== ALL_ID || !multipleValues || !allItemsCount) return false;

  return multipleValues.length > 0 && multipleValues.length < allItemsCount;
};
