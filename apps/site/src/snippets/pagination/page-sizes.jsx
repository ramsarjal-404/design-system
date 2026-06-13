import { useState } from 'react';
import { Pagination } from '@ramsarjal-404/react';

function ScanResultsPagination() {
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(50);
  const totalRecords = 248;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  return (
    <Pagination
      totalRecords={totalRecords}
      currentPage={page}
      totalPages={totalPages}
      pageSize={pageSize}
      pageSizeOptions={[25, 50, 100]}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
    />
  );
}
