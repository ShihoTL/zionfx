import { useEffect, useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ReactionsButton,
  ScreenShareButton,
  CancelCallButton,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users, MoreVertical } from 'lucide-react';

import Loader from '@/components/Loader';
import AdminControls from './AdminControls';
import { cn } from '@/lib/utils';

type CallLayoutType = 'default' | 'speaker-right';

const MeetingRoom = () => {
  const [searchParams] = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const navigate = useNavigate();
  const [layout, setLayout] = useState<CallLayoutType>('default');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  // Set layout based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLayout('default');
      } else {
        setLayout('speaker-right');
      }
    };

    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (callingState !== CallingState.JOINED) {
    return <div className="h-[100dvh] w-full flex-center"><Loader /></div>;
  }

  const CallLayout = () => {
    switch (layout) {
      case 'default':
        return <SpeakerLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden pt-4 text-white flex flex-col">
      {/* Mobile admin menu button */}
      <AdminControls />
      
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('fixed top-0 right-0 h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-4 w-full z-10 flex p-2">
        <div className="hidden md:flex justify-center items-center">
          <CallControls onLeave={() => navigate(`/meeting`)} />
        </div>
      </div>

      <div className="z-[1] w-full flex md:hidd p-2">
        <div className="card relative rounded-[20px] flex w-full items-center justify-between p-4 gap-2 md:gap-5">
          <ToggleVideoPublishingButton />
            <ToggleAudioPublishingButton />
            <ReactionsButton />
            <ScreenShareButton />
            <button onClick={() => setShowParticipants((prev) => !prev)}>
              <div className="flex-center cursor-pointer rounded-full bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] h-10 w-10">
                <Users size={20} className="min-h-5 min-w-5 text-white" />
              </div>
            </button>
            <CancelCallButton onLeave={() => navigate(`/meeting`)} />
          
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;