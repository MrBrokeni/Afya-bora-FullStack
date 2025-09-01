import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CameraState {
  showCameraView: boolean;
  hasCameraPermission: boolean | null;
  isCameraLoading: boolean;
  cameraError: string | null;
}

export interface CameraActions {
  requestCamera: () => Promise<void>;
  handleOpenCamera: () => void;
  handleCloseCamera: () => void;
  capturePhoto: () => Promise<File | null>;
}

export function useCamera(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onFileCaptured: (file: File) => void,
  maxFiles: number = 10
): CameraState & CameraActions {
  const [showCameraView, setShowCameraView] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const requestCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera API is not supported by your browser.");
      setHasCameraPermission(false);
      setShowCameraView(false);
      toast({ variant: 'destructive', title: 'Camera Not Supported' });
      return;
    }
    
    setIsCameraLoading(true);
    setCameraError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      let msg = 'Please enable camera permissions in your browser settings.';
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") msg = "Camera access was denied.";
        else if (error.name === "NotFoundError") msg = "No camera found.";
      }
      setCameraError(msg);
      toast({ variant: 'destructive', title: 'Camera Access Error', description: msg });
      setShowCameraView(false);
    } finally {
      setIsCameraLoading(false);
    }
  }, [videoRef, toast]);

  const handleOpenCamera = useCallback(() => {
    setShowCameraView(true);
    requestCamera();
  }, [requestCamera]);

  const handleCloseCamera = useCallback(() => {
    setShowCameraView(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setHasCameraPermission(null);
  }, [videoRef]);

  const capturePhoto = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) {
      return null;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (!context) {
      return null;
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (blob) {
          const newFile = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
          if (newFile.size > 5 * 1024 * 1024) {
            toast({ variant: 'destructive', title: 'Image Too Large' });
            resolve(null);
            return;
          }
          onFileCaptured(newFile);
          toast({ title: 'Image Captured', description: `${newFile.name} added. Process it using AI OCR.` });
          handleCloseCamera();
          resolve(newFile);
        } else {
          resolve(null);
        }
      }, 'image/png');
    });
  }, [videoRef, canvasRef, onFileCaptured, handleCloseCamera, toast]);

  return {
    // State
    showCameraView,
    hasCameraPermission,
    isCameraLoading,
    cameraError,
    // Actions
    requestCamera,
    handleOpenCamera,
    handleCloseCamera,
    capturePhoto,
  };
}
