
import { useEffect, RefObject } from "react";
import { CameraOff, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebcamViewProps {
  webcamRef: RefObject<HTMLVideoElement>;
  isCapturing: boolean;
  hasPermission: boolean | null;
}

const WebcamView = ({ webcamRef, isCapturing, hasPermission }: WebcamViewProps) => {
  useEffect(() => {
    const setupCamera = async () => {
      if (!isCapturing || !hasPermission || !webcamRef.current) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    
    setupCamera();
    
    // Cleanup function
    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturing, hasPermission, webcamRef]);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6 text-center">
        <CameraOff size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Camera Access Denied</h3>
        <p className="text-gray-500 mb-4">
          Please allow camera access in your browser settings to use the Emoji Puppeteer.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!isCapturing) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800 p-6 text-center">
        <Camera size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Camera Ready</h3>
        <p className="text-gray-400 mb-4">
          Click "Start Capturing" to begin animating your emojis!
        </p>
      </div>
    );
  }

  return (
    <video
      ref={webcamRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
    />
  );
};

export default WebcamView;
