import "./Pagination.css";

/**
 * Pagination
 * props:
 *  - currentPage: number (1-based)
 *  - totalItems: number
 *  - pageSize: number
 *  - onPageChange: (page: number) => void
 */
export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) return null;

  const goTo = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    if (safePage !== currentPage) onPageChange(safePage);
  };

  // สร้างเลขหน้าแบบมี ... เมื่อหน้าเยอะ
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = 4;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination">
      <span className="pagination-info">
        แสดง {startItem}-{endItem} จาก {totalItems} รายการ
      </span>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-page ${page === currentPage ? "active" : ""}`}
              onClick={() => goTo(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="pagination-btn"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}