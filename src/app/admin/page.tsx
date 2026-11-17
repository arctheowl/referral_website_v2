"use client";

import { useEffect, useRef, useState } from "react";
import { 
  UsersIcon,
  DocumentTextIcon, 
  UserGroupIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { 
  getEligibilityChecks,
  getNewsletterEntries,
  getTotalUniqueUsers,
  getSelectionSummary,
  getCountdownTimer,
  updateCountdownEndTime,
  runSelectionNow
} from "../actions";

interface EligibilityCheckEntry {
  id: number;
  session_id: string;
  parent_name: string;
  primary_email: string;
  phone_number: string | null;
  secondary_phone: string | null;
  secondary_email: string | null;
  diagnosis: string;
  school_year: string;
  catchment_town: string;
  can_attend_hospital: boolean;
  eligible: boolean;
  selection_status: boolean | null;
  submitted_at: string;
  queue_position: number | null;
  session_status: "waiting" | "selected" | "rejected" | "completed" | null;
  joined_at: string | null;
}

interface NewsletterEntry {
  id: number;
  name: string;
  email: string;
  created_at?: string | null;
  added_at?: string | null;
}

interface CountdownTimerRow {
  id: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  selection_status: string | null;
  selected_at: string | null;
  updated_at?: string | null;
}

export default function AdminDashboard() {
  const USERS_PER_PAGE = 50;
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityCheckEntry[]>([]);
  const [newsletterEntries, setNewsletterEntries] = useState<NewsletterEntry[]>([]);
  const [totalUniqueUsers, setTotalUniqueUsers] = useState<number>(0);
  const [selectionSummary, setSelectionSummary] = useState<{
    selectionCompletedAt: string | null;
    selectedCount: number;
    rejectedCount: number;
    pendingCount: number;
    maxUsers: number;
    currentUsers: number;
  } | null>(null);
  const [countdownTimer, setCountdownTimer] = useState<CountdownTimerRow | null>(null);
  const [endTimeInput, setEndTimeInput] = useState("");
  const [savingEndTime, setSavingEndTime] = useState(false);
  const [runningSelectionNow, setRunningSelectionNow] = useState(false);
  const [sortBy, setSortBy] = useState<"submitted" | "eligible" | "selection_status">("submitted");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshingEligibility, setRefreshingEligibility] = useState(false);
  const [refreshingNewsletter, setRefreshingNewsletter] = useState(false);
  const [autoRunMessage, setAutoRunMessage] = useState<string>("");
  const autoTriggeredKeyRef = useRef<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checks, newsletter, uniqueUsers, selection, timer] = await Promise.all([
          getEligibilityChecks(),
          getNewsletterEntries(),
          getTotalUniqueUsers(),
          getSelectionSummary(),
          getCountdownTimer()
        ]);

        setEligibilityChecks(checks as EligibilityCheckEntry[]);
        setNewsletterEntries(newsletter as NewsletterEntry[]);
        setTotalUniqueUsers(uniqueUsers);
        setSelectionSummary(selection);
        setCountdownTimer(timer as CountdownTimerRow | null);
        if (timer?.end_time) {
          const d = new Date(timer.end_time);
          const localIsoMinute = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setEndTimeInput(localIsoMinute);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshAdminData = async () => {
    const [checks, newsletter, uniqueUsers, selection, timer] = await Promise.all([
      getEligibilityChecks(),
      getNewsletterEntries(),
      getTotalUniqueUsers(),
      getSelectionSummary(),
      getCountdownTimer()
    ]);
    setEligibilityChecks(checks as EligibilityCheckEntry[]);
    setNewsletterEntries(newsletter as NewsletterEntry[]);
    setTotalUniqueUsers(uniqueUsers);
    setSelectionSummary(selection);
    setCountdownTimer(timer as CountdownTimerRow | null);
  };

  const refreshEligibilityChecks = async () => {
    setRefreshingEligibility(true);
    try {
      const checks = await getEligibilityChecks();
      setEligibilityChecks(checks as EligibilityCheckEntry[]);
    } catch (error) {
      console.error("Error refreshing eligibility checks:", error);
    } finally {
      setRefreshingEligibility(false);
    }
  };

  const refreshNewsletterEntries = async () => {
    setRefreshingNewsletter(true);
    try {
      const newsletter = await getNewsletterEntries();
      setNewsletterEntries(newsletter as NewsletterEntry[]);
    } catch (error) {
      console.error("Error refreshing newsletter entries:", error);
    } finally {
      setRefreshingNewsletter(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleString("en-GB", {
      timeZone: "Europe/London",
      timeZoneName: "short",
    });
  };

  const selectionRank = (value: boolean | null) => {
    if (value === true) return 2;
    if (value === false) return 1;
    return 0;
  };

  const sortedEligibilityChecks = [...eligibilityChecks].sort((a, b) => {
    let compare = 0;

    if (sortBy === "eligible") {
      compare = Number(a.eligible) - Number(b.eligible);
    } else if (sortBy === "selection_status") {
      compare = selectionRank(a.selection_status) - selectionRank(b.selection_status);
    } else {
      const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
      const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
      compare = aTime - bTime;
    }

    return sortDirection === "asc" ? compare : -compare;
  });

  const totalPages = Math.max(1, Math.ceil(sortedEligibilityChecks.length / USERS_PER_PAGE));
  const pagedEligibilityChecks = sortedEligibilityChecks.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const toCsvValue = (value: string | number | boolean | null | undefined) => {
    const text = value === null || value === undefined ? "" : String(value);
    const escaped = text.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const getSelectionStatusLabel = (value: boolean | string | null | undefined) => {
    if (value === null || value === undefined) return "";
    const normalized = String(value).trim().toLowerCase();
    if (["true", "t", "1", "yes", "selected"].includes(normalized)) return "Selected";
    if (["false", "f", "0", "no", "rejected", "not_selected", "not selected"].includes(normalized)) return "Not Selected";
    return "";
  };

  const downloadEligibilityCsv = () => {
    const headers = [
      "Parent Name",
      "Email",
      "Secondary Email",
      "Phone",
      "Secondary Phone",
      "Eligible",
      "Selection Status",
      "Submitted",
    ];

    const rows = sortedEligibilityChecks.map((entry) => [
      entry.parent_name,
      entry.primary_email,
      entry.secondary_email ?? "",
      entry.phone_number ?? "",
      entry.secondary_phone ?? "",
      entry.eligible ? "Yes" : "No",
      getSelectionStatusLabel(entry.selection_status as boolean | string | null),
      entry.submitted_at ?? "",
    ]);

    const csvLines = [
      headers.map((h) => toCsvValue(h)).join(","),
      ...rows.map((row) => row.map((cell) => toCsvValue(cell)).join(",")),
    ];

    const csvContent = "\uFEFF" + csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eligibility_checks_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadNewsletterCsv = () => {
    const headers = ["Name", "Email", "Created"];

    const rows = newsletterEntries.map((entry) => [
      entry.name,
      entry.email,
      entry.created_at || entry.added_at || "",
    ]);

    const csvLines = [
      headers.map((h) => toCsvValue(h)).join(","),
      ...rows.map((row) => row.map((cell) => toCsvValue(cell)).join(",")),
    ];

    const csvContent = "\uFEFF" + csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter_signups_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveEndTime = async () => {
    if (!endTimeInput) return;
    setSavingEndTime(true);
    try {
      const isoValue = new Date(endTimeInput).toISOString();
      const result = await updateCountdownEndTime(isoValue);
      if (!result.success) {
        console.error(result.error);
      }
      await refreshAdminData();
    } catch (error) {
      console.error("Error saving countdown end time:", error);
    } finally {
      setSavingEndTime(false);
    }
  };

  const handleRunSelectionNow = async () => {
    setRunningSelectionNow(true);
    try {
      const result = await runSelectionNow();
      if (!result.success) {
        console.error(result.error);
      }
      await refreshAdminData();
    } catch (error) {
      console.error("Error running selection now:", error);
    } finally {
      setRunningSelectionNow(false);
    }
  };

  const triggerSelectionViaApi = async () => {
    const response = await fetch("/api/selection/run", {
      method: "POST",
      credentials: "include",
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      reason?: string;
      selectedCount?: number;
      ranSelection?: boolean;
    };
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || `Selection API failed with status ${response.status}`);
    }
    return data;
  };

  useEffect(() => {
    if (!countdownTimer?.end_time) return;
    const status = String(countdownTimer.selection_status ?? "").toLowerCase();
    if (status === "completed" || status === "running") return;

    const triggerKey = `${countdownTimer.id}:${countdownTimer.end_time}`;
    if (autoTriggeredKeyRef.current === triggerKey) return;

    const endAt = new Date(countdownTimer.end_time).getTime();
    if (Number.isNaN(endAt)) return;

    const now = Date.now();
    const delay = Math.max(0, endAt - now);

    const timer = setTimeout(async () => {
      autoTriggeredKeyRef.current = triggerKey;
      try {
        const result = await triggerSelectionViaApi();
        if (result.ranSelection) {
          setAutoRunMessage("Selection auto-run completed from countdown expiry.");
        } else {
          setAutoRunMessage(`Selection auto-run status: ${result.reason || "already processed"}.`);
        }
      } catch (error) {
        console.error("Automatic selection trigger failed:", error);
        setAutoRunMessage("Automatic selection trigger failed. Please use Run Selection Now.");
      } finally {
        await refreshAdminData();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [countdownTimer?.end_time, countdownTimer?.id, countdownTimer?.selection_status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-black">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
            <p className="text-black">Manage the referral program and monitor system status</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Countdown Timer Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
                <ClockIcon className="h-6 w-6 text-indigo-600 mr-2" />
                Countdown Timer
              </h2>
              {countdownTimer && (
                <div className="space-y-4 text-sm text-black">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs">Start Time</p>
                      <p className="font-medium">{formatTime(countdownTimer.start_time)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs">End Time</p>
                      <p className="font-medium">{formatTime(countdownTimer.end_time)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs">Selection Status</p>
                      <p className="font-medium">{countdownTimer.selection_status || "pending"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs">Selected At</p>
                      <p className="font-medium">{formatTime(countdownTimer.selected_at)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Update Deadline</label>
                    <input
                      type="datetime-local"
                      value={endTimeInput}
                      onChange={(e) => setEndTimeInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEndTime}
                      disabled={savingEndTime || !endTimeInput}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {savingEndTime ? "Saving..." : "Save Deadline"}
                    </button>
                    <button
                      onClick={handleRunSelectionNow}
                      disabled={runningSelectionNow}
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 disabled:opacity-50"
                    >
                      {runningSelectionNow ? "Running..." : "Run Selection Now"}
                    </button>
                  </div>
                  {autoRunMessage && (
                    <p className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-3 py-2">
                      {autoRunMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Selection Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-black mb-4">Selection Summary</h2>
              {selectionSummary && (
                <div className="space-y-3 text-sm text-black">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">
                      Selection Run: {selectionSummary.selectionCompletedAt ? "Completed" : "Pending"}
                    </span>
                    {selectionSummary.selectionCompletedAt && (
                      <p className="mt-1 text-xs">
                        Completed at: {formatTime(selectionSummary.selectionCompletedAt)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs">Selected</p>
                      <p className="text-lg font-semibold text-green-700">{selectionSummary.selectedCount}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs">Not Selected</p>
                      <p className="text-lg font-semibold text-orange-700">{selectionSummary.rejectedCount}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs">Pending</p>
                      <p className="text-lg font-semibold text-blue-700">{selectionSummary.pendingCount}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs">Selection Limit</p>
                      <p className="text-lg font-semibold text-purple-700">{selectionSummary.maxUsers}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-black">Eligibility Checks</p>
                  <p className="text-2xl font-bold text-black">{eligibilityChecks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-black">Newsletter Signups</p>
                  <p className="text-2xl font-bold text-black">{newsletterEntries.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-black">Unique Users</p>
                  <p className="text-2xl font-bold text-black">
                    {totalUniqueUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Checks */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold text-black">Eligibility Checks</h2>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as "submitted" | "eligible" | "selection_status");
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                >
                  <option value="eligible">Sort: Eligibility</option>
                  <option value="selection_status">Sort: Selection Status</option>
                </select>
                <select
                  value={sortDirection}
                  onChange={(e) => {
                    setSortDirection(e.target.value as "asc" | "desc");
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
                <button
                  onClick={downloadEligibilityCsv}
                  disabled={sortedEligibilityChecks.length === 0}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  Download CSV
                </button>
                <button
                  onClick={refreshEligibilityChecks}
                  disabled={refreshingEligibility}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {refreshingEligibility ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
            
            {eligibilityChecks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Parent Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Secondary Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Secondary Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Eligible
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Selected
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pagedEligibilityChecks.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {entry.parent_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.primary_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.secondary_email || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.phone_number || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.secondary_phone || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.eligible ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {getSelectionStatusLabel(entry.selection_status as boolean | string | null) || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-black text-center py-8">No eligibility checks submitted yet.</p>
            )}
            {eligibilityChecks.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-sm text-black">
                <span>
                  Showing {(currentPage - 1) * USERS_PER_PAGE + 1}-
                  {Math.min(currentPage * USERS_PER_PAGE, sortedEligibilityChecks.length)} of {sortedEligibilityChecks.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Newsletter Signups */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold text-black">Newsletter Signups</h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadNewsletterCsv}
                  disabled={newsletterEntries.length === 0}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  Download CSV
                </button>
                <button
                  onClick={refreshNewsletterEntries}
                  disabled={refreshingNewsletter}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {refreshingNewsletter ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
            
            {newsletterEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {newsletterEntries.slice(0, 50).map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {entry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {formatTime(entry.created_at || entry.added_at || null)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-black text-center py-8">No newsletter signups yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
