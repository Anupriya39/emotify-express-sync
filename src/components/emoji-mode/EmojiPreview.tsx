
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface EmojiPreviewProps {
  emoji: string;
  isAnimating: boolean;
  faceData?: {
    isSmiling: boolean;
    isFrowning: boolean;
    isSurprised: boolean;
    emotions: {
      happy: number;
      sad: number;
      angry: number;
      surprised: number;
      neutral: number;
    };
  };
}

const EmojiPreview = ({ emoji: selectedEmoji, isAnimating, faceData }: EmojiPreviewProps) => {
  const [displayEmoji, setDisplayEmoji] = useState(selectedEmoji);

  useEffect(() => {
    if (!isAnimating) {
      setDisplayEmoji(selectedEmoji);
      return;
    }

    if (!faceData) {
      setDisplayEmoji("😐"); // neutral face when no facial data is available during animation
      return;
    }

    // Determine emoji solely based on facial expressions
    if (faceData.isSmiling) {
      setDisplayEmoji("😊");
    } else if (faceData.isFrowning) {
      setDisplayEmoji("😠");
    } else if (faceData.isSurprised) {
      setDisplayEmoji("😮");
    } else {
      // Check emotion values to determine the appropriate emoji
      const { happy, sad, angry, surprised, neutral } = faceData.emotions;
      const dominantEmotion = Math.max(happy, sad, angry, surprised, neutral);
      
      if (dominantEmotion === happy && happy > 0.3) {
        setDisplayEmoji("😄");
      } else if (dominantEmotion === sad && sad > 0.3) {
        setDisplayEmoji("😢");
      } else if (dominantEmotion === angry && angry > 0.3) {
        setDisplayEmoji("😡");
      } else if (dominantEmotion === surprised && surprised > 0.3) {
        setDisplayEmoji("😲");
      } else {
        setDisplayEmoji("😐"); // Default to neutral emoji
      }
    }
  }, [faceData, isAnimating, selectedEmoji]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium text-gray-500 mb-2">
        {isAnimating ? "Live Reaction" : "Preview"}
      </h3>
      <div 
        className={cn(
          "text-6xl p-4 transition-all transform",
          isAnimating && "animate-pulse hover:scale-110"
        )}
      >
        {displayEmoji}
      </div>
      {isAnimating && faceData && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex justify-between w-full max-w-[200px] mb-1">
            <span>Happy: {Math.round(faceData.emotions.happy * 100)}%</span>
            <span>Sad: {Math.round(faceData.emotions.sad * 100)}%</span>
          </div>
          <div className="flex justify-between w-full max-w-[200px]">
            <span>Angry: {Math.round(faceData.emotions.angry * 100)}%</span>
            <span>Surprised: {Math.round(faceData.emotions.surprised * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPreview;
