import React, { useState } from "react";
import { Ellipsis } from "lucide-react";

type Video = {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: number;
};

type VideoCardProps = {
  video: Video;
  onSelect: (video: Video) => void;
  setIsCourseListOpen?: (open: boolean) => void;
  formatDuration: (duration: number) => string;
};

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  setIsCourseListOpen,
  formatDuration,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(video);
    setIsCourseListOpen?.(false);
  };

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  return (
    <div key={video.id} className="flex justify-between items-start">
      <button
        onClick={handleSelect}
        className="flex items-start gap-2 w-full"
      >
        {/* Video Thumbnail with consistent shadow */}
        <div className="relative aspect-video w-1/2 rounded-xl overflow-hidden shadow-md shadow-black/10 dark:shadow-white/10 bg-[#1e1e1e]">
          <img
            src={video.thumbnail || "/images/thumbnail.png"}
            alt={video.title}
            width={200}
            height={100}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[12px] px-1 rounded">
            {formatDuration(video.duration || 0)}
          </div>
        </div>

        {/* Video Info */}
        <div className="text-left space-y-2 w-1/2">
          <h3 className="text-foreground font-semibold leading-[110%] line-clamp-2">
            {video.title}
          </h3>
          <div>
            <p className="text-black/70 dark:text-white/70 text-[14px]">Zion Fx</p>
            <p className="text-black/70 dark:text-white/70 text-[14px]">2 months ago</p>
          </div>
        </div>
      </button>

      {/* Video Actions */}
      <div className="relative">
        <button
          className="text-foreground/70 hover:text-foreground"
          onClick={toggleOptions}
        >
          <Ellipsis className="h-5 w-5 rotate-90" />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 card text-sm shadow-lg rounded p-2 z-10">
            <button className="block w-full text-left hover:bg-muted px-2 py-1 rounded">
              Add to Playlist
            </button>
            <button className="block w-full text-left hover:bg-muted px-2 py-1 rounded">
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;