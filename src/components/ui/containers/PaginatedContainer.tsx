import { FC } from 'react';

interface PaginatedContainerProps<T> {
    documents: T[];
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    RenderComponent: FC<{ document: T }>;
}

const PaginatedContainer = <T,>({
                                    documents,
                                    currentPage,
                                    totalPages,
                                    onPageChange,
                                    RenderComponent,
                                }: PaginatedContainerProps<T>) => {
    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pagesToShow = 5;
        const pageNumbers = [];

        const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

        const adjustedStartPage = Math.max(1, endPage - pagesToShow + 1);

        if (currentPage > 1) {
            pageNumbers.push(
                <button
                    key="prev"
                    className="bg-gray-200 text-xs text-gray-700 dark:text-gray-500 px-2 py-1 mx-0.5 mx-0. rounded hover:bg-gray-200 dark:bg-gray-950 hover:dark:bg-gray-800 flex items-center transition-all"
                    onClick={() => handlePageClick(currentPage - 1)}
                >
                    ←
                </button>
            );
        }

        if (adjustedStartPage > 1) {
            pageNumbers.push(
                <button
                    key="min"
                    className="bg-gray-200 text-xs text-gray-700 dark:text-gray-400 px-2 py-1 mx-0.5 rounded hover:bg-gray-200 dark:bg-gray-950 hover:dark:bg-gray-800 flex items-center transition-all"
                    onClick={() => handlePageClick(1)}
                >
                    1
                </button>
            );
        }

        for (let i = adjustedStartPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`${
                        i === currentPage
                            ? 'bg-blue-500 text-white text-xs px-2 py-1 mx-0.5 rounded dark:bg-gray-700 hover:dark:bg-gray-600'
                            : 'bg-gray-100 text-xs text-gray-700 dark:text-white px-2 py-1 mx-0.5 rounded hover:bg-gray-200 dark:bg-gray-950 hover:dark:bg-gray-800'
                    } flex items-center transition-all`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {

            pageNumbers.push(
                <button
                    key="max"
                    className="bg-gray-200 text-xs text-gray-700 dark:text-gray-400 px-2 py-1 mx-0.5 rounded hover:bg-gray-200 dark:bg-gray-950 hover:dark:bg-gray-800 flex items-center transition-all"
                    onClick={() => handlePageClick(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }
        if (currentPage < totalPages) {
            pageNumbers.push(
                <button
                    key="next"
                    className="bg-gray-200 text-xs text-gray-700 dark:text-gray-500 px-2 py-1 mx-0.5 rounded hover:bg-gray-200 dark:bg-gray-950 hover:dark:bg-gray-800 flex items-center transition-all"
                    onClick={() => handlePageClick(currentPage + 1)}
                >
                    →
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className=" w-full max-w-4xl flex flex-col gap-2 text-left pb-24 h-full">
            <div className="pagination-controls flex gapx-2 mx-0.5 w-full justify-center items-center mt-2">
                {totalPages > 0 ? (
                    <>
                        <span className="text-gray-400 dark:text-gray-600 text-xs pr-3">Pages:</span>
                        {renderPageNumbers()}
                    </>
                ) : (
                    <span className="text-gray-400 dark:text-gray-600 text-xs">No elements found</span>
                )}
            </div>

            <div className="document-list flex flex-col gap-2 py-1 overflow-y-auto h-full pb-24"
                 style={{maxHeight: 'calc(100vh)'}}>
                {documents.map((document) => (
                    <RenderComponent
                        key={document._id}
                        document={document}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaginatedContainer;