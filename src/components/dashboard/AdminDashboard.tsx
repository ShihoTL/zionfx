"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Video,
  Users,
  DollarSign,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
  X,
} from "lucide-react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BarChart from "@/components/BarChart";


import UserTable from "@/components/dashboard/UserTable";

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  profile_picture: string;
  role?: string;
  subscriptions?: {
    mentorship?: {
      plan: string;
      start_date: string;
      end_date: string;
      status: string | null;
    };
    signals?: {
      plan: string;
      start_date: string;
      end_date: string;
      status: string | null;
    }
  };
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

// Delete Confirmation Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, userName }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="card rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold">Delete User Account</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <span className="font-bold">{userName}</span>'s account? This action cannot be undone and all user data will be permanently lost.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const tabsContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const user = useSelector((state: RootState) => state.user);

  // State for user counts and subscription stats
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalActiveSubscriptions, setTotalActiveSubscriptions] = useState(0);

  // State for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get courses from the Redux store (same approach as StudentDashboard)
  const coursesInStore = useSelector((state: RootState) => state.courses);
  const totalCoursesCount = coursesInStore.courses.length;

  // Tabs definition
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "payments", label: "Payments" },
  ];

  const revenueData = [
    { day: "Mon", revenue: 420 },
    { day: "Tue", revenue: 380 },
    { day: "Wed", revenue: 500 },
    { day: "Thu", revenue: 450 },
    { day: "Fri", revenue: 620 },
    { day: "Sat", revenue: 700 },
    { day: "Sun", revenue: 390 },
  ];

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || "No email",
          full_name: data.full_name || "No name",
          created_at: data.created_at,
          profile_picture: data.profile_picture || "/images/thumbnail.png",
          role: data.role || "student", // Default to student if role not specified
          subscriptions: data.subscriptions || {},
        };
      });

      setUsers(userList);

      // Calculate statistics
      const students = userList.filter(user => user.role === "student");
      setTotalStudents(students.length);

      const activeSubscriptions = userList.filter(user => 
        (user.subscriptions?.mentorship?.status === "active") || 
        (user.subscriptions?.signals?.status === "active")
      );
      setTotalActiveSubscriptions(activeSubscriptions.length);

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete user
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      // Delete user from Firestore
      await deleteDoc(doc(db, "users", userToDelete.id));

      // Update the users state to remove the deleted user
      setUsers(users.filter(u => u.id !== userToDelete.id));

      // Recalculate statistics
      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      const students = updatedUsers.filter(user => user.role === "student");
      setTotalStudents(students.length);

      const activeSubscriptions = updatedUsers.filter(user => 
        (user.subscriptions?.mentorship?.status === "active") || 
        (user.subscriptions?.signals?.status === "active")
      );
      setTotalActiveSubscriptions(activeSubscriptions.length);

      // Close the modal
      setDeleteModalOpen(false);
      setUserToDelete(null);

      // Show success notification (you could implement a toast notification system here)
      console.log(`User ${userToDelete.full_name} successfully deleted`);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Show error notification
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const subscribedUsers = currentUsers.filter(
    user =>
      (user.subscriptions?.mentorship?.status === "active") ||
      (user.subscriptions?.signals?.status === "active")
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current as HTMLElement;
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "No date";

    // Handle both Firestore Timestamp and Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "MMM dd, yyyy");
  };

  return (
    <div className="h-full p-4 space-y-3">
      <div className="flex items-center justify-between md:mt-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Hello, {user?.username?.charAt(0).toUpperCase() +
            user.username.slice(1)}</h2>
          <p className="text-sm">
            Manage the ZionFX platform
          </p>
        </div>
      </div>

      {/* Custom Tabs with Horizontal Scrolling */}
        <div
          ref={tabsContainerRef}
          className="flex py-2 rounded-lg shadow-sm overflow-x-auto no-scrollbar lg:justify-center lg:px-0 lg:max-w-[23vw] lg:mx-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-[22.5px] py-2 mx-1 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none",
              activeTab === tab.id
                ? "bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-500"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:flex lg:flex-col">
              <div className="flex items-center space-x-1 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg p-3 text-white w-[40vw] lg:max-w-[12vw]">
                <Users className="h-5 w-5 text-foreground" />
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm text-yellow-500 font-bold">
                    {loading ? "Loading..." : `${totalStudents} Students`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg p-3 text-white w-[46vw] lg:w-[15vw]">
                <UserPlus className="h-5 w-5 text-foreground" />
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm text-yellow-500 font-bold">
                    {loading ? "Loading..." : `${totalActiveSubscriptions} Subscriptions`}
                  </p>
                </div>
              </div>
              <div className="p-4 card border border-yellow-500 rounded-lg lg:w-[20vw]">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Uploaded Courses</h3>
                  <Video className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold mt-2">{totalCoursesCount}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg card shadow-lg">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Revenue Overview</h2>
                  <p className="text-sm text-muted-foreground">
                    Weekly incoming revenue
                  </p>
                </div>
                <div className="lg:h-80 rounded-md p-2">
                  <BarChart data={revenueData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab - Updated to fetch from Firestore */}
        {activeTab === "users" && (
          <UserTable
            users={currentUsers}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDelete={handleDeleteClick}
            currentPage={currentPage}
            activeTab="users"
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            deleteLoading={deleteLoading}
          />
        )}

        {/* Payments Tab - Keeping original content */}
        {activeTab === "payments" && (
          <UserTable
            users={subscribedUsers}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDelete={handleDeleteClick}
            currentPage={currentPage}
            activeTab="payments"
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            deleteLoading={deleteLoading}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.full_name || ""}
      />
    </div>
  );
};

export default AdminDashboard;