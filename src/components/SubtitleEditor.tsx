import React, { useState } from "react";

const SubtitleEditor: React.FC<{
    subtitles: any[];
    setSubtitles: React.Dispatch<React.SetStateAction<any[]>>;
    setPreviewTime: (start: number, end: number) => void;
}> = ({ subtitles, setSubtitles, setPreviewTime }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State for the page size

    const totalPages = Math.ceil(subtitles.length / itemsPerPage);

    // Calculate the subtitles to display on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSubtitles = subtitles.slice(startIndex, startIndex + itemsPerPage);

    const handleTextChange = (id: number, text: string) => {
        setSubtitles((prev) =>
            prev.map((subtitle) =>
                subtitle.id === id ? { ...subtitle, text } : subtitle
            )
        );
    };

    const handleTimeChange = (id: number, type: "start" | "end", value: string) => {
        setSubtitles((prev) =>
            prev.map((subtitle) =>
                subtitle.id === id ? { ...subtitle, [type]: value } : subtitle
            )
        );
    };

    const handleIncludeChange = (id: number) => {
        setSubtitles((prev) =>
            prev.map((subtitle) =>
                subtitle.id === id ? { ...subtitle, include: !subtitle.include } : subtitle
            )
        );
    };

    const handlePreview = (start: string, end: string) => {
        const parseTime = (time: string): number => {
            const [hours, minutes, seconds] = time.split(":");
            const [sec, millis] = seconds.split(",");
            return (
                parseInt(hours, 10) * 3600 +
                parseInt(minutes, 10) * 60 +
                parseFloat(`${sec}.${millis}`)
            );
        };

        const startTime = parseTime(start);
        const endTime = parseTime(end);
        setPreviewTime(startTime, endTime);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setItemsPerPage(newSize);
        setCurrentPage(1); // Reset to the first page when page size changes
    };



    return (
        <div className="space-y-4">
            {currentSubtitles.map((subtitle) => (
                <div key={subtitle.id} className="flex items-center space-x-4">
                    <input
                        type="checkbox"
                        checked={subtitle.include}
                        onChange={() => handleIncludeChange(subtitle.id)}
                    />
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1"
                        value={subtitle.start}
                        onChange={(e) => handleTimeChange(subtitle.id, "start", e.target.value)}
                    />
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1"
                        value={subtitle.end}
                        onChange={(e) => handleTimeChange(subtitle.id, "end", e.target.value)}
                    />
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded px-2 py-1"
                        value={subtitle.text}
                        onChange={(e) => handleTextChange(subtitle.id, e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        onClick={() => handlePreview(subtitle.start, subtitle.end)}
                    >
                        Preview
                    </button>
                </div>
            ))}

            {/* Pagination and Page Size Controls */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                    <label htmlFor="pageSize" className="text-gray-600">
                        Items per page:
                    </label>
                    <select
                        id="pageSize"
                        className="border border-gray-300 rounded px-2 py-1"
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div>
                    <button
                        className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubtitleEditor;
