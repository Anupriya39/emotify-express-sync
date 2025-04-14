
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SpeechPointsProps {
  isActive: boolean;
}

const SpeechPoints = ({ isActive }: SpeechPointsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [points, setPoints] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isActive) {
      if (isListening) {
        setIsListening(false);
      }
      return;
    }

    let recognition: SpeechRecognition | null = null;
    
    const setupSpeechRecognition = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        });
        return;
      }
      
      // @ts-ignore - TypeScript doesn't know about the browser-specific implementation
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            // Add the complete sentence as a point
            setPoints(prev => [...prev, finalTranscript.trim()]);
            setCurrentText("");
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show what is currently being recognized in real-time
        if (interimTranscript) {
          setCurrentText(interimTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        if (isListening) {
          // Restart recognition if it stopped but should be listening
          recognition?.start();
        }
      };
      
      return recognition;
    };
    
    if (isListening) {
      recognition = setupSpeechRecognition();
      try {
        recognition?.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, isActive, toast]);
  
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Speech Recognition Started",
        description: "Speak clearly to capture your points.",
      });
    } else {
      toast({
        title: "Speech Recognition Stopped",
        description: "Your points have been saved.",
      });
      setCurrentText("");
    }
  };
  
  const clearPoints = () => {
    setPoints([]);
    toast({
      title: "Points Cleared",
      description: "All speech points have been cleared.",
    });
  };
  
  if (!isActive) {
    return null;
  }
  
  return (
    <Card className="p-4 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium flex items-center">
          <FileText className="h-4 w-4 mr-2 text-purple-dark" />
          Speech Points
        </h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={isListening ? "destructive" : "default"}
            className="h-8"
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="mr-1 h-4 w-4" /> : <Mic className="mr-1 h-4 w-4" />}
            {isListening ? "Stop" : "Start"}
          </Button>
          {points.length > 0 && (
            <Button size="sm" variant="outline" className="h-8" onClick={clearPoints}>
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {isListening && currentText && (
        <div className="p-3 mb-4 bg-purple-light rounded-md border border-purple-dark animate-pulse">
          <p className="text-purple-dark font-medium">Listening...</p>
          <p className="text-gray-700">{currentText}</p>
        </div>
      )}
      
      {points.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {points.map((point, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded-md text-left">
              <div className="flex items-start">
                <Badge className="bg-purple-light text-purple-dark mr-2 mt-1">Point {index + 1}</Badge>
                <p className="text-gray-700">{point}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          {isListening ? 
            "Speak to capture your points..." : 
            "Click 'Start' to begin capturing speech points."}
        </div>
      )}
    </Card>
  );
};

export default SpeechPoints;
