import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, Download, Users, LogIn, LogOut } from 'lucide-react';
import { PledgeData } from '../types';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

enum OperationType {
  GET = 'get',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [leads, setLeads] = useState<(PledgeData & { id: string, createdAt: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const fetchLeads = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        data.push({
          id: doc.id,
          ...item,
          createdAt: item.createdAt ? item.createdAt.toDate().toISOString() : new Date().toISOString(),
        });
      });
      setLeads(data);
    } catch (err: any) {
      setError(err?.message || 'Permission denied or network error.');
      handleFirestoreError(err, OperationType.GET, 'leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // The admin password configured in environment, defaults to the known one
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Adda@2025';
    
    if (password === adminPassword) {
      try {
        // Because the deployed Vercel database has strict rules, we MUST authenticate.
        // We use the admin's email and the entered password to authenticate.
        // If the user hasn't created this in Firebase Auth, this will fail.
        await signInWithEmailAndPassword(auth, 'maheshwari.jahanvi9@gmail.com', password);
        setIsLoggedIn(true);
      } catch (err: any) {
        console.error('Firebase Auth failed:', err);
        // Fallback: allow UI access, but note that Firebase Data might still reject with "Insufficient Permissions"
        setIsLoggedIn(true);
        // We do not set an error here so they can at least see the UI, but the leads fetch might fail.
      }
    } else {
      setError('Invalid password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch(err) {
      console.error(err);
    }
    setIsLoggedIn(false);
    setLeads([]);
    setPassword('');
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Candidate Name', 'Father Name', 'Target Exam', 'Phone', 'Created At'];
    const rows = leads.map(sub => [
      sub.id, 
      sub.candidateName, 
      sub.fatherName, 
      sub.targetExam, 
      sub.phoneNumber,
      new Date(sub.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'adda247_pledge_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Admin Access</h2>
          <form onSubmit={handleLogin} className="w-full">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB3237]/50 placeholder-slate-400"
                placeholder="Enter password"
              />
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-3 font-medium mt-6">
              <button 
                type="button" 
                onClick={onExit} 
                className="text-slate-600 hover:text-slate-800 px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#EB3237] hover:bg-[#D32F2F] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Access
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 pt-4 md:pt-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-6xl mx-auto p-4 md:p-8"
      >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-sans font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#EB3237]" />
                Lead Management dashboard
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-slate-500 text-sm">Real-time captured leads from the pledge campaign.</p>
                <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Admin</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {error && <span className="text-red-500 text-sm font-medium mr-2">{error}</span>}
            <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-[#EB3237] hover:bg-[#D32F2F] text-white rounded-lg transition-colors text-sm font-medium">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="p-0 overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                <th className="p-4 py-3 whitespace-nowrap">Candidate Name</th>
                <th className="p-4 py-3 whitespace-nowrap">Father's Name</th>
                <th className="p-4 py-3 whitespace-nowrap">Target Exam</th>
                <th className="p-4 py-3 whitespace-nowrap">Phone Number</th>
                <th className="p-4 py-3 whitespace-nowrap">Captured Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No leads captured yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">{lead.candidateName}</td>
                    <td className="p-4 py-3 text-sm text-slate-600 whitespace-nowrap">{lead.fatherName}</td>
                    <td className="p-4 py-3 text-sm font-medium whitespace-nowrap">
                      <span className="bg-[#EB3237]/10 text-[#EB3237] px-2 py-1 rounded-md text-xs">
                        {lead.targetExam}
                      </span>
                    </td>
                    <td className="p-4 py-3 text-sm text-slate-600 whitespace-nowrap">{lead.phoneNumber}</td>
                    <td className="p-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
    </div>
  );
}

