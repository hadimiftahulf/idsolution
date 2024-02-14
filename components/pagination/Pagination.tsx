// components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  loadQuery: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loadQuery,
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      loadQuery();
    }
  };

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        // Current page is active
        pages.push(
          <li key={i} className="uk-active">
            <span>{i}</span>
          </li>
        );
      } else {
        pages.push(
          <li key={i}>
            <a href="#" onClick={() => handlePageChange(i)}>
              {i}
            </a>
          </li>
        );
      }
    }

    return pages;
  };

  return (
    <ul
      className="uk-pagination uk-flex-right uk-margin-medium-top"
      uk-margin=""
    >
      <li>
        <a href="#" onClick={() => handlePageChange(currentPage - 1)}>
          <span uk-pagination-previous=""></span>
        </a>
      </li>
      {renderPagination()}
      <li>
        <a href="#" onClick={() => handlePageChange(currentPage + 1)}>
          <span uk-pagination-next=""></span>
        </a>
      </li>
    </ul>
  );
};

export default Pagination;
