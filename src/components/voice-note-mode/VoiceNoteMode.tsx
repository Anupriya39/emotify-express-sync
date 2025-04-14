
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  Square, 
  FileText, 
  Download, 
  Clock, 
  Sparkles,
  PenLine
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import TranscriptionDisplay from "./TranscriptionDisplay";
import NoteSummary from "./NoteSummary";

const VoiceNoteMode = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [transcription, setTranscription] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = handleStopRecording;
      mediaRecorderRef.current.start();
      
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly for best transcription results",
      });
      
    } catch (err) {
      console.error("Error starting recording:", err);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    
    // Mock transcription - in a real app, this would call a transcription API
    setTimeout(() => {
      const mockTranscription = `Thank you for joining today's meeting about the Q3 marketing strategy. We have several key points to discuss. First, we need to increase our social media presence by 30% this quarter. Second, we'll be launching a new product line in August that needs promotional materials. Third, the customer feedback survey showed that our messaging needs to be more concise and benefit-focused. Let's schedule follow-up meetings with each team to discuss specific action items. Any questions before we wrap up?`;
      
      setTranscription(mockTranscription);
      
      // Mock summary and key points - in a real app, this would use an AI API
      setTimeout(() => {
        setSummary("Q3 marketing strategy meeting outlined plans to boost social media presence by 30%, prepare for August product launch, and refine messaging based on customer feedback.");
        
        setKeyPoints([
          "📈 Increase social media presence by 30% in Q3",
          "🚀 New product line launching in August",
          "💬 Customer feedback shows messaging needs to be more concise",
          "📋 Schedule follow-up meetings with individual teams"
        ]);
        
        toast({
          title: "Transcription and summary ready",
          description: "Your voice note has been processed successfully",
        });
      }, 1500);
      
    }, 1500);
  };

  const handleStopButtonClick = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownloadTranscription = () => {
    if (!transcription) return;
    
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-note-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Transcription downloaded",
      description: "Your transcription has been saved as a text file",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <Card className="lg:col-span-4 bg-white shadow-md rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 bg-blue-soft border-b border-gray-200">
            <h2 className="text-xl font-semibold text-purple-dark flex items-center">
              <Mic className="mr-2" size={20} />
              Voice Recorder
            </h2>
          </div>

          <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            {isRecording ? (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto relative">
                  <div className="absolute w-16 h-16 rounded-full bg-red-200 animate-pulse"></div>
                  <Mic className="h-8 w-8 text-red-500 z-10" />
                </div>
                <div className="text-2xl font-bold mb-6">
                  {formatDuration(recordingDuration)}
                </div>
                <Button
                  variant="destructive"
                  size="lg"
                  className="px-6"
                  onClick={handleStopButtonClick}
                >
                  <Square className="mr-2 h-4 w-4" /> Stop Recording
                </Button>
              </div>
            ) : (
              <div className="text-center">
                {transcription ? (
                  <div className="w-full">
                    <div className="mb-4">
                      <TranscriptionDisplay transcription={transcription} />
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button 
                        variant="outline" 
                        className="mr-2"
                        onClick={handleDownloadTranscription}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                      <Button onClick={() => {
                        setTranscription("");
                        setSummary("");
                        setKeyPoints([]);
                      }}>
                        <Mic className="mr-2 h-4 w-4" /> New Recording
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                      <Mic className="h-8 w-8 text-blue-ocean" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Ready to Record</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Click the button below to start recording your voice note.
                      Speak clearly for the best transcription results.
                    </p>
                    <Button
                      size="lg"
                      className="px-6 bg-blue-ocean hover:bg-blue-700"
                      onClick={handleStartRecording}
                    >
                      <Mic className="mr-2 h-4 w-4" /> Start Recording
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 bg-white shadow-md rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 bg-blue-soft border-b border-gray-200">
            <h2 className="text-xl font-semibold text-purple-dark flex items-center">
              <Sparkles className="mr-2" size={20} />
              AI Summary
            </h2>
          </div>

          <div className="p-6">
            {summary ? (
              <NoteSummary summary={summary} keyPoints={keyPoints} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Summary Yet</h3>
                <p className="text-gray-500 mb-4 max-w-xs">
                  Record and transcribe your voice note to generate an AI summary with key points.
                </p>
                <div className="flex items-center justify-center w-full bg-gray-50 rounded-lg p-4">
                  <PenLine className="h-5 w-5 text-purple-dark mr-2" />
                  <span className="text-sm text-gray-600">
                    AI extracts key points and adds emoji suggestions
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceNoteMode;
