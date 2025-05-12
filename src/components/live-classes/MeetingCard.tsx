import { Copy, Video, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { avatarImages } from "@/constants";

interface MeetingCardProps {
  title: string;
  date: string; // expects a format like "4/27/2025, 5:15:00 PM"
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting = false,
  buttonIcon1,
  handleClick,
  link,
  buttonText = "Join Meeting",
}: MeetingCardProps) => {
  const [copied, setCopied] = useState(false);

  // Parse the incoming date string
  const dateObj = new Date(date);

  // Format the date: "April 27, 2025"
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  // Format the time: e.g. "5:15 PM"
  const formattedTime = dateObj.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit" 
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className={cn(
      "flex w-full flex-col justify-between rounded-2xl card px-5 py-6 xl:max-w-[400px] gap-3"
    )}>
      <div className="flex justify-between items-center">
        {/* Date and time badges */}
        <div className="flex gap-2">
          <span className="glassmorphism px-3 py-1.5 rounded-lg text-sm">
            {formattedDate}
          </span>
          <span className="glassmorphism px-3 py-1.5 rounded-lg text-sm flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formattedTime}
          </span>
        </div>

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          className="glassmorphism h-8 w-8 p-2 flex-center rounded-full relative">
          <Copy className="h-4 w-4" />
          {copied && (
            <span className="absolute -bottom-8 right-0 text-xs bg-green-500 text-white px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* Meeting details */}
      <article className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <h1 className={cn(
              "font-bold",
              isPreviousMeeting ? "text-xl" : "text-2xl"
            )}>
              {title}
            </h1>
            <p className="text-sm font-normal text-foreground/60">
              Zion FX meeting room
            </p>
          </div>
        </div>
      </article>

      {/* Attendees and action button */}
      <article className="flex justify-between items-center">
        <div className="relative flex">
          {isPreviousMeeting ? (
            // Compact version for previous meetings
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {avatarImages.slice(0, 2).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="attendee"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-gray-800"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-foreground/70">
                +{avatarImages.length - 2} attendees
              </span>
            </div>
          ) : (
            // Original version for upcoming meetings
            <>
              {avatarImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="attendees"
                  width={40}
                  height={40}
                  className={cn("rounded-full", { absolute: index > 0 })}
                  style={{ top: 0, left: index * 28 }}
                />
              ))}
              <div className="flex-center text-white absolute left-[136px] size-10 rounded-full border-[5px] border-[#1E1E1E] bg-[#1E1E1E]">
                +5
              </div>
            </>
          )}
        </div>

        {/* Action button - only show for upcoming meetings */}
        {!isPreviousMeeting && (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={handleClick} 
              className="bg-yellow-500 py-2 rounded-full flex gap-2 items-center px-6 hover:bg-yellow-600 transition-colors"
            >
              {buttonIcon1 ? (
                <img src={buttonIcon1} alt="feature" width={20} height={20} />
              ) : (
                <Video className="h-4 w-4" />
              )}
              &nbsp; {buttonText}
            </button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;