import React, { useState } from "react";
import { saveConfig, loadConfig } from "../utils/configUtils";
import { Subtitle } from "./types"; // Define and import the Subtitle type

import { parseSRT } from "../utils/srtParser";
import SubtitleEditor from "./SubtitleEditor";
import VideoPlayer from "./VideoPlayer";
// import "../styles/tailwind.css";

const App: React.FC = () => {
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]); // Explicit type
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loadedConfig, setLoadedConfig] = useState<string | null>(null);
    const [previewTime, setPreviewTime] = useState<{ start: number; end: number } | null>(null);

    const handleImportSRT = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const srtContent = event.target?.result as string;
            const parsedSubtitles = parseSRT(srtContent);
            // @ts-ignore
            setSubtitles(parsedSubtitles);
            setLoadedConfig(null);
        };
        reader.readAsText(file);
    };

    const handleSaveConfig = () => {
        const config = { videoFile: videoFile?.name || "", subtitles };
        saveConfig(config, loadedConfig || "config.json");
    };

    const handleLoadConfig = async (file: File) => {
        try {
            const config = await loadConfig(file);
            setSubtitles(config.subtitles || []);
            setVideoFile(config.videoFile ? new File([], config.videoFile) : null);
            setLoadedConfig(file.name);
        } catch (error) {
            // @ts-ignore
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Video Editor</h1>
                <div className="space-x-4">
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
                    <input
                        type="file"
                        accept=".json"
                        onChange={(e) => handleLoadConfig(e.target.files?.[0]!)}
                        className="hidden"
                        id="configFileInput"
                    />
                    <label
                        htmlFor="configFileInput"
                        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-600"
                    >
                        Load Config
                    </label>
                    <button
                        onClick={handleSaveConfig}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save Config
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

            <footer className="mt-6 text-gray-500 text-center">
                {loadedConfig ? `Loaded Config: ${loadedConfig}` : "No Config Loaded"}
            </footer>
        </div>
    );
};

export default App;
