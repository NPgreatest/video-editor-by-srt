export const saveConfig = (config: any, filename: string) => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
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
