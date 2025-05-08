import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false
}) => {
  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    // Always show first and last page, and a few around the current page
    const pages: number[] = []
    
    // Show first page
    pages.push(0)
    
    // Show pages around current
    const range = 2 // Show 2 pages before and after current
    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages - 2, currentPage + range); i++) {
      pages.push(i)
    }
    
    // Show last page if there are more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages - 1)
    }
    
    // Ensure we don't have duplicates and the array is sorted
    return [...new Set(pages)].sort((a, b) => a - b)
  }

  // Skip rendering if no pages
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0 || disabled}
        className="pagination-button flex items-center justify-center"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        // Add ellipsis if there's a gap
        const showEllipsisBefore = index > 0 && page > pageNumbers[index - 1] + 1
        
        return (
          <React.Fragment key={page}>
            {showEllipsisBefore && (
              <span className="px-3 py-1 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`pagination-button ${page === currentPage ? 'pagination-active' : ''}`}
            >
              {page + 1}
            </button>
          </React.Fragment>
        )
      })}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || disabled}
        className="pagination-button flex items-center justify-center"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
