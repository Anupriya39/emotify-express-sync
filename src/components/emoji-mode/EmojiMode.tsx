import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Download, 
  Share2, 
  RefreshCw, 
  SmilePlus,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import EmojiSelector from "./EmojiSelector";
import WebcamView from "./WebcamView";
import EmojiPreview from "./EmojiPreview";
import SpeechPoints from "./SpeechPoints";
import { useToast } from "@/components/ui/use-toast";
import { useFaceTracking } from "@/hooks/useFaceTracking";

// Mock emoji data
const EMOJIS = ["😊", "😂", "😍", "😢", "😡", "🤔", "😮", "😴", "🤢", "😎"];
const MEME_EMOJIS = ["🗿", "💀", "🤡", "👽", "🙄", "😤", "🥴", "🧠", "👀", "🫠"];

const EmojiMode = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("😊");
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureMode, setCaptureMode] = useState<"standard" | "meme">("standard");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const faceData = useFaceTracking(webcamRef, isCapturing);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
        console.error("Error accessing camera:", err);
      }
    };

    requestCameraPermission();

    // Clean up function
    return () => {
      // Stop any streams when component unmounts
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleCapture = () => {
    if (!hasPermission) {
      toast({
        title: "Camera permission required",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
      return;
    }

    setIsCapturing(!isCapturing);
    
    if (!isCapturing) {
      toast({
        title: "Emoji Puppeteer activated!",
        description: "Your facial expressions are now animating the emoji",
      });
    }
  };

  const handleShareEmoji = () => {
    toast({
      title: "Coming Soon!",
      description: "Sharing functionality will be available in the next update",
    });
  };

  const handleDownloadEmoji = () => {
    toast({
      title: "Coming Soon!",
      description: "Download functionality will be available in the next update",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <Card className="lg:col-span-4 bg-white shadow-md rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 bg-purple-light border-b border-gray-200">
            <h2 className="text-xl font-semibold text-purple-dark flex items-center">
              <Camera className="mr-2" size={20} />
              Emoji Puppeteer
            </h2>
          </div>

          <div className="relative aspect-video bg-gray-900 overflow-hidden">
            <WebcamView 
              webcamRef={webcamRef} 
              isCapturing={isCapturing} 
              hasPermission={hasPermission}
            />
            
            {isCapturing && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <span className="animate-pulse mr-1">●</span> LIVE
              </div>
            )}
          </div>

          <div className="p-4 flex flex-wrap gap-2 justify-between items-center">
            <Button
              onClick={toggleCapture}
              className={cn(
                "transition-all",
                isCapturing 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-purple-vibrant hover:bg-purple-dark"
              )}
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Stop Capturing
                </>
              ) : (
                <>
                  <SmilePlus className="mr-2 h-4 w-4" /> Start Capturing
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShareEmoji}
                disabled={!isCapturing}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadEmoji}
                disabled={!isCapturing}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-3 space-y-6">
        <Card className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col">
          <CardContent className="p-0 flex flex-col flex-grow">
            <div className="p-4 bg-purple-light border-b border-gray-200">
              <h2 className="text-xl font-semibold text-purple-dark">
                Select Emoji
              </h2>
            </div>
            
            <Tabs defaultValue="standard" className="flex-grow flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="standard"
                  onClick={() => setCaptureMode("standard")}
                >
                  Standard Emojis
                </TabsTrigger>
                <TabsTrigger 
                  value="meme"
                  onClick={() => setCaptureMode("meme")}
                >
                  <Sparkles className="mr-1 h-4 w-4" /> Meme Emojis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="flex-grow p-4">
                <EmojiSelector 
                  emojis={EMOJIS} 
                  selectedEmoji={selectedEmoji} 
                  onSelectEmoji={setSelectedEmoji} 
                />
              </TabsContent>
              
              <TabsContent value="meme" className="flex-grow p-4">
                <EmojiSelector 
                  emojis={MEME_EMOJIS} 
                  selectedEmoji={selectedEmoji} 
                  onSelectEmoji={setSelectedEmoji} 
                />
              </TabsContent>
            </Tabs>

            <div className="p-4 border-t border-gray-200">
              <EmojiPreview 
                emoji={selectedEmoji} 
                isAnimating={isCapturing} 
                faceData={isCapturing ? faceData : undefined}
              />
            </div>
          </CardContent>
        </Card>
        
        <SpeechPoints isActive={isCapturing} />
      </div>
    </div>
  );
};

export default EmojiMode;
