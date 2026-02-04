"use client";

import { useEffect, useState } from "react";
import { 
  ClockIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  PlayIcon,
  StopIcon
} from "@heroicons/react/24/outline";
import { 
  getCountdownTimer, 
  getQueueStatus, 
  updateCountdownTimer, 
  openQueue, 
  closeQueue, 
  selectUsersForReferral,
  getReferralApplications,
  getWaitlistEntries,
  getTotalUniqueUsers
} from "../actions";

interface CountdownTimer {
  id: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface QueueStatus {
  id: number;
  max_users: number;
  current_users: number;
  queue_position: number;
  is_open: boolean;
}

export default function AdminDashboard() {
  const [countdownTimer, setCountdownTimer] = useState<CountdownTimer | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [referralApplications, setReferralApplications] = useState<Record<string, any>[]>([]);
  const [waitlistEntries, setWaitlistEntries] = useState<Record<string, any>[]>([]);
  const [totalUniqueUsers, setTotalUniqueUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [newEndTime, setNewEndTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timer, queue, applications, waitlist, uniqueUsers] = await Promise.all([
          getCountdownTimer(),
          getQueueStatus(),
          getReferralApplications(),
          getWaitlistEntries(),
          getTotalUniqueUsers()
        ]);

        setCountdownTimer(timer as CountdownTimer | null);
        setQueueStatus(queue as QueueStatus | null);
        setReferralApplications(applications);
        setWaitlistEntries(waitlist);
        setTotalUniqueUsers(uniqueUsers);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateTimer = async () => {
    if (!newEndTime) return;

    try {
      const startTime = new Date().toISOString();
      const result = await updateCountdownTimer(startTime, newEndTime);
      if (result.success) {
        const timer = await getCountdownTimer();
        setCountdownTimer(timer as CountdownTimer | null);
        setNewEndTime("");
      }
    } catch (error) {
      console.error("Error updating timer:", error);
    }
  };

  const handleOpenQueue = async () => {
    try {
      const result = await openQueue();
      if (result.success) {
        const queue = await getQueueStatus();
        setQueueStatus(queue as QueueStatus | null);
      }
    } catch (error) {
      console.error("Error opening queue:", error);
    }
  };

  const handleCloseQueue = async () => {
    try {
      const result = await closeQueue();
      if (result.success) {
        const queue = await getQueueStatus();
        setQueueStatus(queue as QueueStatus | null);
      }
    } catch (error) {
      console.error("Error closing queue:", error);
    }
  };

  const handleSelectUsers = async () => {
    try {
      const result = await selectUsersForReferral();
      if (result.success) {
        const [queue, applications, waitlist, uniqueUsers] = await Promise.all([
          getQueueStatus(),
          getReferralApplications(),
          getWaitlistEntries(),
          getTotalUniqueUsers()
        ]);
        setQueueStatus(queue as QueueStatus | null);
        setReferralApplications(applications);
        setWaitlistEntries(waitlist);
        setTotalUniqueUsers(uniqueUsers);
      }
    } catch (error) {
      console.error("Error selecting users:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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

          {/* Control Panel */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Countdown Timer Control */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
                <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
                Countdown Timer
              </h2>
              
              {countdownTimer && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-black">Start Time:</span>
                      <p className="font-medium">{formatTime(countdownTimer.start_time)}</p>
                    </div>
                    <div>
                      <span className="text-black">End Time:</span>
                      <p className="font-medium">{formatTime(countdownTimer.end_time)}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-medium">
                      Time Remaining: {getTimeRemaining(countdownTimer.end_time)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Set New End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleUpdateTimer}
                      disabled={!newEndTime}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Update Timer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Queue Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
                <UsersIcon className="h-6 w-6 text-green-600 mr-2" />
                Queue Management
              </h2>
              
              {queueStatus && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-black">Queue Position:</span>
                      <p className="font-medium text-2xl text-green-600">{queueStatus.queue_position}</p>
                    </div>
                    <div>
                      <span className="text-black">Max Users:</span>
                      <p className="font-medium text-2xl text-blue-600">{queueStatus.max_users}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-black font-medium">
                      Status: {queueStatus.is_open ? "Open" : "Closed"}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleOpenQueue}
                      disabled={queueStatus.is_open}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Open Queue
                    </button>
                    
                    <button
                      onClick={handleCloseQueue}
                      disabled={!queueStatus.is_open}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <StopIcon className="h-4 w-4 mr-2" />
                      Close Queue
                    </button>
                    
                    <button
                      onClick={handleSelectUsers}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 flex items-center justify-center"
                    >
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      Select 40 Users
                    </button>
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
                  <p className="text-sm text-black">Referral Applications</p>
                  <p className="text-2xl font-bold text-black">{referralApplications.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-black">Waitlist Entries</p>
                  <p className="text-2xl font-bold text-black">{waitlistEntries.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-black">Total Queue Positions</p>
                  <p className="text-2xl font-bold text-black">
                    {queueStatus?.queue_position || 0}
                  </p>
                  <p className="text-xs text-black mt-1">
                    {totalUniqueUsers} unique users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Recent Referral Applications</h2>
            
            {referralApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Child Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referralApplications.slice(0, 10).map((app) => (
                      <tr key={app.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {app.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {app.child_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {app.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {formatTime(app.submitted_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-black text-center py-8">No referral applications yet.</p>
            )}
          </div>

          {/* Waitlist Entries */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Waitlist Entries</h2>
            
            {waitlistEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Child Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Added
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitlistEntries.slice(0, 10).map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {entry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.child_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {entry.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {formatTime(entry.added_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-black text-center py-8">No waitlist entries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
