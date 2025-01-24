export const parseSRT = (srt: string) => {
    const blocks = srt.split("\n\n");
    return blocks
        .map((block, index) => {
            const lines = block.split("\n");
            if (lines.length >= 3) {
                const [start, end] = lines[1].split(" --> ");
                return {
                    id: index + 1,
                    start: start.trim(),
                    end: end.trim(),
                    text: lines.slice(2).join(" ").trim(),
                    include: true,
                };
            }
            return null;
        })
        .filter(Boolean);
};
