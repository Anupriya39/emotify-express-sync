
import { useState, useRef, useEffect } from "react";
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
  const [currentText, setCurrentText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      // Reset states
      setTranscription("");
      setCurrentText("");
      setSummary("");
      setKeyPoints([]);
      
      // Check if browser supports Speech Recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        });
        return;
      }
      
      // Get audio stream for recording audio file
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.start();
      
      // Set up speech recognition
      // @ts-ignore - TypeScript doesn't know about the browser-specific implementation
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'en-US';
      
      let finalTranscriptionText = "";
      
      speechRecognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            finalTranscriptionText += (finalTranscriptionText ? " " : "") + finalTranscript.trim();
            setTranscription(finalTranscriptionText);
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show what is currently being recognized in real-time
        if (interimTranscript) {
          setCurrentText(interimTranscript);
        }
      };
      
      speechRecognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };
      
      speechRecognitionRef.current.onend = () => {
        if (isRecording && speechRecognitionRef.current) {
          // Restart recognition if it stopped but should be listening
          speechRecognitionRef.current.start();
        }
      };
      
      speechRecognitionRef.current.start();
      
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
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setCurrentText("");
    
    // Generate summary and key points for the transcription
    if (transcription) {
      // For simplicity, we'll create a basic summary and key points
      // In a real app, you would use an AI API for this
      const words = transcription.split(' ');
      setSummary(`This recording contains ${words.length} words discussing ${words.length > 5 ? words.slice(0, 5).join(', ') : 'a topic'}.`);
      
      // Extract some key points
      const sentences = transcription.split(/[.!?]/);
      const filteredPoints = sentences
        .filter(sentence => sentence.trim().length > 10)
        .slice(0, 4)
        .map(sentence => `📝 ${sentence.trim()}`);
      
      setKeyPoints(filteredPoints.length > 0 ? filteredPoints : ["📝 No key points identified"]);
      
      toast({
        title: "Transcription complete",
        description: "Your voice note has been processed successfully",
      });
    } else {
      toast({
        title: "No speech detected",
        description: "Try recording again and speak clearly",
        variant: "destructive",
      });
    }
  };

  const handleStopButtonClick = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      handleStopRecording();
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

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
                {currentText && (
                  <div className="p-3 mb-4 bg-blue-100 rounded-md border border-blue-300 animate-pulse max-w-md mx-auto">
                    <p className="text-blue-700 font-medium">Listening...</p>
                    <p className="text-gray-700">{currentText}</p>
                  </div>
                )}
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
                      <Button onClick={handleStartRecording}>
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
