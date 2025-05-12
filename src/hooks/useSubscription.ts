import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export interface SubscriptionUpdate {
  userId: string;
  type: 'signals' | 'mentorship';
  plan: 'basic' | 'grouped' | 'one_on_one';
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'canceled';
}

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateSubscription = async (update: SubscriptionUpdate) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userRef = doc(db, 'users', update.userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error('User not found.');
      }

      const userData = userSnap.data();

      const updatedSubscriptions = {
        ...userData.subscriptions,
        [update.type]: {
          plan: update.plan,
          start_date: update.start_date,
          end_date: update.end_date,
          status: update.status,
        },
      };

      await updateDoc(userRef, { subscriptions: updatedSubscriptions });

      const updatedUserSnap = await getDoc(userRef);
      const updatedUser = { id: updatedUserSnap.id, ...updatedUserSnap.data() };

      setSuccess(true);
      return updatedUser;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateSubscription,
    isLoading,
    error,
    success,
  };
};