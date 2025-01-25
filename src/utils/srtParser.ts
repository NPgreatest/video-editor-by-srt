import {Subtitle} from "../components/types";

export const parseSRT = (srt: string) => {
    const blocks = srt.split("\n\n");
    return blocks
        .map((block) => {
            const lines = block.split("\n");
            if (lines.length >= 3) {
                const [start, end] = lines[1].split(" --> ");
                return {
                    id: parseInt(lines[0]),
                    start: start.trim(),
                    end: end.trim(),
                    text: lines.slice(2).join(" ").trim(),
                };
            }
            return null;
        })
        .filter(Boolean) as Subtitle[];
};
