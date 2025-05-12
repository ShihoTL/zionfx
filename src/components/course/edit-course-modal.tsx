"use client";

import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Eye, AlignLeft, PenLine, UserLock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { useUploadThing } from "@/lib/uploadthing";
import { useCourses } from "@/hooks/useCourses";

import { useToast } from "@/components/toast-context";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string; // Assuming this can be optional
  visibility: string;
}

interface FileUploadProps {
  course: Course;
  endpoint: string;
}

export const EditCourseModal = ({
  course,
  endpoint,
}: FileUploadProps) => {
  const { addToast } = useToast();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"everyone" | "private">("everyone");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "description" | "Visibility">(null);

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const { editCourse } = useCourses();
  const { startUpload: uploadThumbnail } = useUploadThing(endpoint, {
    // I want to show fine-grained upload progress
    onUploadProgress: (p) => {
      setUploadProgress(Math.round(p));
    },
    uploadProgressGranularity: "fine",
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
      setThumbnailFile(file);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let thumbnailUrl = course.thumbnail;

      if (thumbnailFile) {
        const uploadResult = await uploadThumbnail([thumbnailFile]);
        thumbnailUrl = uploadResult?.[0]?.url; // <-- just assign, no const
      }

      if (!thumbnailUrl) {
        throw new Error("Thumbnail upload failed.");
      }

      const newCourse = await editCourse(course.id, {
        title,
        description,
        thumbnail: thumbnailUrl,
        visibility,
      });

      if (!newCourse) return;

      setThumbnailFile(null);
      setPreviewUrl(null);
      setIsModalOpen(false);
      addToast({
        title: "Course Updated",
        description: "Your course has been updated successfully.",
        variant: "success",
      })
      window.location.reload();
    } catch (err) {
      console.error("Upload error:", err);
      addToast({
        title: "Upload Failed",
        description: "There was an error editing your course.",
        variant: "error",
      })
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Clean up preview blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setTitle(course.title);
    setDescription(course.description);
    setVisibility(course.visibility as "everyone" | "private");
    setPreviewUrl(course.thumbnail || null);
    setThumbnailFile(null);
  }, [course]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset'
  }, [isModalOpen]);

  const openModal = (type: "description" | "Visibility") => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {/* Trigger upload */}
      <button
        type="button"
        className="px-4 py-4 cursor-pointer flex gap-2 items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <PenLine className="h-5 w-5" /> Edit Course
      </button>
        
      <input
        type="file"
        accept="image/*"
        ref={thumbnailInputRef}
        className="hidden"
        onChange={handleThumbnailChange}
      />

      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Modal content */}
            <motion.div
              className="fixed z-[999] md:top-0 left-0 bottom-0 h-[100dvh] w-full mx-auto flex-center"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Modal overlay */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <div className="z-50 w-full sm:w-[500px] h-[100dvh] sm:h-fit sm:max-h-[80vh] overflow-y-auto bg-background p-4 pb-[4rem] rounded-t-2xl sm:rounded-2xl shadow-lg">
                <div className="relative h-full w-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center font-bold">
                      <button onClick={() => setIsModalOpen(false)}>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <p>Edit Course</p>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-2 bg-yellow-500 text-black py-2 px-4 rounded-full font-semibold disabled:opacity-70"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>

                  <div className="relative mb-4 card w-full aspect-video border border-gray-600 rounded-md overflow-hidden">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Thumbnail"
                        className="w-full object-cover"
                      />
                    )}
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="absolute top-0 left-0 w-full h-full"
                      >
                        <div className="bg-black/70 opacity-70 hover:opacity-100 w-full h-full flex flex-col gap-2 items-center justify-center">
                          <Image className="h-10 w-10 text-white" />
                          <p className="text-white">
                            {previewUrl ? "Click to Change Thumbnail" : "Upload Thumbnail"}
                          </p>
                        </div>
                      </button>
                    </div>

                  <div className="grid gap-2 mb-4">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                      }
                      className="border border-gray-600 card rounded-md p-3"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div className="grid mb-4 gap-2">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => openModal("description")}
                    >
                      <div className="flex gap-4 items-center">
                        <AlignLeft className="h-5 w-5" />
                        {description.trim() === '' ? (
                          <p>Add description</p>
                        ) : (
                          <div className="w-4/5 flex flex-col items-start">
                            <p className="text-foreground/40 text-[14px]"> Description </p>
                            <p className="text-left line-clamp-1">
                              {description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </button>
                  </div>

                  <div className="grid py-2 gap-2">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => openModal("Visibility")}
                    >
                      <div className="flex gap-4 items-center">
                        <Eye className="h-5 w-5" />
                        {visibility.trim() === '' ? (
                          <p>Edit Visibility</p>
                        ) : (
                          <div className="w-5/6 flex flex-col items-start">
                            <p className="text-foreground/40 text-[14px]"> Visibility </p>
                            <p className="text-left line-clamp-1">
                              {visibility === "everyone" ? "Everyone" : "Subscribed Students"}
                            </p>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <Modal isOpen={!!activeModal} onClose={closeModal}>
                    {activeModal === "description" && (
                      <div>
                        <div className="mb-4 font-bold text-lg flex gap-2 items-center">
                          <button onClick={closeModal}>
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <h2>Add Description</h2>
                        </div>

                        <div className="relative w-full h-40">
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="w-full h-full whitespace-pre-wrap focus:outline-none"
                            onInput={(e) => {
                              const text = (e.currentTarget as HTMLDivElement).innerText;
                              setDescription(text);
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const text = e.clipboardData.getData("text/plain");
                              document.execCommand("insertText", false, text);
                            }}
                            ref={(ref) => {
                              if (ref && !ref.innerText) {
                                ref.innerText = description;
                              }
                            }}
                          />
                          {description.trim() === '' && (
                            <p className="absolute top-0 left-0 text-gray-400 pointer-events-none select-none">
                              Write a brief description...
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeModal === "Visibility" && (
                      <div>
                        <div className="mb-4 font-bold text-lg flex gap-2 items-center">
                          <button onClick={closeModal}>
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <h2>Edit Visibility</h2>
                        </div>

                        <div className="grid gap-3">
                          <button 
                            className="w-full flex justify-between items-center"
                            onClick={() => setVisibility("everyone")}
                          >
                            <div className="flex gap-4 items-center">
                              <Eye className="h-5 w-5" />
                              <p>Everyone</p>
                            </div>

                            <div 
                              className={`h-5 w-5 rounded-full border-4 transition-all duration-300 ${
                                visibility === "everyone" ? "border-yellow-500" : "border-foreground/30"
                              }`}
                            ></div>
                          </button>

                          <button 
                            className="w-full flex justify-between items-center"
                            onClick={() => setVisibility("private")}
                          >
                            <div className="flex gap-4 items-center">
                              <UserLock className="h-5 w-5" />
                              <p>Subscribed Students</p>
                            </div>

                            <div 
                              className={`h-5 w-5 rounded-full border-4 transition-all duration-300 ${
                                visibility === "private" ? "border-yellow-500" : "border-foreground/30"
                              }`}
                            ></div>
                          </button>
                        </div>
                      </div>
                    )}
                  </Modal>
                </div>
              </div>  
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};


// components/Modal.tsx
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="absolute z-50 top-0 left-0 h-full w-full bg-background max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);