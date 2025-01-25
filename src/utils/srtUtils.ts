export const saveSrt = (subtitles: any, filename: string) => {
    const subtitlesContent = convertToSrtFormat(subtitles);
    const blob = new Blob([subtitlesContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
};


export const saveASSrt = (subtitles: any, filename: string) => {
    const subtitlesContent = convertToSrtFormat(subtitles);
    if ("showSaveFilePicker" in window) {
        (async () => {
            try {
                const options = {
                    suggestedName: filename,
                    types: [
                        {
                            description: "Subtitle Files",
                            accept: {
                                "text/plain": [".srt"],
                            },
                        },
                    ],
                };
                const fileHandle = await (window as any).showSaveFilePicker(options);
                const writable = await fileHandle.createWritable();
                await writable.write(subtitlesContent);
                await writable.close();
                alert("File saved successfully!");
            } catch (error) {
                console.error("Error saving the file:", error);
                alert("An error occurred while saving the file.");
            }
        })();
    } else {
        saveSrt(subtitles, filename); // Fallback to download link
    }
};


const convertToSrtFormat = (subtitles: any[]): string => {
    return subtitles
        .filter((sub: any) => sub && sub.include)
        .map((sub: any, index: number) => {
            return `${index + 1}\n${sub.start} --> ${sub.end}\n${sub.text}\n`;
        }).join("\n");
};



export const loadConfig = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const config = JSON.parse(event.target?.result as string);
                resolve(config);
            } catch (error) {
                reject(new Error("Failed to parse config file."));
            }
        };
        reader.readAsText(file);
    });
};
