import { db, auth } from '@/lib/firebase';
import { doc, setDoc, updateDoc, serverTimestamp, arrayUnion, collection, addDoc, Timestamp, getDocs, deleteDoc, CollectionReference, getDoc } from 'firebase/firestore';
import type { DietPlan, UserData } from '@/types/afya-bora';

export async function saveUserProfile(userId: string, data: Partial<UserData>) {
  const ref = doc(db, 'users', userId);
  await setDoc(ref, {
    ownerUid: auth.currentUser?.uid || null,
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function savePrescriptionOCR(userId: string, extractedText: string) {
  const ref = doc(db, 'users', userId);
  await setDoc(ref, {
    ownerUid: auth.currentUser?.uid || null,
    prescriptionText: extractedText,
    // Use client Timestamp inside arrayUnion; serverTimestamp() cannot be nested within arrayUnion
    ocrHistory: arrayUnion({ extractedText, at: Timestamp.now() }),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function saveDietPlan(userId: string, plan: DietPlan) {
  const plans = collection(db, 'users', userId, 'dietPlans');
  const docRef = await addDoc(plans, {
    ownerUid: auth.currentUser?.uid || null,
    plan,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function logOrder(userId: string, payload: { vendorId: string; itemId: string; quantity: number; orderId?: string; message?: string; }) {
  const orders = collection(db, 'users', userId, 'orders');
  await addDoc(orders, {
    ownerUid: auth.currentUser?.uid || null,
    ...payload,
    createdAt: serverTimestamp(),
  });
}

async function deleteAllDocs(colRef: CollectionReference) {
  const snap = await getDocs(colRef);
  const deletions = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.allSettled(deletions);
}

export async function deleteUserData(userId: string) {
  const userRef = doc(db, 'users', userId);
  const dietPlans = collection(db, 'users', userId, 'dietPlans');
  const orders = collection(db, 'users', userId, 'orders');

  await Promise.allSettled([
    deleteAllDocs(dietPlans),
    deleteAllDocs(orders),
  ]);

  await deleteDoc(userRef);
}

export async function getUserProfile(userId: string): Promise<Partial<UserData> | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<UserData>;
  // Only return known fields we use in the client form
  const {
    prescriptionText,
    foodAllergies,
    chronicConditions,
    age,
    weight,
    weightUnit,
    activityLevel,
    locationCoordinates,
    locationCity,
    initialWeight,
    initialWeightUnit,
    initialBloodSugar,
    initialBloodPressure,
    dailyWeightEntries,
    bloodSugarReadings,
    bloodPressureReadings,
  } = data;
  return {
    prescriptionText,
    foodAllergies,
    chronicConditions,
    age,
    weight,
    weightUnit,
    activityLevel,
    locationCoordinates,
    locationCity,
    initialWeight,
    initialWeightUnit,
    initialBloodSugar,
    initialBloodPressure,
    dailyWeightEntries,
    bloodSugarReadings,
    bloodPressureReadings,
  } as Partial<UserData>;
}


