"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "@uploadthing/react";
import { ListPlus, AlignLeft, Plus, Pencil, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import { useUploadThing } from "@/lib/uploadthing";
import { getVideoDuration } from "@/lib/utils";
import { useCreateVideo } from "@/hooks/useCreateVideo";

import { useToast } from "@/components/toast-context";

interface Video {
  id?: string;
  title: string;
  description: string;
  thumbnail?: string; // Assuming this can be optional
  courseId: string;
  duration?: number;
  created_at?: string;
}

interface FileUploadProps {
  onChange: (video: Video) => void;
  endpoint: string;
  courseId?: string;
}

export const VideoUploadModal = ({
  onChange,
  endpoint,
  courseId,
}: FileUploadProps) => {
  const { addToast } = useToast();
  
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "description" | "course">(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const { createVideo } = useCreateVideo();
  const { startUpload: uploadVideo, routeConfig } = useUploadThing(endpoint, {
    // I want to show fine-grained upload progress
    onUploadProgress: (p) => {
      setUploadProgress(Math.round(p));
    },
    uploadProgressGranularity: "fine",
  });

  const { startUpload: uploadThumbnail } = useUploadThing("videoThumbnail");

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFiles(acceptedFiles);
    setIsModalOpen(true);
    const fileURL = URL.createObjectURL(file);

    if (file.type.startsWith("video/")) {
      // I generate a thumbnail from the video at 1 second mark
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = fileURL;

      video.addEventListener("loadedmetadata", () => {
        video.currentTime = Math.min(1, video.duration);
      });

      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/png");
          setPreviewUrl(thumbnailUrl);
        }

        URL.revokeObjectURL(fileURL);
      });
    } else if (file.type.startsWith("image/")) {
      setPreviewUrl(fileURL);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const { getInputProps } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
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
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadResult = await uploadVideo(files);
      const videoUrl = uploadResult?.[0]?.url;

      if (!videoUrl) throw new Error("Video upload failed.");

      let thumbnailUrl = previewUrl;

      if (thumbnailFile) {
        try {
          const thumbRes = await uploadThumbnail([thumbnailFile]);
          if (thumbRes?.[0]?.url) {
            thumbnailUrl = thumbRes[0].url;
          }
        } catch (err) {
          console.error("Thumbnail upload failed", err);
          addToast({
            title: "Thumbnail upload failed",
            description: "Failed to upload thumbnail. Please try again.",
            variant: "error",
          })
        }
      }

      let duration = 0;
      try {
        duration = await getVideoDuration(videoUrl);
      } catch (err) {
        console.error("Failed to get video duration", err);
      }

      const newVideo = await createVideo({
        videoUrl,
        title,
        description,
        courseId: courseId ?? "",
        thumbnail: thumbnailUrl,
        duration,
      });

      if (!newVideo) return;

      onChange(newVideo);
      setFiles([]);
      setThumbnailFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setIsUploading(false);
      setUploadProgress(0);
      setIsModalOpen(false);
      addToast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully.",
        variant: "success",
      })
    } catch (err) {
      console.error("Upload error:", err);
      addToast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
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
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset'
  }, [isModalOpen]);
  
  const openModal = (type: "description" | "course") => {
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
        className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 font-bold rounded-full"
        onClick={() => inputRef.current?.click()}
      >
        <Plus className="h-5 w-5 fill-black" /> Add Video
      </button>

      <input 
        {...getInputProps()} 
        ref={inputRef} 
        className="hidden" 
        accept="video/*"
      />
      
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
            {/* Modal overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="fixed z-50 md:top-0 left-0 bottom-0 h-[100dvh] w-full mx-auto flex-center"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="w-full sm:w-[500px] h-[100dvh] md:max-h-[90vh] overflow-y-auto bg-background p-4 pb-[4rem] rounded-t-2xl sm:rounded-2xl shadow-lg">
                <div className="relative h-full w-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center font-bold">
                      <button onClick={() => setIsModalOpen(false)}>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <p>Add details</p>
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
                          uploading...
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>

                  {previewUrl && (
                    <div className="relative mb-4 w-full aspect-video border border-gray-600 rounded-md overflow-hidden">
                      {isUploading && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black/40">
                          <div
                            className="bg-black/60 h-full transition-all duration-300 ease-in-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                            <Loader2 className="animate-spin h-4 w-4" />
                            <p className="">
                              Uploading: {uploadProgress}%
                            </p>
                          </div>
                        </div>
                      )}
                      <img
                        src={previewUrl}
                        alt="Thumbnail"
                        className="w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="absolute top-2 left-2 bg-background/50 p-2 rounded-full"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  <div className="grid gap-2 mb-4">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                      }
                      className="border border-gray-600 card rounded-md p-3"
                      placeholder="Enter video title"
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
                      onClick={() => openModal("course")}
                    >
                      <div className="flex gap-4 items-center">
                        <ListPlus className="h-5 w-5" />
                        <p>Add to course</p>
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

                    {activeModal === "course" && (
                      <div>
                        <h2 className="font-bold text-lg mb-2">Assign Course</h2>
                        <input
                          type="text"
                          value={courseId}
                          onChange={(e) => courseId && setCourseId(e.target.value)}
                          className="w-full border px-3 py-2 rounded"
                          placeholder="Enter Course ID"
                        />
                        <button
                          onClick={closeModal}
                          className="mt-4 w-full bg-yellow-500 text-black py-2 rounded font-bold"
                        >
                          Save
                        </button>
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