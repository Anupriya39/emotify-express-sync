
import { cn } from "@/lib/utils";

interface EmojiPreviewProps {
  emoji: string;
  isAnimating: boolean;
}

const EmojiPreview = ({ emoji, isAnimating }: EmojiPreviewProps) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium text-gray-500 mb-2">
        {isAnimating ? "Live Preview" : "Preview"}
      </h3>
      <div 
        className={cn(
          "text-6xl p-4 transition-all transform",
          isAnimating && "animate-pulse hover:scale-110"
        )}
      >
        {emoji}
      </div>
    </div>
  );
};

export default EmojiPreview;
