"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed z-50 top-0 left-0 h-[100dvh] w-full mx-auto flex-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            <div className="card p-6 rounded-xl shadow-lg w-full max-w-[90%] sm:max-w-[30%] z-50 bg-red-500">
              <div className="flex flex-col gap-6">
                {image && (
                  <div className="flex justify-center">
                    <img src={image} alt="checked" width={72} height={72} />
                  </div>
                )}
                <h1 className={cn("text-2xl font-bold leading-[42px]", className)}>
                  {title}
                </h1>
                {children}
                <button
                  className={
                    "bg-yellow-500 hover:bg-yellow-600 cursor-pointer py-3 rounded-full flex items-center justify-center gap-2 font-bold text-black"
                  }
                  onClick={handleClick}
                >
                  {buttonIcon && (
                    <img
                      src={buttonIcon}
                      alt="button icon"
                      width={13}
                      height={13}
                    />
                  )}{" "}
                  &nbsp;
                  {buttonText || "Schedule Meeting"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MeetingModal;