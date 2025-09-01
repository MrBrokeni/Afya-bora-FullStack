import { useState, useCallback } from 'react';
import { extractPrescriptionTextAction } from '@/app/actions';
import { fileToDataUri } from '@/lib/utils/file-utils';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateUserId } from '@/lib/user';
import { savePrescriptionOCR } from '@/lib/firestore';

export interface OCRState {
  isProcessingOCR: boolean;
}

export interface OCRActions {
  processFileForOCR: (file: File) => Promise<string | null>;
}

export function useOCR(
  onTextExtracted: (text: string) => void,
  onError: (error: string) => void
): OCRState & OCRActions {
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const { toast } = useToast();

  const processFileForOCR = useCallback(async (file: File): Promise<string | null> => {
    setIsProcessingOCR(true);
    onError('');

    try {
      const dataUri = await fileToDataUri(file);
      const result = await extractPrescriptionTextAction(dataUri);

      if ('error' in result) {
        const errorMessage = `AI OCR Error: ${result.error}`;
        onError(errorMessage);
        onTextExtracted('');
        return null;
      }

      if (result.extractedText && 
          result.extractedText.trim() !== "" && 
          !result.extractedText.toLowerCase().includes("no text found") && 
          !result.extractedText.toLowerCase().includes("failed") && 
          result.extractedText.length > 10) {
        
        onTextExtracted(result.extractedText);
        
        // Fire-and-forget save so UI doesn't block on network issues
        (async () => {
          try {
            const userId = getOrCreateUserId();
            await savePrescriptionOCR(userId, result.extractedText);
          } catch (e) {
            console.error('Failed to save OCR text:', e);
          }
        })();
        
        toast({
          title: "AI OCR Successful",
          description: "Prescription text extracted and ready for diet plan generation.",
        });
        
        return result.extractedText;
      } else {
        let ocrResultMessage = "AI OCR could not extract sufficient text or the document was unreadable. Please try again with a clearer file or image.";
        if (result.extractedText && result.extractedText.trim() !== "") {
          ocrResultMessage = `Extracted text may be incomplete: "${result.extractedText.substring(0,100)}...". Please try again with a clearer file or image.`;
        }
        onError(ocrResultMessage);
        onTextExtracted('');
        return null;
      }
    } catch (error) {
      console.error("Error processing file for OCR:", error);
      const errorMessage = "An unexpected error occurred while processing the file. Please try again.";
      onError(errorMessage);
      onTextExtracted('');
      return null;
    } finally {
      setIsProcessingOCR(false);
    }
  }, [onTextExtracted, onError, toast]);

  return {
    isProcessingOCR,
    processFileForOCR,
  };
}
