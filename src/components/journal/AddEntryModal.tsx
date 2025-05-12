import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, AlignLeft } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

import { useJournal } from "@/hooks/useJournal";
import { useToast } from "@/components/toast-context";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser()
  
  const [activeModal, setActiveModal] = useState<null | "strategy" | "Visibility">(null);
  const [formData, setFormData] = useState({
    symbol: '',
    tradeDate: new Date().toISOString().split('T')[0],
    direction: 'LONG',
    entryPrice: 0,
    exitPrice: 0,
    strategy: '',
    notes: ''
  });

  const { createEntry } = useJournal();
  const { addToast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryPayload = {
      userId: user?.id,
      symbol: formData.symbol,
      tradeDate: formData.tradeDate,
      direction: formData.direction as "LONG" | "SHORT",
      entryPrice: formData.entryPrice,
      exitPrice: formData.exitPrice,
      strategy: formData.strategy,
      notes: formData.notes,
    };

    const newEntry = await createEntry(entryPayload);

    if (newEntry) {
      setFormData({
        symbol: '',
        tradeDate: new Date().toISOString().split('T')[0],
        direction: 'LONG',
        entryPrice: 0,
        exitPrice: 0,
        strategy: '',
        notes: ''
      });
      addToast({
        title: "Trade Entry Created",
        description: "Your trade entry has been created successfully.",
        variant: "success",
      })
      onClose();
    } else {
      console.error("Failed to create journal entry.");
      addToast({
        title: "Failed to Create Entry",
        description: "There was an error creating your trade entry.",
        variant: "error",
      })
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (type: "strategy" | "Visibility") => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed z-[99] md:top-0 left-0 bottom-0 h-[100dvh] w-full mx-auto flex items-center justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="z-50 w-full sm:w-[500px] h-[100dvh] sm:h-fit sm:max-h-[80vh] bg-background rounded-t-2xl sm:rounded-2xl shadow-lg flex flex-col relative">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add Trade Entry</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 flex-col w-full">
                  <div className="grid gap-2 mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Symbol
                    </label>
                    <input
                      type="text"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      placeholder="EUR/USD"
                      className="border border-gray-600 card rounded-md p-3"
                      required
                    />
                  </div>

                  <div className="grid gap-2 mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Trade Date
                    </label>
                    <input
                      type="date"
                      name="tradeDate"
                      value={formData.tradeDate}
                      onChange={handleChange}
                      className="min-w-full border border-gray-600 card rounded-md p-3"
                      required
                    />
                  </div>

                  <div className="grid gap-2 mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Direction
                    </label>
                    <select
                      name="direction"
                      value={formData.direction}
                      onChange={handleChange}
                      className="border border-gray-600 card rounded-md p-3"
                      required
                    >
                      <option value="LONG">LONG</option>
                      <option value="SHORT">SHORT</option>
                    </select>
                  </div>

                  <div className="flex w-full justify-between items-center gap-4 mb-4">
                    <div className="flex-1 gap-2">
                      <label className="block text-sm font-medium mb-1">
                        Entry Price
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        name="entryPrice"
                        value={formData.entryPrice}
                        onChange={handleChange}
                        placeholder="1.0845"
                        className="w-full border border-gray-600 card rounded-md p-3"
                        required
                      />
                    </div>

                    <div className="flex-1 gap-2">
                      <label className="block text-sm font-medium mb-1">
                        Exit Price
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        name="exitPrice"
                        value={formData.exitPrice}
                        onChange={handleChange}
                        placeholder="1.0923"
                        className="w-full border border-gray-600 card rounded-md p-3"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid py-4 gap-2">
                    <button
                      className="w-full flex justify-between items-center"
                      onClick={() => openModal("strategy")}
                    >
                      <div className="flex gap-4 items-center">
                        <AlignLeft className="h-5 w-5" />
                        {formData.strategy.trim() === '' ? (
                          <p>Add Strategy</p>
                        ) : (
                          <div className="w-4/5 flex flex-col items-start">
                            <p className="text-foreground/40 text-[14px]"> Strategy </p>
                            <p className="text-left line-clamp-1">
                              {formData.strategy}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </button>
                  </div>

                  <Modal isOpen={!!activeModal} onClose={closeModal}>
                    {activeModal === "strategy" && (
                      <div className="px-4">
                        <div className="mb-4 font-bold text-lg flex gap-2 items-center">
                          <button onClick={closeModal}>
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <h2>Add Strategy</h2>
                        </div>

                        <div className="grid gap-2 mb-4">
                          <input
                            type="text"
                            name="strategy"
                            value={formData.strategy}
                            onChange={handleChange}
                            placeholder="What strategy did you use?"
                            className="border-0 border-b border-gray-600 bg-transparent focus:outline-0 p-3"
                            required
                          />
                        </div>

                        <div className="grid gap-2 mb-4">
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Enter trade notes..."
                            className="w-full h-[20rem] px-3 py-2 card border border-gray-600 rounded-md focus:outline-none focus:ring-0 h-24"
                          />
                        </div>
                      </div>
                    )}
                  </Modal>
                </form>
              </div>

              {/* Submit Button at Bottom of Modal */}
              <div className="sticky bottom-0 bg-background p-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-primary/90"
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

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

export default AddEntryModal;