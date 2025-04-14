
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmojiSelectorProps {
  emojis: string[];
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
}

const EmojiSelector = ({ emojis, selectedEmoji, onSelectEmoji }: EmojiSelectorProps) => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            variant="outline"
            className={cn(
              "h-16 text-3xl hover:bg-purple-light hover:text-purple-dark transition-all",
              selectedEmoji === emoji && "bg-purple-light border-purple ring-2 ring-purple/20"
            )}
            onClick={() => onSelectEmoji(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EmojiSelector;
