import React, { useState } from "react";
import { saveSrt,saveASSrt } from "../utils/srtUtils";
import { Subtitle } from "./types"; // Define and import the Subtitle type

import { parseSRT } from "../utils/srtParser";
import SubtitleEditor from "./SubtitleEditor";
import VideoPlayer from "./VideoPlayer";
// import "../styles/tailwind.css";

const App: React.FC = () => {
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]); // Explicit type
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewTime, setPreviewTime] = useState<{ start: number; end: number } | null>(null);
    const [srtFileName, setSrtFileName] = useState<string | null>(null); // New state for SRT file name
    const [srtFilePath, setSrtFilePath] = useState<string | null>(null);

    const handleImportSRT = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const srtContent = event.target?.result as string;
            const parsedSubtitles = parseSRT(srtContent);
            setSubtitles(parsedSubtitles);
            setSrtFileName(file.name); // Save the SRT file name
        };
        reader.readAsText(file);
    };

    const handleSaveSRT = () => {
        if (srtFileName === undefined){
            saveASSrt(subtitles, "subtitle.srt")
        }
        saveSrt(subtitles, srtFileName || "subtitle.srt");
    }

    const handleSaveAsSRT = async () => {
        saveASSrt(subtitles, srtFileName || "subtitle.srt");
    };



    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{srtFileName ? `SRT File: ${srtFileName}` : "Select an SRT file"}</h1>                <div className="space-x-4">
                    <input
                        type="file"
                        accept=".srt"
                        onChange={(e) => handleImportSRT(e.target.files?.[0]!)}
                        className="hidden"
                        id="srtFileInput"
                    />
                    <label
                        htmlFor="srtFileInput"
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                    >
                        Import SRT
                    </label>

                    {/*<button*/}
                    {/*    onClick={handleSaveSRT}*/}
                    {/*    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"*/}
                    {/*>*/}
                    {/*    Save Srt*/}
                    {/*</button>*/}

                    <button
                        onClick={handleSaveAsSRT}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save As Srt
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-3 gap-6">
                <section className="col-span-2 bg-white p-4 rounded shadow">
                    <SubtitleEditor
                        subtitles={subtitles}
                        setSubtitles={setSubtitles}
                        setPreviewTime={(start, end) => setPreviewTime({ start, end })}
                    />                </section>

                <section className="bg-white p-4 rounded shadow">
                    <VideoPlayer
                        videoFile={videoFile}
                        setVideoFile={setVideoFile}
                        previewStartTime={previewTime?.start}
                        previewEndTime={previewTime?.end}
                    />
                </section>
            </main>

        </div>
    );
};

export default App;
