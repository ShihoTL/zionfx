'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';
import Loader from '@/components/Loader';

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://fd586825-0d73-4971-99bb-4dfb1e26c3f0-00-slfd6nsxdkqv.picard.replit.dev:3000';

const getStreamToken = async (userId: string): Promise<string> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stream/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch token: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.token) {
      throw new Error('Token not found in response');
    }
    return data.token as string;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const setupClient = async () => {
      if (!isLoaded || !user) return;
      if (!API_KEY) {
        setError('Stream API key is missing');
        return;
      }

      try {
        const boundTokenProvider = async () => {
          try {
            return await getStreamToken(user.id);
          } catch (error) {
            console.error('Token provider failed:', error);
            throw error;
          }
        };

        const client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user.id,
            name: user.username ?? user.id,
            image: user.imageUrl,
          },
          tokenProvider: boundTokenProvider,
        });

        setVideoClient(client);

        return () => {
          client.disconnectUser();
          setVideoClient(null);
        };
      } catch (error) {
        console.error('Error setting up Stream client:', error);
        setError('Failed to initialize video client');
      }
    };

    setupClient();

    return () => {
      setVideoClient(null);
      setError(null);
    };
  }, [user, isLoaded]);

  if (error) {
    return <div className="h-[100dvh] w-full flex-center text-red-500">{error}</div>;
  }

  if (user && !videoClient) {
    return <div className="h-[100dvh] w-full flex-center bg-background"><Loader /></div>;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;