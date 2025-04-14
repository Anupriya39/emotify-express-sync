
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface TranscriptionDisplayProps {
  transcription: string;
}

const TranscriptionDisplay = ({ transcription }: TranscriptionDisplayProps) => {
  return (
    <Card className="p-4 max-h-[300px] overflow-y-auto bg-gray-50">
      <div className="flex items-start mb-3">
        <FileText className="h-5 w-5 text-purple-dark mr-2 mt-0.5" />
        <h3 className="text-md font-medium">Transcription</h3>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap text-left">{transcription}</p>
    </Card>
  );
};

export default TranscriptionDisplay;
