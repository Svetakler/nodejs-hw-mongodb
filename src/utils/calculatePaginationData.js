export const calculatePaginationData = (totalItems, page, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};
