export interface PageReturnType {
  skip: number;
  take: number;
  currentPage: number;
  totalPages: number;
}

export function getListOffsetPagination(param: {
  page: number;
  take: number;
  totalTake: number;
}): {
  skip: PageReturnType['skip'];
  take: PageReturnType['take'];
  currentPage: PageReturnType['currentPage'];
  totalPages: PageReturnType['totalPages'];
} {
  const { take, page, totalTake } = param;

  const currentPage: PageReturnType['currentPage'] = page < 1 ? 1 : page;
  const skip: PageReturnType['skip'] = (currentPage - 1) * take;
  const variableTake: PageReturnType['take'] = take < 1 ? 1 : take;
  const totalPages: PageReturnType['totalPages'] = Math.ceil(
    totalTake / variableTake,
  );

  return {
    skip,
    take,
    currentPage,
    totalPages,
  };
}
