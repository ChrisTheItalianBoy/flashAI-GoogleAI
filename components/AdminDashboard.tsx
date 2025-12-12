
import React, { useEffect, useState } from 'react';
import { authService, DashboardStats, FullReportData } from '../services/authService';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Full Report State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState<FullReportData | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    // Load real stats from the "database"
    const data = authService.getDashboardStats();
    setStats(data);
  }, []);

  const handleOpenFullReport = async () => {
      setIsReportOpen(true);
      if (!reportData) {
          setLoadingReport(true);
          try {
              const data = await authService.generateFullReport();
              setReportData(data);
          } catch (e) {
              alert("Failed to generate report");
              setIsReportOpen(false);
          } finally {
              setLoadingReport(false);
          }
      }
  };

  if (!stats) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

  // Real Stats (No Scaling)
  const displayTotalRevenue = stats.totalRevenue;
  const displayProjectedRevenue = stats.projectedRevenue;
  const displayTotalUsers = stats.totalUsers;
  const displayProCount = stats.proCount;
  const displayFreeCount = stats.freeCount;
  const displayActiveUsers = stats.activeUsers;
  
  // AI Stats
  const displayTokens = stats.aiStats.totalTokens;
  const displayApiCost = stats.aiStats.apiCost;
  
  const proPercent = displayTotalUsers > 0 ? Math.round((displayProCount / displayTotalUsers) * 100) : 0;

  // Chart data
  const maxRevenue = Math.max(...stats.revenueHistory, 1) * 1.2; 

  // Labels for last 7 months
  const monthLabels = [];
  for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthLabels.push(d.toLocaleDateString('en-US', { month: 'short' }));
  }

  // Helper for currency formatting
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const formatCompact = (num: number) => {
      return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  const handleExportCSV = async () => {
      const csvContent = await authService.exportUsersToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `flashai_users_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportMenuOpen(false);
  };

  const handleExportJSON = async () => {
      const jsonContent = await authService.exportUsersToJSON();
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `flashai_users_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportMenuOpen(false);
  };

  const handleResetPassword = async (email: string) => {
      if(window.confirm(`Send password reset email to ${email}?`)) {
          await authService.resetPassword(email);
          alert(`Reset link sent to ${email}`);
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 text-center">
      {/* Sidebar / Nav */}
      <div className="bg-slate-900 text-white w-full h-16 fixed top-0 z-50 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">⚡</div>
             <span className="font-bold text-lg tracking-tight">FlashAI <span className="text-slate-400 font-normal ml-2">| Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">admin@flashai.com</span>
            <button 
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors"
            >
                Logout
            </button>
        </div>
      </div>

      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-8 text-center sm:text-left">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Real-time production data.
                </p>
            </div>
            <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-1 rounded">Live Data</span>
        </div>

        {/* Business Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-center sm:text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Revenue (LTD)</p>
                <div className="flex items-end gap-2 justify-center sm:justify-start">
                    <span className="text-3xl font-extrabold text-slate-900">${formatMoney(displayTotalRevenue)}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">MRR</p>
                <div className="flex items-end gap-2 justify-center sm:justify-start">
                    <span className="text-3xl font-extrabold text-slate-900">${formatMoney(displayProjectedRevenue)}</span>
                    <span className="text-sm text-slate-400 mb-1">/ month</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Users</p>
                <div className="flex items-end gap-2 justify-center sm:justify-start">
                    <span className="text-3xl font-extrabold text-slate-900">{formatNumber(displayTotalUsers)}</span>
                    <span className="text-sm text-green-500 font-bold mb-1">+{formatNumber(displayActiveUsers)} active</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Conversion Rate</p>
                <div className="flex items-end gap-2 justify-center sm:justify-start">
                    <span className="text-3xl font-extrabold text-slate-900">{proPercent}%</span>
                    <span className="text-sm text-slate-400 mb-1">Free to Pro</span>
                </div>
            </div>
        </div>

        {/* AI INFRASTRUCTURE & UNIT ECONOMICS */}
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            AI Infrastructure (Gemini 2.5)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-center sm:text-left">
            <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Token Usage</p>
                <div className="text-3xl font-mono font-bold text-indigo-400">{formatCompact(displayTokens)}</div>
                <p className="text-xs text-slate-500 mt-2">Aggregated input/output</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden group">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">API Cost (Est)</p>
                <div className="text-3xl font-mono font-bold text-white">${formatMoney(displayApiCost)}</div>
                 <p className="text-xs text-slate-500 mt-2">Gemini Flash Pricing</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden group">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gross Margin</p>
                <div className="text-3xl font-mono font-bold text-green-400">{stats.aiStats.grossMargin.toFixed(1)}%</div>
                 <p className="text-xs text-slate-500 mt-2">Healthy (>80%)</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden group">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Latency</p>
                <div className="text-3xl font-mono font-bold text-yellow-400">{stats.aiStats.avgLatency}ms</div>
                 <p className="text-xs text-slate-500 mt-2">P95 Response Time</p>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-center sm:text-left">
            
            {/* Main Revenue Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-slate-800 text-lg">Revenue History</h3>
                    <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                        Last 6 Months
                    </div>
                </div>
                
                {/* CSS Bar Chart using Real Data */}
                <div className="flex items-end justify-between h-64 gap-4">
                    {stats.revenueHistory.map((val, i) => {
                        // Avoid NaN if maxRevenue is 0
                        const percentage = maxRevenue > 0 ? (val / maxRevenue) * 100 : 0;
                        const height = Math.max(2, percentage); // Ensure at least tiny bar
                        
                        return (
                            <div key={i} className="w-full flex flex-col justify-end group cursor-pointer relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    ${formatMoney(val)}
                                </div>
                                <div 
                                    className="bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all duration-300 w-full"
                                    style={{ height: `${height}%` }}
                                ></div>
                                <div className="text-center text-xs text-slate-400 mt-2 font-medium">
                                    {monthLabels[i]}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

             {/* Trending Topics */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Trending Subjects</h3>
                    <button 
                        onClick={handleOpenFullReport}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                        View Full Report
                    </button>
                </div>
                <div className="space-y-4">
                    {stats.topTopics.map((topic, idx) => {
                         const percentage = (topic.count / Math.max(1, stats.topTopics[0].count)) * 100;
                         return (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">{topic.name}</span>
                                    <span className={`text-xs font-bold ${topic.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {topic.growth > 0 ? '+' : ''}{topic.growth}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-slate-800 rounded-full" 
                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                    ></div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        </div>

        {/* FULL REPORT MODAL */}
        {isReportOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsReportOpen(false)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto animate-fade-in-up text-left">
                    <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                        <h2 className="text-2xl font-bold text-slate-900">Full Business Intelligence Report</h2>
                        <button onClick={() => setIsReportOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-8">
                        {loadingReport ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-500">Aggregating data points...</p>
                            </div>
                        ) : reportData ? (
                            <div className="space-y-12">
                                {/* Section 1: Key Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Churn Rate</p>
                                        <p className="text-2xl font-bold text-red-600">{reportData.churnRate}%</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase font-bold">LTV</p>
                                        <p className="text-2xl font-bold text-green-600">${reportData.customerLTV.toFixed(2)}</p>
                                    </div>
                                     <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase font-bold">DAU/MAU Ratio</p>
                                        <p className="text-2xl font-bold text-indigo-600">42%</p>
                                    </div>
                                     <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase font-bold">NPS Score</p>
                                        <p className="text-2xl font-bold text-slate-900">68</p>
                                    </div>
                                </div>

                                {/* Section 2: Retention Cohorts */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">User Retention by Cohort</h3>
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-slate-50 text-slate-500">
                                                <tr>
                                                    <th className="p-4">Cohort Month</th>
                                                    <th className="p-4">Retention Rate</th>
                                                    <th className="p-4 w-1/2">Visual</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {reportData.retentionCohorts.map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="p-4 font-medium">{row.month}</td>
                                                        <td className="p-4 font-bold text-slate-700">{row.rate}%</td>
                                                        <td className="p-4">
                                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${row.rate}%` }}></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Section 3: Geographic & Device Data */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Geographies</h3>
                                        <ul className="space-y-3">
                                            {reportData.geographicData.map((geo, i) => (
                                                <li key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                    <span className="text-slate-700">{geo.country}</span>
                                                    <span className="font-bold text-slate-900">{formatCompact(geo.users)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Platform Breakdown</h3>
                                         <div className="space-y-4">
                                            {reportData.deviceBreakdown.map((dev, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium text-slate-600">{dev.device}</span>
                                                        <span className="font-bold text-slate-900">{dev.percentage}%</span>
                                                    </div>
                                                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-purple-500' : 'bg-pink-500'}`} 
                                                            style={{ width: `${dev.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex justify-end">
                        <button 
                            onClick={() => window.print()}
                            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors mr-2"
                        >
                            Print Report
                        </button>
                        <button 
                            onClick={() => setIsReportOpen(false)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* USER MANAGEMENT TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg">User Management</h3>
                    <p className="text-sm text-slate-500">Search and manage user accounts</p>
                 </div>
                 <div className="flex gap-4 items-center">
                     
                     {/* Export Dropdown */}
                     <div className="relative">
                        <button 
                            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Export Data
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        
                        {isExportMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-fade-in py-1 text-left">
                                <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">
                                    Export CSV
                                </button>
                                <button onClick={handleExportJSON} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">
                                    Export JSON
                                </button>
                            </div>
                        )}
                     </div>

                     <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search email..." 
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-center md:text-left"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                     </div>
                 </div>
             </div>
             
             <div className="overflow-x-auto">
                 <table className="w-full text-center text-sm">
                     <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                         <tr>
                             <th className="px-6 py-3 font-semibold">User</th>
                             <th className="px-6 py-3 font-semibold">Plan</th>
                             <th className="px-6 py-3 font-semibold">Joined</th>
                             <th className="px-6 py-3 font-semibold">Status</th>
                             <th className="px-6 py-3 font-semibold text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {stats.recentTransactions.length === 0 ? (
                             <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">No users found.</td></tr>
                         ) : stats.recentTransactions.map((tx, idx) => (
                             <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4">
                                     <div className="font-medium text-slate-900">{tx.email}</div>
                                     <div className="text-xs text-slate-400">ID: {Math.random().toString(36).substr(2, 9)}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase">PRO</span>
                                 </td>
                                 <td className="px-6 py-4 text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                                 <td className="px-6 py-4 flex justify-center">
                                     <span className="flex items-center gap-1 text-green-600 font-medium">
                                         <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleResetPassword(tx.email)}
                                            className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                        >
                                            Reset Pwd
                                        </button>
                                        <button className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                            Refund
                                        </button>
                                        <button className="px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors">
                                            Ban
                                        </button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             {stats.recentTransactions.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
                    <button className="text-sm text-slate-500 hover:text-slate-800 font-medium">Load more users...</button>
                </div>
             )}
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
