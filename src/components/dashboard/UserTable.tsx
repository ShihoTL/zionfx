import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  profile_picture: string;
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
    };
  };
};

type UserTableProps = {
  users: User[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDelete: (user: User) => void;
  currentPage: number;
  activeTab: "users" | "payments";
  totalPages: number;
  setCurrentPage: (page: number) => void;
  deleteLoading: boolean;
};

const getActiveSubscription = (user: User): string => {
  const mentorship = user.subscriptions?.mentorship;
  if (!mentorship) return "None";

  return mentorship.plan === "one-on-one_mentorship"
    ? "Personal"
    : mentorship.plan === "grouped_mentorship"
    ? "Grouped"
    : mentorship.plan;
};


const SubscriptionBadge = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
      <span className="w-1.5 h-1.5 mr-1 rounded-full bg-yellow-500"></span>
      {label}
    </span>
  );
};


const SignalStatusBadge = ({ active }: { active: boolean }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active
          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 mr-1 rounded-full ${
          active ? "bg-green-500" : "bg-gray-400"
        }`}
      ></span>
      {active ? "Yes" : "No"}
    </span>
  );
};

export default function UserTable({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onDelete,
  currentPage,
  activeTab,
  totalPages,
  setCurrentPage,
  deleteLoading,
}: UserTableProps) {
  const showActions = activeTab === "users";
  const showSubscription = activeTab === "payments";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold">
          {activeTab === "payments" ? "Payments" : "Platform Users"}
        </h3>
        <div className="flex items-center w-full sm:w-auto gap-2">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute w-4 h-4 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-8 py-3 border border-yellow-800/60 rounded-xl card text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="card rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/20">
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">
                  {showSubscription ? "Subscription" : "Joined"}
                </th>
                {showActions && (
                  <th className="text-center py-3 px-4 text-xs uppercase tracking-wider">
                    Actions
                  </th>
                )}
                {showSubscription && (
                  <>
                    <th className="text-center py-3 px-4 text-xs uppercase tracking-wider">
                      Active
                    </th>
                    <th className="text-center py-3 px-4 text-xs uppercase tracking-wider">
                      Signal
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={showActions ? 4 : 3}
                    className="py-20 text-center"
                  >
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading {activeTab}...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={showActions ? 4 : 3}
                    className="py-20 text-center"
                  >
                    <p className="text-muted-foreground">
                      No {activeTab} found
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/20 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profile_picture}
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/images/thumbnail.png")
                          }
                          alt={user.full_name}
                          className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                        />
                        <span className="text-sm font-medium">
                          {user.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4 text-sm">
                      {showSubscription ? (
                        <SubscriptionBadge
                          label={getActiveSubscription(user)}
                        />
                      ) : (
                        user.created_at
                      )}
                    </td>
                    {showSubscription && (
                      <>
                        <td className="py-3 px-4 text-center text-sm">
                          <SignalStatusBadge
                            active={
                              user.subscriptions?.mentorship?.status ===
                              "active"
                            }
                          />
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          <SignalStatusBadge
                            active={
                              user.subscriptions?.signals?.status === "active"
                            }
                          />
                        </td>
                      </>
                    )}
                    {showActions && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDelete(user)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Delete User"
                          disabled={deleteLoading}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft
                className={`h-5 w-5 ${
                  currentPage === 1
                    ? "text-gray-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === pageNum
                      ? "bg-yellow-500 text-white font-medium"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-muted-foreground">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-800 ${
                    currentPage === totalPages &&
                    "bg-yellow-500 text-white font-medium"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight
                className={`h-5 w-5 ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
