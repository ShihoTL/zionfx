import React, { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  Home,
  Signal,
  Crown,
  Menu,
  LogOut,
  Moon,
  Sun,
  Book,
  LibraryBig
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";

// Define interfaces for types
interface Route {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface SidebarProps {
  onNavigate?: () => void;
}

interface User {
  role: string;
}

// Define routes
const baseRoutes: Route[] = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Courses", icon: LibraryBig, href: "/courses" },
  { label: "Signals", icon: Signal, href: "/signals" },
  { label: "Fx Journal", icon: Book, href: "/fx-journal"},
  { label: "Subscriptions", icon: Crown, href: "/subscriptions" },
  { label: "Logout", icon: LogOut, href: "#" },
];

const adminRoutes: Route[] = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Courses", icon: LibraryBig, href: "/courses" },
  { label: "Live Classes", icon: Crown, href: "/meeting" },
  { label: "Fx Journal", icon: Book, href: "/fx-journal"},
  { label: "Logout", icon: LogOut, href: "#" },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const user = useSelector((state: RootState) => state.user) as User | null;
  const { signOut } = useClerk();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [routes, setRoutes] = useState<Route[]>(baseRoutes);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<"logout" | "course" | null>(null);

  useEffect(() => {
    if (user) {
      setRoutes(user.role === "admin" ? adminRoutes : baseRoutes);
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "auto";
  }, [activeModal]);
  
  const openModal = (type: "logout" | "course") => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLinkClick = (route: string) => {
    if (route === "#") {
      openModal("logout");
    } else {
      setIsMobileOpen(false);
      onNavigate?.();
    }
  };

  const SidebarContent = (
    <div className="h-full flex flex-col px-2 py-4 space-y-4">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/dashboard" onClick={() => handleLinkClick("/dashboard")}>
          <div className="flex items-center pl-3">
            <h1 className="text-2xl font-bold">ZionFX</h1>
            <div className="text-yellow-500 bg-yellow-100/50 dark:bg-yellow-900/20 ml-1 px-2 rounded-lg text-sm">
              Free
            </div>
          </div>
        </Link>

        {/* Theme Toggle */}
        <div className="mb-2 mr-2 flex justify-between items-center">
          <button
            className="w-full flex gap-2 items-center"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </button>
        </div>

      </div>
      <nav className="flex flex-col space-y-1">
        {routes.map((route, i) => (
          route.href === "#" ? (
            <button
              key={i}
              onClick={() => handleLinkClick(route.href)}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-yellow-500 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20 rounded-lg transition text-left",
                pathname === route.href
                  ? "text-yellow-500 bg-yellow-100/50 dark:bg-yellow-900/20"
                  : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    pathname === route.href ? "text-yellow-500" : "text-zinc-500"
                  )}
                />
                {route.label}
              </div>
            </button>
          ) : (
            <Link
              key={i}
              to={route.href}
              onClick={() => handleLinkClick(route.href)}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-yellow-500 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20 rounded-lg transition",
                pathname === route.href
                  ? "text-yellow-500 bg-yellow-100/50 dark:bg-yellow-900/20"
                  : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    pathname === route.href ? "text-yellow-500" : "text-zinc-500"
                  )}
                />
                {route.label}
              </div>
            </Link>
          )
        ))}
      </nav>
    </div>
  );

  return (
    <div className="relative w-fit">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background shadow px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">ZionFX</h1>
        <button 
          onClick={() => {
            setIsMobileOpen(!isMobileOpen)
          }}
        >
          <Menu className="h-8 w-8" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 w-64 h-full z-50 bg-background p-4 px-2 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="relative">
                {SidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 card shadow-md z-30">
        <div className="relative">
          {SidebarContent}
        </div>
      </div>

      <Modal isOpen={!!activeModal} onClose={closeModal}>
        {activeModal === "logout" && (
          <div className="card p-6 rounded-xl shadow-lg w-full max-w-[90%] lg:max-w-[20%]">
            <h2 className="font-bold text-lg text-center mb-2">
              Logout Confirmation
            </h2>
            <div className="flex flex-col justify-center items-center gap-2 py-4">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={() => {
                  signOut(() => navigate("/"));
                }}
                className="w-full px-4 py-2 bg-red-400 rounded-full hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 rounded-full text-white bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

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
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed z-50 top-0 left-0 h-[100dvh] w-full mx-auto flex-center"
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