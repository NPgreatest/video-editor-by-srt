import React, { useRef, useState } from "react";

const VideoPlayer: React.FC<{
    videoFile: File | null;
    setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
    previewStartTime?: number;
    previewEndTime?: number;
}> = ({ videoFile, setVideoFile, previewStartTime, previewEndTime }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // Autoplay video for preview
    React.useEffect(() => {
        console.log({previewStartTime, previewEndTime});
        if (videoRef.current && previewStartTime !== undefined && previewEndTime !== undefined) {
            const video = videoRef.current;
            video.currentTime = previewStartTime;
            video.playbackRate = playbackSpeed;
            // video.play();

            var playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Automatic playback started
                        console.log('Playback started.');

                        // Set a timeout to pause the video after the preview duration
                        const timeout = setTimeout(() => {
                            video.pause();
                            console.log('Video paused at the end of the preview duration.');
                        }, (previewEndTime - previewStartTime) * 1000 / playbackSpeed);

                        // Return a cleanup function to clear the timeout
                        return () => clearTimeout(timeout);
                    })
                    .catch(error => {
                        console.error('Error during playback:', error);
                        // Handle autoplay prevention or other errors
                        // Example: Display a paused UI
                    });
            } else {
                console.error('The play promise is undefined, playback could not be initiated.');
            }

            // return () => clearTimeout(timeout);
        }
    }, [previewStartTime, previewEndTime, playbackSpeed]);

    return (
        <div>
            {videoFile ? (
                <div>
                    <video ref={videoRef} controls src={URL.createObjectURL(videoFile)} className="w-full rounded" />
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Playback Speed
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-center text-sm mt-2">
                            {playbackSpeed.toFixed(1)}x
                        </div>
                    </div>
                </div>
            ) : (
                <div>No video uploaded</div>
            )}
            <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="mt-4 block w-full"
            />
        </div>
    );
};

export default VideoPlayer;
