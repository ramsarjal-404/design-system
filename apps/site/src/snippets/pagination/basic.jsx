import { useState } from 'react';
import { Pagination } from '@lepidus/react';

function TablePagination() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);
  const totalRecords = 248;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  return (
    <Pagination
      totalRecords={totalRecords}
      currentPage={page}
      totalPages={totalPages}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
    />
  );
}
