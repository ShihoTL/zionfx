'use client';

import { useState } from 'react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  MicOff,
  VideoOff,
  X,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useToast } from "@/components/toast-context";

const MeetingControls = () => {
  const call = useCall();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [showMenu, setShowMenu] = useState(false);

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  // Share meeting action (available to everyone)
  const shareMeeting = async () => {
    try {
      const baseUrl = window.location.origin;
      const meetingLink = `${baseUrl}/meeting/${call.id}`;

      await navigator.share({
        title: 'Join My Meeting',
        text: 'Join this meeting using the link below:',
        url: meetingLink,
      });

      addToast({
        title: "Meeting Shared",
        description: "Meeting link has been shared successfully.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Sharing Failed",
        description: "Could not share the meeting link. Copy the link manually.",
        variant: "error",
      });
    }
  };

  // Admin-only actions
  const endCall = async () => {
    await call.endCall();
    navigate('/meeting');
    addToast({
      title: "Meeting Ended",
      description: "The meeting has been ended successfully.",
      variant: "success",
    });
  };

  const muteAllAudio = async () => {
    await call.muteOthers('audio');
    setShowMenu(false);
    addToast({
      title: "Muted All Audio",
      description: "All participants' audio has been muted.",
      variant: "success",
    });
  };

  const muteAllVideo = async () => {
    await call.muteOthers('video');
    setShowMenu(false);
    addToast({
      title: "Muted All Video",
      description: "All participants' video has been muted.",
      variant: "success",
    });
  };

  // Menu item component for reusability
  const MenuItem = ({ onClick, icon: Icon, label, danger = false }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full text-left px-4 py-3 hover:bg-[#334155] transition-colors ${
        danger ? 'text-red-400' : 'text-white'
      }`}
    >
      <Icon className="mr-2 h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
      {/* Share Meeting Button (visible to everyone) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={shareMeeting}
        className="p-2 rounded-full bg-[#19232d] hover:bg-[#4c535b] shadow-lg transition-colors"
        title="Share Meeting"
      >
        <Share2 className="text-white h-5 w-5" />
      </motion.button>

      {/* Admin Controls Menu (visible only to meeting owner) */}
      {isMeetingOwner && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-2 rounded-full bg-[#19232d] hover:bg-[#4c535b] shadow-lg transition-colors"
          >
            {showMenu ? (
              <X className="text-white h-5 w-5" />
            ) : (
              <MoreVertical className="text-white h-5 w-5" />
            )}
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-[#1e293b] rounded-lg shadow-xl text-sm w-56 absolute right-0 top-12 z-30 border border-[#334155]"
              >
                <div className="p-2">
                  <MenuItem
                    onClick={muteAllAudio}
                    icon={MicOff}
                    label="Mute All Audio"
                  />
                  <MenuItem
                    onClick={muteAllVideo}
                    icon={VideoOff}
                    label="Mute All Video"
                  />
                  <MenuItem
                    onClick={endCall}
                    icon={X}
                    label="End Call for Everyone"
                    danger
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default MeetingControls;