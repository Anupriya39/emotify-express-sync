
import { useEffect, useState, RefObject } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FaceTrackingResult {
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
}

export const useFaceTracking = (
  webcamRef: RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [faceData, setFaceData] = useState<FaceTrackingResult>({
    isSmiling: false,
    isFrowning: false,
    isSurprised: false,
    emotions: {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      neutral: 1, // Start with neutral
    },
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (!isActive || !webcamRef.current) return;

    // In a real implementation, we would use face-api.js or MediaPipe here
    // For this demo, we'll just simulate face tracking with random values
    
    const intervalId = setInterval(() => {
      // Generate random emotion values
      const happy = Math.random() * 0.7;
      const sad = Math.random() * 0.3;
      const angry = Math.random() * 0.4;
      const surprised = Math.random() * 0.5;
      
      // Calculate neutral as the remaining amount to reach 1
      const emotionSum = happy + sad + angry + surprised;
      const neutral = emotionSum > 1 ? 0 : 1 - emotionSum;
      
      // Determine facial expressions based on highest emotion value
      const dominantEmotion = Math.max(happy, sad, angry, surprised, neutral);
      
      setFaceData({
        isSmiling: dominantEmotion === happy && happy > 0.5,
        isFrowning: dominantEmotion === sad && sad > 0.4 || dominantEmotion === angry && angry > 0.4,
        isSurprised: dominantEmotion === surprised && surprised > 0.5,
        emotions: {
          happy,
          sad,
          angry,
          surprised,
          neutral,
        },
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, [isActive, webcamRef]);

  return faceData;
};
