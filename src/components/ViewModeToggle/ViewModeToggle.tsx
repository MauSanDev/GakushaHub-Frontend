import React from "react";
import { FaTable, FaThLarge } from "react-icons/fa";

interface ViewModeToggleProps {
    currentViewMode: "table" | "cards";
    onChangeViewMode: (mode: "table" | "cards") => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ currentViewMode, onChangeViewMode }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => onChangeViewMode("cards")}
                className={`p-2 rounded-full shadow ${currentViewMode === "cards" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
            >
                <FaThLarge className="w-5 h-5" />
            </button>
            <button
                onClick={() => onChangeViewMode("table")}
                className={`p-2 rounded-full shadow ${currentViewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
            >
                <FaTable className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ViewModeToggle;