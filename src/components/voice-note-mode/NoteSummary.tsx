
import { Card } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

interface NoteSummaryProps {
  summary: string;
  keyPoints: string[];
}

const NoteSummary = ({ summary, keyPoints }: NoteSummaryProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-medium mb-2 flex items-center">
          <LightbulbIcon className="h-4 w-4 text-yellow-500 mr-2" />
          Summary
        </h3>
        <Card className="p-3 bg-yellow-50 text-left">
          <p className="text-gray-700">{summary}</p>
        </Card>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Key Points</h3>
        <Card className="p-4 bg-purple-light text-left">
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default NoteSummary;
