import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadCloud, Camera, Zap, Loader2 } from 'lucide-react';
import { validateFileUpload } from '@/lib/utils/validation';

interface FileUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onProcessOCR: () => void;
  isProcessingOCR: boolean;
  showCameraView: boolean;
  onOpenCamera: () => void;
  disabled: boolean;
}

export function FileUploadSection({
  files,
  onFilesChange,
  onProcessOCR,
  isProcessingOCR,
  showCameraView,
  onOpenCamera,
  disabled,
}: FileUploadSectionProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFilesInput = event.target.files;
    if (selectedFilesInput) {
      const newFilesArray = Array.from(selectedFilesInput);
      const error = validateFileUpload([...files, ...newFilesArray]);
      
      if (error) {
        // Handle error - you might want to pass this up to parent
        console.error(error);
        event.target.value = '';
        return;
      }
      
      const updatedFiles = [...files, ...newFilesArray];
      onFilesChange(updatedFiles);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-semibold text-primary flex items-center">
          <UploadCloud className="mr-2 h-5 w-5" /> 
          1. Prescription Upload & AI Scan
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload or capture your prescription (PDF, JPG, PNG, max 10 files, 5MB each). Our AI will extract the text.
        </p>
      </div>
      
      <Input
        id="prescription-file"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        multiple
        onChange={handleFileChange}
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        disabled={disabled}
      />
      
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium">Selected files ({files.length}/10):</p>
          <ScrollArea className="h-24 pr-2">
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {files.map((f, index) => (
                <li key={index}>{f.name} ({(f.size / (1024*1024)).toFixed(2)}MB)</li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2">
        {!showCameraView && (
          <Button 
            variant="outline" 
            onClick={onOpenCamera} 
            className="w-full sm:w-auto text-sm py-2.5" 
            disabled={disabled}
          >
            <Camera className="mr-2 h-4 w-4" /> Capture from Camera
          </Button>
        )}
        {files.length > 0 && (
          <Button 
            variant="default" 
            onClick={onProcessOCR} 
            className="w-full sm:w-auto text-sm py-2.5 bg-accent hover:bg-accent/90" 
            disabled={isProcessingOCR || showCameraView || !files[0]}
          >
            {isProcessingOCR ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            {isProcessingOCR ? "Processing OCR..." : "Process File with AI OCR"}
          </Button>
        )}
      </div>
    </div>
  );
}
