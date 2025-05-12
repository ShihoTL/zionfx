'use client';

import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/live-classes/MeetingSetup';
import MeetingRoom from '@/components/live-classes/MeetingRoom';

const Call = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) {
    return (
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-black z-[100] flex-center min-h-[100dvh]">
        <Loader />
      </div>
    );
  };

  if (!call) return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-black z-[100] flex-center flex-col min-h-[100dvh]">
      <p className="text-center text-3xl font-bold">
        Call Not Found
      </p>

      <Link to="/meeting" className="mt-4 bg-yellow-500 p-3 rounded-full ">
        Go back
      </Link>
    </div>
  );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="fixed top-0 left-0 bg-background z-[100] h-[100dvh] w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Call;