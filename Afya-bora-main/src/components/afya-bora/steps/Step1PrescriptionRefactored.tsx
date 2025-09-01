"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Leaf, ScanText } from 'lucide-react';
import type { UserData, DietPlan } from '@/types/afya-bora';
import { Separator } from '@/components/ui/separator';
import { ensureAnonymousAuth } from '@/lib/user';

// Custom hooks
import { usePrescriptionForm } from '@/lib/hooks/use-prescription-form';
import { useCamera } from '@/lib/hooks/use-camera';
import { useOCR } from '@/lib/hooks/use-ocr';
import { useDietPlan } from '@/lib/hooks/use-diet-plan';

// Components
import { FileUploadSection } from '../components/FileUploadSection';
import { CameraCapture } from '../components/CameraCapture';
import { HealthInformationForm } from '../components/HealthInformationForm';
import { HealthMeasurementsForm } from '../components/HealthMeasurementsForm';

interface Step1PrescriptionProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToNextStep: () => void;
  setDietPlan: (plan: DietPlan | null) => void;
  setGlobalErrorMessage: (message: string | null) => void;
  globalErrorMessage: string | null;
  setIsLoadingDietPlan: (loading: boolean) => void;
}

const Step1PrescriptionRefactored: React.FC<Step1PrescriptionProps> = ({
  userData,
  updateUserData,
  navigateToNextStep,
  setDietPlan,
  setGlobalErrorMessage,
  globalErrorMessage,
  setIsLoadingDietPlan,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Form state management
  const formState = usePrescriptionForm(userData);

  // Camera functionality
  const camera = useCamera(
    videoRef,
    canvasRef,
    (file) => {
      const updatedFiles = [...formState.files, file];
      formState.setFiles(updatedFiles);
      updateUserData({ prescriptionFiles: updatedFiles, prescriptionText: undefined });
    }
  );

  // OCR functionality
  const ocr = useOCR(
    (text) => updateUserData({ prescriptionText: text }),
    (error) => setGlobalErrorMessage(error)
  );

  // Diet plan generation
  const dietPlan = useDietPlan(
    (plan) => {
      setDietPlan(plan);
      navigateToNextStep();
    },
    (error) => setGlobalErrorMessage(error),
    (loading) => setIsLoadingDietPlan(loading)
  );

  useEffect(() => {
    // Ensure Firebase anonymous auth for per-user writes
    ensureAnonymousAuth().catch(err => console.error('Anonymous auth failed', err));
    return () => { 
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleProcessOCR = () => {
    if (formState.files.length === 0) return;
    ocr.processFileForOCR(formState.files[0]);
  };

  const handleGenerateDietPlan = async () => {
    // Update userData with form values
    formState.updateUserDataFromForm(updateUserData);
    
    // Generate diet plan
    await dietPlan.generateDietPlan(userData);
  };

  const isDisabled = ocr.isProcessingOCR || camera.showCameraView;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <ScanText className="mr-2 h-6 w-6 text-primary" />
          AI Prescription Scan & Health Profile
        </CardTitle>
        <CardDescription>
          Start by letting our AI extract details from your prescription. Then, provide your health information for a personalized diet plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {globalErrorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{globalErrorMessage}</AlertDescription>
          </Alert>
        )}
        {formState.formErrors.prescription && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{formState.formErrors.prescription}</AlertDescription>
          </Alert>
        )}

        <FileUploadSection
          files={formState.files}
          onFilesChange={(files) => {
            formState.setFiles(files);
            updateUserData({ prescriptionFiles: files, prescriptionText: undefined });
          }}
          onProcessOCR={handleProcessOCR}
          isProcessingOCR={ocr.isProcessingOCR}
          showCameraView={camera.showCameraView}
          onOpenCamera={camera.handleOpenCamera}
          disabled={isDisabled}
        />

        <CameraCapture
          showCameraView={camera.showCameraView}
          hasCameraPermission={camera.hasCameraPermission}
          isCameraLoading={camera.isCameraLoading}
          cameraError={camera.cameraError}
          onCloseCamera={camera.handleCloseCamera}
          onCapturePhoto={camera.capturePhoto}
          videoRef={videoRef}
          canvasRef={canvasRef}
          disabled={formState.files.length >= 10}
        />
        
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

        <Separator className="my-6" />

        <HealthInformationForm
          foodAllergies={formState.foodAllergies}
          chronicConditions={formState.chronicConditions}
          age={formState.age}
          weight={formState.weight}
          weightUnit={formState.weightUnit}
          activityLevel={formState.activityLevel}
          onFoodAllergiesChange={formState.setFoodAllergies}
          onChronicConditionsChange={formState.setChronicConditions}
          onAgeChange={formState.setAge}
          onWeightChange={formState.setWeight}
          onWeightUnitChange={formState.setWeightUnit}
          onActivityLevelChange={formState.setActivityLevel}
          formErrors={formState.formErrors}
          disabled={isDisabled}
        />

        <Separator className="my-6" />

        <HealthMeasurementsForm
          initialWeight={formState.initialWeight}
          initialWeightUnit={formState.initialWeightUnit}
          initialFBS={formState.initialFBS}
          initialPPBS={formState.initialPPBS}
          initialSystolic={formState.initialSystolic}
          initialDiastolic={formState.initialDiastolic}
          onInitialWeightChange={formState.setInitialWeight}
          onInitialWeightUnitChange={formState.setInitialWeightUnit}
          onInitialFBSChange={formState.setInitialFBS}
          onInitialPPBSChange={formState.setInitialPPBS}
          onInitialSystolicChange={formState.setInitialSystolic}
          onInitialDiastolicChange={formState.setInitialDiastolic}
          disabled={isDisabled}
        />

        <Button 
          onClick={handleGenerateDietPlan} 
          className="w-full text-base py-3" 
          size="lg" 
          disabled={isDisabled}
        >
          <Leaf className="mr-2 h-5 w-5" />
          Generate My Diet Plan & Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step1PrescriptionRefactored;
