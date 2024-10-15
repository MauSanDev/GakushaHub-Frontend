import { ReactNode } from "react";

interface ColumnConfig<T> {
    header: string; 
    key: keyof T;   
    formatter?: (value: T[keyof T], element: T) => ReactNode; 
}

interface GenericTableProps<T> {
    data: T[];           
    columns: ColumnConfig<T>[]; 
}

const GenericTable = <T,>({ data, columns }: GenericTableProps<T>) => {
    return (
        <div className="overflow-x-auto mb-5 max-w-full">
            <div className="inline-block align-middle overflow-scroll w-full">
                <table className="w-full bg-white dark:bg-black text-xs dark:border dark:border-gray-800">
                    <thead>
                    <tr className="bg-blue-50 dark:bg-gray-950 text-center text-sm dark:text-gray-300">
                        {columns.map((column, index) => (
                            <th key={index} className="px-4 py-2 font-bold">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="text-center text-sm">
                    {data.map((element, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`${
                                rowIndex % 2 === 0
                                    ? "bg-gray-50 dark:bg-gray-900"
                                    : "bg-white dark:bg-gray-800"
                            } hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200 text-gray-800 dark:text-gray-200 text-left`}
                        >
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-4 py-2">
                                    {column.formatter
                                        ? column.formatter(element[column.key], element)
                                        : (element[column.key] as ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GenericTable;