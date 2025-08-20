
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, AlertCircle, FileText, Camera, Zap, Loader2, User, CheckCircle, Leaf, ScanText, UserCheck } from 'lucide-react';
import type { UserData, DietPlan, GenerateDietPlanInput } from '@/types/afya-bora';
import { AfyaBoraGenerateDietPlanInputSchema } from '@/types/afya-bora';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { extractPrescriptionTextAction, getGeneratedDietPlan } from '@/app/actions';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getOrCreateUserId, ensureAnonymousAuth } from '@/lib/user';
import { saveUserProfile, savePrescriptionOCR, saveDietPlan } from '@/lib/firestore';


interface Step1PrescriptionAndPatientDataProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToNextStep: () => void;
  setDietPlan: (plan: DietPlan | null) => void;
  setGlobalErrorMessage: (message: string | null) => void;
  globalErrorMessage: string | null;
  setIsLoadingDietPlan: (loading: boolean) => void;
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Step1Prescription: React.FC<Step1PrescriptionAndPatientDataProps> = ({
  userData,
  updateUserData,
  navigateToNextStep,
  setDietPlan,
  setGlobalErrorMessage,
  globalErrorMessage,
  setIsLoadingDietPlan
}) => {
  const userId = getOrCreateUserId();
  const [files, setFiles] = useState<File[]>(userData.prescriptionFiles || []);
  // ocrFailed state is implicitly handled by globalErrorMessage and userData.prescriptionText presence
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCameraView, setShowCameraView] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [foodAllergies, setFoodAllergies] = useState(userData.foodAllergies || '');
  const [chronicConditions, setChronicConditions] = useState(userData.chronicConditions || '');
  const [age, setAge] = useState<string>(userData.age?.toString() || '');
  const [weight, setWeight] = useState<string>(userData.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(userData.weightUnit || 'kg');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | undefined>(userData.activityLevel);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  useEffect(() => {
    // ensure Firebase anonymous auth for per-user writes
    ensureAnonymousAuth().catch(err => console.error('Anonymous auth failed', err));
    return () => { 
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalErrorMessage(null);
    // setOcrFailed(false); // No longer needed due to removal of manualPrescription section
    const selectedFilesInput = event.target.files;
    if (selectedFilesInput) {
      const newFilesArray = Array.from(selectedFilesInput);
      if (files.length + newFilesArray.length > 10) {
        setGlobalErrorMessage("You can upload a maximum of 10 files.");
        event.target.value = ''; 
        return;
      }

      const validNewFiles: File[] = [];
      let localError = "";
      for (const f of newFilesArray) {
        if (f.size > 5 * 1024 * 1024) { 
          localError = "One or more files exceed the 5MB size limit (5MB per file).";
          break;
        }
        if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
          localError = "Invalid file type. Please upload PDF, JPG, PNG, or WEBP files.";
          break;
        }
        validNewFiles.push(f);
      }

      if (localError) {
        setGlobalErrorMessage(localError);
        event.target.value = '';
        return;
      }
      
      const updatedFiles = [...files, ...validNewFiles];
      setFiles(updatedFiles);
      updateUserData({ prescriptionFiles: updatedFiles, prescriptionText: undefined }); // Clear old OCR text
      event.target.value = ''; 
    }
  };

  const processSelectedFileForOCR = async () => {
    if (files.length === 0) {
      toast({ title: "No File Selected", description: "Please upload or capture a file first to process with AI OCR.", variant: "destructive" });
      return;
    }
    const fileToProcess = files[0]; 

    setIsProcessingOCR(true);
    setGlobalErrorMessage(null);
    // setOcrFailed(false); // No longer needed

    try {
      const dataUri = await fileToDataUri(fileToProcess);
      const result = await extractPrescriptionTextAction(dataUri);

      if ('error' in result) {
        setGlobalErrorMessage(`AI OCR Error: ${result.error}`);
        // setOcrFailed(true); // No longer needed
        updateUserData({ prescriptionText: undefined });
      } else if (result.extractedText && result.extractedText.trim() !== "" && !result.extractedText.toLowerCase().includes("no text found") && !result.extractedText.toLowerCase().includes("failed") && result.extractedText.length > 10) {
        updateUserData({ prescriptionText: result.extractedText });
        // Fire-and-forget save so UI doesn't block on network issues
        (async () => {
          try {
            await savePrescriptionOCR(userId, result.extractedText);
          } catch (e) {
            console.error('Failed to save OCR text:', e);
          }
        })();
        // setOcrFailed(false); // No longer needed
        toast({
          title: "AI OCR Successful",
          description: "Prescription text extracted and ready for diet plan generation.",
        });
      } else {
        let ocrResultMessage = "AI OCR could not extract sufficient text or the document was unreadable. Please try again with a clearer file or image.";
        if (result.extractedText && result.extractedText.trim() !== "") {
            ocrResultMessage = `Extracted text may be incomplete: "${result.extractedText.substring(0,100)}...". Please try again with a clearer file or image.`;
        }
        setGlobalErrorMessage(ocrResultMessage);
        // setOcrFailed(true); // No longer needed
        updateUserData({ prescriptionText: undefined });
      }
    } catch (error) {
      console.error("Error processing file for OCR:", error);
      setGlobalErrorMessage("An unexpected error occurred while processing the file. Please try again.");
      // setOcrFailed(true); // No longer needed
      updateUserData({ prescriptionText: undefined });
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const validatePatientData = () => {
    const currentErrors: Record<string,string> = {};
    const finalPrescriptionText = userData.prescriptionText || "";

    if (!finalPrescriptionText) {
        currentErrors.prescription = "Prescription information is required. Please upload/capture a file and process it using AI OCR.";
    } else if (finalPrescriptionText.length < 10) {
        currentErrors.prescription = "Extracted prescription text is too short. Please try AI OCR with a clearer document or ensure the document contains sufficient medical text.";
    }

    if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0 || parseInt(age) > 120) {
      currentErrors.age = "Please enter a valid age (1-120).";
    }
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      currentErrors.weight = "Please enter a valid weight.";
    }
    if (!activityLevel) {
      currentErrors.activityLevel = "Please select your activity level.";
    }
    
    const ageNum = parseInt(age);
    let weightKgNum = parseFloat(weight);
    if (weightUnit === 'lbs') {
      weightKgNum = parseFloat(weight) * 0.453592;
    }

    const validationInputForAI = {
      prescriptionText: finalPrescriptionText || "No prescription text available after OCR.", 
      foodAllergies: foodAllergies.trim() || "none",
      chronicConditions: chronicConditions.trim() || "none",
      age: ageNum,
      weightKg: weightKgNum,
      activityLevel: activityLevel
    };
    
    const parseResult = AfyaBoraGenerateDietPlanInputSchema.safeParse(validationInputForAI);
    if(!parseResult.success) {
        parseResult.error.errors.forEach(err => {
            if(err.path.length > 0) {
              const field = err.path[0] as string;
              if (!currentErrors[field]) currentErrors[field] = err.message;
            }
        });
    }
    
    setFormErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };
  
  const handleGenerateDietPlan = async () => {
    setGlobalErrorMessage(null);
    setFormErrors({});

    if (!validatePatientData()) {
      setGlobalErrorMessage("Please correct the errors in the form before generating the diet plan.");
      if (!userData.prescriptionText) {
         toast({
          title: "Prescription Needed",
          description: "Please upload/capture and process a prescription file using AI OCR first.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsLoadingDietPlan(true);

    const finalPrescriptionText = userData.prescriptionText; 
    let weightInKg = parseFloat(weight);
    if (weightUnit === 'lbs') {
      weightInKg = parseFloat(weight) * 0.453592;
    }
    
    // Update userData with the latest form values before generating the diet plan
    // This ensures that any changes made by the user just before clicking "Generate" are captured.
    updateUserData({
      prescriptionText: finalPrescriptionText, // This is already set by OCR
      foodAllergies: foodAllergies.trim() || "none",
      chronicConditions: chronicConditions.trim() || "none",
      age: parseInt(age),
      weight: parseFloat(weight),
      weightUnit: weightUnit,
      activityLevel: activityLevel,
    });

    // Persist latest profile to Firestore
    try {
      await saveUserProfile(userId, {
        prescriptionText: finalPrescriptionText,
        foodAllergies: foodAllergies.trim() || 'none',
        chronicConditions: chronicConditions.trim() || 'none',
        age: parseInt(age),
        weight: parseFloat(weight),
        weightUnit: weightUnit,
        activityLevel: activityLevel,
      });
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }

    const dietPlanInput: GenerateDietPlanInput = {
      prescriptionText: finalPrescriptionText!, 
      foodAllergies: foodAllergies.trim() || "none",
      chronicConditions: chronicConditions.trim() || "none",
      age: parseInt(age),
      weightKg: weightInKg,
      activityLevel: activityLevel!, 
    };

    const result = await getGeneratedDietPlan(dietPlanInput);
    setIsLoadingDietPlan(false);

    if ('error' in result) {
      setGlobalErrorMessage(`Failed to generate diet plan: ${result.error}`);
      setDietPlan(null);
      toast({
        title: "Diet Plan Generation Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setDietPlan(result);
      try {
        const planId = await saveDietPlan(userId, result);
        console.log('Saved diet plan with id', planId);
      } catch (e) {
        console.error('Failed to save diet plan:', e);
      }
      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized diet plan is ready. Proceeding to view your plan.",
      });
      navigateToNextStep(); 
    }
  };

  const requestCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera API is not supported by your browser.");
      setHasCameraPermission(false); setShowCameraView(false);
      toast({ variant: 'destructive', title: 'Camera Not Supported' });
      return;
    }
    setIsCameraLoading(true); setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setHasCameraPermission(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
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
  };

  const handleOpenCamera = () => {
    if (files.length >= 10) {
        setGlobalErrorMessage("You have reached the maximum of 10 files.");
        toast({variant: 'destructive', title: 'File Limit Reached', description: 'Cannot capture more images.'});
        return;
    }
    setShowCameraView(true);
    requestCamera();
  };

  const handleCloseCamera = () => {
    setShowCameraView(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setHasCameraPermission(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || files.length >= 10) {
      if (files.length >= 10) {
        setGlobalErrorMessage("You have reached the maximum of 10 files.");
        toast({variant: 'destructive', title: 'File Limit Reached', description: 'Cannot capture more images.'});
      }
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const newFile = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
          if (newFile.size > 5 * 1024 * 1024) {
             setGlobalErrorMessage("Captured image is too large (max 5MB).");
             toast({variant: 'destructive', title: 'Image Too Large'});
             return;
          }
          const updatedFiles = [...files, newFile];
          setFiles(updatedFiles);
          updateUserData({ prescriptionFiles: updatedFiles, prescriptionText: undefined }); // Clear old OCR text
          toast({ title: 'Image Captured', description: `${newFile.name} added. Process it using AI OCR.` });
          handleCloseCamera(); 
        }
      }, 'image/png');
    }
  };
  
  const mainButtonText = "Generate My Diet Plan & Continue";

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <ScanText className="mr-2 h-6 w-6 text-primary" /> {/* Updated Icon */}
          AI Prescription Scan & Health Profile
        </CardTitle>
        <CardDescription>
          Start by letting our AI extract details from your prescription. Then, provide your health information for a personalized diet plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {globalErrorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{globalErrorMessage}</AlertDescription>
          </Alert>
        )}
        {formErrors.prescription && <Alert variant="destructive" className="mt-2"><AlertDescription>{formErrors.prescription}</AlertDescription></Alert>}

        <div className="space-y-2">
          <div className="space-y-1 mb-4">
            <h2 className="text-xl font-semibold text-primary flex items-center">
              <UploadCloud className="mr-2 h-5 w-5" /> 
              1. Prescription Upload & AI Scan
            </h2>
            <p className="text-sm text-muted-foreground">Upload or capture your prescription (PDF, JPG, PNG, max 10 files, 5MB each). Our AI will extract the text.</p>
          </div>
          <Input
            id="prescription-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            disabled={files.length >= 10 || showCameraView || isProcessingOCR}
          />
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">Selected files ({files.length}/10):</p>
              <ScrollArea className="h-24 pr-2">
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                  {files.map((f, index) => <li key={index}>{f.name} ({(f.size / (1024*1024)).toFixed(2)}MB)</li>)}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            {!showCameraView && (
            <Button variant="outline" onClick={handleOpenCamera} className="w-full sm:w-auto text-sm py-2.5" disabled={files.length >= 10 || isProcessingOCR}>
                <Camera className="mr-2 h-4 w-4" /> Capture from Camera
            </Button>
            )}
            {files.length > 0 && (
                <Button 
                    variant="default" 
                    onClick={processSelectedFileForOCR} 
                    className="w-full sm:w-auto text-sm py-2.5 bg-accent hover:bg-accent/90" 
                    disabled={isProcessingOCR || showCameraView || !files[0]} // Disable if no file at index 0
                >
                {isProcessingOCR ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                {isProcessingOCR ? "Processing OCR..." : "Process File with AI OCR"}
                </Button>
            )}
        </div>

        {showCameraView && (
          <Card className="mt-4 border-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Camera className="mr-2 h-5 w-5 text-primary" /> Camera Capture</CardTitle>
            </CardHeader>
            <CardContent>
              {isCameraLoading && <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin mr-2"/>Loading camera...</div>}
              {cameraError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Camera Error</AlertTitle><AlertDescription>{cameraError}</AlertDescription></Alert>}
              <video ref={videoRef} className={cn("w-full aspect-video rounded-md bg-muted object-cover", { 'hidden': !hasCameraPermission || cameraError || isCameraLoading })} autoPlay muted playsInline />
              {!hasCameraPermission && !isCameraLoading && !cameraError && hasCameraPermission !== null && (
                <Alert variant="default">
                  <AlertDescription>Attempting to access camera. If prompted, please allow access.</AlertDescription>
                </Alert>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={handleCloseCamera} className="text-sm w-full sm:w-auto">Close Camera</Button>
              <Button onClick={capturePhoto} disabled={!hasCameraPermission || isCameraLoading || files.length >= 10} className="text-sm w-full sm:w-auto bg-accent hover:bg-accent/90">
                <Zap className="mr-2 h-4 w-4" /> Take Photo
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {userData.prescriptionText && (
          <Alert variant="default" className="mt-4 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">AI OCR Successful!</AlertTitle>
            <AlertDescription>
              <strong>Extracted Text:</strong> "{userData.prescriptionText.substring(0, 150)}{userData.prescriptionText.length > 150 ? '...' : ''}"
              <br />This text will be used for diet plan generation. You can proceed to fill your health information.
            </AlertDescription>
          </Alert>
        )}
        {/* Removed manual prescription textarea section */}

        <Separator className="my-6" />

        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-semibold text-primary flex items-center">
            <UserCheck className="mr-2 h-5 w-5" /> 
            2. Your Health Information
          </h2>
           <p className="text-sm text-muted-foreground">Help us personalize your plan by providing some health details.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="food-allergies" className="text-sm">Food Allergies or Intolerances</Label>
            <Textarea
              id="food-allergies"
              placeholder="e.g., gluten, nuts, shellfish, lactose. Enter 'none' if no allergies."
              value={foodAllergies}
              onChange={(e) => setFoodAllergies(e.target.value)}
              rows={2}
              className="w-full text-sm"
              disabled={isProcessingOCR || showCameraView}
            />
            {formErrors.foodAllergies && <p className="text-xs text-destructive">{formErrors.foodAllergies}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="chronic-conditions" className="text-sm">Chronic Conditions or Diseases</Label>
            <Textarea
              id="chronic-conditions"
              placeholder="e.g., type 2 diabetes, hypertension, kidney disease. Enter 'none' if no conditions."
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              rows={2}
              className="w-full text-sm"
              disabled={isProcessingOCR || showCameraView}
            />
            {formErrors.chronicConditions && <p className="text-xs text-destructive">{formErrors.chronicConditions}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-sm">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 35"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-sm"
                disabled={isProcessingOCR || showCameraView}
              />
              {formErrors.age && <p className="text-xs text-destructive">{formErrors.age}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weight" className="text-sm">Current Weight</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full text-sm"
                  disabled={isProcessingOCR || showCameraView}
                />
                <RadioGroup defaultValue={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)} className="flex" disabled={isProcessingOCR || showCameraView}>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="kg" id="kg" />
                    <Label htmlFor="kg" className="text-xs">kg</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="lbs" id="lbs" />
                    <Label htmlFor="lbs" className="text-xs">lbs</Label>
                  </div>
                </RadioGroup>
              </div>
               {formErrors.weight && <p className="text-xs text-destructive">{formErrors.weight}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="activity-level" className="text-sm">Typical Daily Activity Level</Label>
            <Select value={activityLevel} onValueChange={(value: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active') => setActivityLevel(value)} disabled={isProcessingOCR || showCameraView}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (desk job, little to no exercise)</SelectItem>
                <SelectItem value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                <SelectItem value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.activityLevel && <p className="text-xs text-destructive">{formErrors.activityLevel}</p>}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-4">
            <p>Your data is encrypted and kept confidential. Prescription images are processed by AI and not stored long-term beyond operational needs.</p>
        </div>

        <Button onClick={handleGenerateDietPlan} className="w-full text-base py-3" size="lg" disabled={isProcessingOCR || showCameraView }>
          <Leaf className="mr-2 h-5 w-5" />
          {mainButtonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step1Prescription;
