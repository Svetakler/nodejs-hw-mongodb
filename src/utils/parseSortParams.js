import { SORT_ORDER } from '../constants/index.js';

export const parseSortParams = (query) => {
  const sortBy = query.sortBy || 'name';
  const sortOrder = Object.values(SORT_ORDER).includes(query.sortOrder)
    ? query.sortOrder
    : SORT_ORDER.ASC;

  return { sortBy, sortOrder };
};
