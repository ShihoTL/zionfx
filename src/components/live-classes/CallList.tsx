'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '@/components/Loader';
import MeetingCard from './MeetingCard';
import { useGetCalls } from '@/hooks/useGetCalls';

const CallList = ({ type }: { type: 'ended' | 'recordings' | 'ongoing' }) => {
  const navigate = useNavigate();
  const {
    endedCalls = [],
    ongoingCalls = [],
    callRecordings = [],
    isLoading,
  } = useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        if (!Array.isArray(callRecordings) || callRecordings.length === 0) return;

        const results = await Promise.allSettled(
          callRecordings
            .filter(
              (meeting) =>
                typeof meeting?.queryRecordings === 'function' &&
                meeting?.type !== 'audio_room'
            )
            .map((meeting) => meeting.queryRecordings())
        );

        const recs = results
          .filter(res => res.status === 'fulfilled' && res.value?.recordings?.length > 0)
          .flatMap((res: any) => res.value.recordings);

        setRecordings(recs);
        setHasFetched(true);
      } catch (err) {
        console.error('Error fetching recordings:', err);
      }
    };

    if (type === 'recordings' && !hasFetched) {
      fetchRecordings();
    }
  }, [type, callRecordings, hasFetched]);

  const getCalls = (): (Call | CallRecording)[] => {
    const excludeAudio = (call: Call) => call?.type !== 'audio_room';

    switch (type) {
      case 'ended':
        return endedCalls.filter(excludeAudio);
      case 'recordings':
        return recordings;
      case 'ongoing':
        return ongoingCalls
          .filter(excludeAudio)
          .filter(call => {
            const endsAt = call?.state?.endsAt;
            return !(endsAt && new Date(endsAt) <= new Date());
          });
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    const messages = {
      ended: {
        title: 'No Previous Sessions',
        subtext: 'You haven’t joined any sessions yet. Once you do, they’ll appear here.',
      },
      recordings: {
        title: 'No Recorded Sessions',
        subtext: 'Your session recordings will appear here after they’re processed.',
      },
      ongoing: {
        title: 'No Ongoing Sessions',
        subtext: 'When a session starts, it’ll show up here so you can join easily.',
      },
    };

    return messages[type] ?? {
      title: 'No Sessions',
      subtext: 'Nothing to show at the moment.',
    };
  };

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const { title, subtext } = getNoCallsMessage();

  if (!calls || calls.length === 0) {
    return (
      <div className="h-full w-full flex-col flex-center text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500">{subtext}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 text-center min-w-full h-full">
      {calls.map((meeting) => (
        <MeetingCard
          key={
            (meeting as Call)?.id || (meeting as CallRecording)?.url || Math.random()
          }
          icon={
            type === 'ended'
              ? '/icons/previous.svg'
              : type === 'recordings'
              ? '/icons/recordings.svg'
              : '/icons/ongoing.svg'
          }
          title={
            (meeting as Call)?.state?.custom?.description ||
            (meeting as CallRecording)?.filename?.substring(0, 20) ||
            'No Description'
          }
          date={
            (meeting as Call)?.state?.startsAt?.toLocaleString?.() ||
            (meeting as CallRecording)?.start_time?.toLocaleString?.()
          }
          isPreviousMeeting={type === 'ended'}
          link={
            type === 'recordings'
              ? (meeting as CallRecording)?.url
              : `${import.meta.env.VITE_BASE_URL}/meeting/${(meeting as Call)?.id}`
          }
          buttonIcon1={
            type === 'recordings'
              ? '/icons/play.svg'
              : type === 'ongoing'
              ? '/icons/join.svg'
              : undefined
          }
          buttonText={
            type === 'recordings'
              ? 'Play'
              : type === 'ongoing'
              ? 'Join'
              : 'Start'
          }
          handleClick={
            type === 'recordings'
              ? () => {
                  const encodedUrl = encodeURIComponent((meeting as CallRecording).url);
                  navigate(`/meeting/recording-player/${encodedUrl}`);
                }
              : () => navigate(`/meeting/${(meeting as Call).id}`)
          }
        />
      ))}
    </div>
  );
};

export default CallList;