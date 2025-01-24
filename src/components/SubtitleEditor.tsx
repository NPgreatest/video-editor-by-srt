import React from "react";

const SubtitleEditor: React.FC<{
    subtitles: any[];
    setSubtitles: React.Dispatch<React.SetStateAction<any[]>>;
    setPreviewTime: (start: number, end: number) => void;
}> = ({ subtitles, setSubtitles, setPreviewTime }) => {
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

    return (
        <div className="space-y-4">
            {subtitles.map((subtitle) => (
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
        </div>
    );
};

export default SubtitleEditor;
