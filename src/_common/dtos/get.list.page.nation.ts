export interface PageReturnType {
  skip: number;
  take: number;
  currentPage: number;
  resultLastPage: number;
  resultTotalPage: number;
}

export function getListOffsetPagination(param: {
  page: number;
  take: number;
  list: number;
}): {
  skip: PageReturnType['skip'];
  take: PageReturnType['take'];
  currentPage: PageReturnType['currentPage'];
  resultLastPage: PageReturnType['resultLastPage'];
  resultTotalPage: PageReturnType['resultTotalPage'];
} {
  const { take, page, list } = param;

  const currentPage: PageReturnType['currentPage'] = page < 1 ? 1 : page;
  const skip: PageReturnType['skip'] = (currentPage - 1) * take;
  const variableTake: PageReturnType['take'] = take < 1 ? 1 : take;
  const resultTotalPage: PageReturnType['resultTotalPage'] = Math.ceil(
    list / variableTake,
  );
  const lastPageLeft: PageReturnType['resultLastPage'] = Math.ceil(
    resultTotalPage - (skip + 1),
  );
  const resultLastPage: PageReturnType['resultLastPage'] =
    lastPageLeft < 1 ? 1 : lastPageLeft;

  return {
    skip,
    take,
    currentPage,
    resultLastPage,
    resultTotalPage,
  };
}
