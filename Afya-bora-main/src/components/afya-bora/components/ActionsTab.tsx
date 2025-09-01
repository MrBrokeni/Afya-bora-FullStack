import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Share2, Edit3, HeartPulse } from 'lucide-react';
import type { UserData, StepId } from '@/types/afya-bora';
import { SummarySection } from './SummarySection';
import HealthDataUpdate from '../HealthDataUpdate';
import { getOrCreateUserId } from '@/lib/user';
import { deleteUserData } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

interface ActionsTabProps {
  userData: UserData;
  navigateToStep: (stepId: StepId) => void;
  updateUserData: (data: Partial<UserData>) => void;
  onShareReport: () => void;
}

export function ActionsTab({ userData, navigateToStep, updateUserData, onShareReport }: ActionsTabProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const userId = getOrCreateUserId();

  return (
    <SummarySection title="Actions" icon={HeartPulse}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button onClick={onShareReport} variant="outline" className="w-full text-sm">
          <Share2 className="mr-2 h-4 w-4" /> Share Report
        </Button>
        <Button onClick={() => navigateToStep('prescription_patient_data')} variant="outline" className="w-full text-sm">
          <Edit3 className="mr-2 h-4 w-4" /> Update My Info
        </Button>
        <Button onClick={() => navigateToStep('prescription_patient_data')} variant="outline" className="w-full text-sm">
          <Edit3 className="mr-2 h-4 w-4" /> Update Prescription
        </Button>
        <HealthDataUpdate userData={userData} updateUserData={updateUserData} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full text-sm" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account and data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove your profile, OCR history, diet plans and orders from our database. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await deleteUserData(userId);
                    window.localStorage.removeItem('afyaBoraUserId');
                    toast({ title: 'Account Deleted', description: 'Your data has been removed.' });
                    // Reload to reset all client state
                    window.location.href = '/';
                  } catch (e) {
                    console.error(e);
                    toast({ title: 'Delete Failed', description: 'Could not delete your data. Please try again.', variant: 'destructive' });
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="text-xs text-muted-foreground mt-4">
        <p>Afya Bora is committed to your privacy. All data is handled securely. You can manage your data preferences at any time.</p>
      </div>
    </SummarySection>
  );
}
