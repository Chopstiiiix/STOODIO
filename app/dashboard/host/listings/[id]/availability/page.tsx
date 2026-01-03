"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface WeeklyRule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Exception {
  id: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export default function AvailabilityPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Weekly rules state - one rule per day
  const [weeklyRules, setWeeklyRules] = useState<Record<number, WeeklyRule>>({});

  // Exceptions state
  const [exceptions, setExceptions] = useState<Exception[]>([]);

  // Exception form state
  const [newException, setNewException] = useState({
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    fetchAvailability();
  }, [listingId]);

  const fetchAvailability = async () => {
    try {
      setIsFetching(true);
      const res = await fetch(`/api/listings/${listingId}/availability`);

      if (!res.ok) {
        if (res.status === 403) {
          toast.error("You don't have permission to view this listing");
          router.push("/dashboard/host/listings");
          return;
        }
        throw new Error("Failed to fetch availability");
      }

      const data = await res.json();

      // Convert array to map by dayOfWeek
      const rulesMap: Record<number, WeeklyRule> = {};
      data.weeklyRules.forEach((rule: WeeklyRule) => {
        rulesMap[rule.dayOfWeek] = rule;
      });

      setWeeklyRules(rulesMap);
      setExceptions(data.exceptions);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load availability");
    } finally {
      setIsFetching(false);
    }
  };

  const handleRuleChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setWeeklyRules((prev) => ({
      ...prev,
      [dayOfWeek]: {
        dayOfWeek,
        startTime: field === "startTime" ? value : prev[dayOfWeek]?.startTime || "",
        endTime: field === "endTime" ? value : prev[dayOfWeek]?.endTime || "",
      },
    }));
  };

  const handleRemoveRule = (dayOfWeek: number) => {
    setWeeklyRules((prev) => {
      const updated = { ...prev };
      delete updated[dayOfWeek];
      return updated;
    });
  };

  const handleCopyToAll = (dayOfWeek: number) => {
    const rule = weeklyRules[dayOfWeek];
    if (!rule) {
      toast.error("No rule to copy");
      return;
    }

    const newRules: Record<number, WeeklyRule> = {};
    for (let i = 0; i < 7; i++) {
      newRules[i] = {
        dayOfWeek: i,
        startTime: rule.startTime,
        endTime: rule.endTime,
      };
    }
    setWeeklyRules(newRules);
    toast.success("Copied to all days");
  };

  const handleSaveWeeklyRules = async () => {
    setIsLoading(true);

    try {
      const rulesArray = Object.values(weeklyRules);

      const res = await fetch(`/api/listings/${listingId}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weeklyRules: rulesArray }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save availability");
      }

      toast.success("Weekly rules saved successfully!");
      await fetchAvailability();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save availability");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddException = async () => {
    if (!newException.startTime || !newException.endTime) {
      toast.error("Please fill in start and end times");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/listings/${listingId}/availability/exceptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newException),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add exception");
      }

      toast.success("Exception added successfully!");
      setNewException({ startTime: "", endTime: "", reason: "" });
      await fetchAvailability();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add exception");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteException = async (exceptionId: string) => {
    if (!confirm("Are you sure you want to delete this exception?")) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/listings/${listingId}/availability/exceptions/${exceptionId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete exception");
      }

      toast.success("Exception deleted successfully!");
      await fetchAvailability();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete exception");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading availability...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600 mt-1">
          Set your weekly availability and block specific times
        </p>
      </div>

      {/* Weekly Rules Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Weekly Availability</h2>
          <button
            onClick={handleSaveWeeklyRules}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Weekly Rules"}
          </button>
        </div>

        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day, index) => {
            const rule = weeklyRules[index];

            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-28 font-medium text-gray-700">{day}</div>

                {rule ? (
                  <>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) =>
                          handleRuleChange(index, "startTime", e.target.value)
                        }
                        disabled={isLoading}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) =>
                          handleRuleChange(index, "endTime", e.target.value)
                        }
                        disabled={isLoading}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => handleCopyToAll(index)}
                      disabled={isLoading}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded hover:bg-blue-50 transition disabled:opacity-70"
                    >
                      Copy to all
                    </button>
                    <button
                      onClick={() => handleRemoveRule(index)}
                      disabled={isLoading}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded hover:bg-red-50 transition disabled:opacity-70"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      setWeeklyRules((prev) => ({
                        ...prev,
                        [index]: { dayOfWeek: index, startTime: "09:00", endTime: "17:00" },
                      }))
                    }
                    disabled={isLoading}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-70"
                  >
                    + Add availability
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exceptions Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Blocked Times (Exceptions)</h2>

        {/* Add Exception Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Add New Exception
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={newException.startTime}
                onChange={(e) =>
                  setNewException((prev) => ({ ...prev, startTime: e.target.value }))
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={newException.endTime}
                onChange={(e) =>
                  setNewException((prev) => ({ ...prev, endTime: e.target.value }))
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <input
                type="text"
                value={newException.reason}
                onChange={(e) =>
                  setNewException((prev) => ({ ...prev, reason: e.target.value }))
                }
                disabled={isLoading}
                placeholder="e.g., Maintenance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddException}
            disabled={isLoading}
            className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Add Exception
          </button>
        </div>

        {/* Exceptions List */}
        {exceptions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No exceptions added yet
          </p>
        ) : (
          <div className="space-y-3">
            {exceptions.map((exception) => (
              <div
                key={exception.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-900">
                      {new Date(exception.startTime).toLocaleString()}
                    </span>
                    <span className="text-gray-500">to</span>
                    <span className="font-medium text-gray-900">
                      {new Date(exception.endTime).toLocaleString()}
                    </span>
                  </div>
                  {exception.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: {exception.reason}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteException(exception.id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded hover:bg-red-50 transition disabled:opacity-70"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/dashboard/host/listings")}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Back to Listings
        </button>
      </div>
    </div>
  );
}
