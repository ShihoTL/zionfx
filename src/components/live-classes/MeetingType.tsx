/* eslint-disable camelcase */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CirclePlus } from "lucide-react";

import MeetingModal from './MeetingModal';
import Loader from '@/components/Loader';
import { useToast } from "@/components/toast-context";
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const MeetingType = () => {
  const navigate = useNavigate();
  const dropdownRef = useOutsideClick(() => setDropdownOpen(false));
  const { addToast } = useToast();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [meetingState, setMeetingState] = useState<
    'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        navigate(`/meeting/${call.id}`);
      }
      setMeetingState(undefined)
      addToast({
        title: "Meeting Created",
        description: "Your meeting has been created successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error(error);
      addToast({
        title: "Meeting Creation Failed",
        description: "There was an error creating your meeting.",
        variant: "error",
      })
    }
  };

  if (!client || !user) return <div className="w-8 h-8"><Loader /></div>;

  const meetingLink = `${window.location.origin}/meeting/${callDetail?.id}`;
  
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <>
      {/* Custom Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 rounded-full cursor-pointer bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-600 transition"
        >
          <CirclePlus className={`h-5 w-5 transform transition-transform duration-200 ease-in-out ${
              dropdownOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
          New
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md card px-4 md:px-2 py-2 shadow-lg z-10">
            <button
              onClick={() => setMeetingState('isInstantMeeting')}
              className="flex items-center gap-2 w-full py-4 text-left text-sm hover:bg-gray-900 rounded-xl px-2"
            >
              <Video size={16} />
              Start Meeting
            </button>
            
          </div>
        )}
      </div>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </>
  );
};



function useOutsideClick(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
}

export default MeetingType;