import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Camera, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
  showCameraView: boolean;
  hasCameraPermission: boolean | null;
  isCameraLoading: boolean;
  cameraError: string | null;
  onCloseCamera: () => void;
  onCapturePhoto: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  disabled: boolean;
}

export function CameraCapture({
  showCameraView,
  hasCameraPermission,
  isCameraLoading,
  cameraError,
  onCloseCamera,
  onCapturePhoto,
  videoRef,
  canvasRef,
  disabled,
}: CameraCaptureProps) {
  if (!showCameraView) return null;

  return (
    <Card className="mt-4 border-primary">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Camera className="mr-2 h-5 w-5 text-primary" /> Camera Capture
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCameraLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2"/>Loading camera...
          </div>
        )}
        
        {cameraError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}
        
        <video 
          ref={videoRef} 
          className={cn(
            "w-full aspect-video rounded-md bg-muted object-cover", 
            { 'hidden': !hasCameraPermission || cameraError || isCameraLoading }
          )} 
          autoPlay 
          muted 
          playsInline 
        />
        
        {!hasCameraPermission && !isCameraLoading && !cameraError && hasCameraPermission !== null && (
          <Alert variant="default">
            <AlertDescription>
              Attempting to access camera. If prompted, please allow access.
            </AlertDescription>
          </Alert>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          onClick={onCloseCamera} 
          className="text-sm w-full sm:w-auto"
        >
          Close Camera
        </Button>
        <Button 
          onClick={onCapturePhoto} 
          disabled={!hasCameraPermission || isCameraLoading || disabled} 
          className="text-sm w-full sm:w-auto bg-accent hover:bg-accent/90"
        >
          <Zap className="mr-2 h-4 w-4" /> Take Photo
        </Button>
      </CardFooter>
    </Card>
  );
}
