import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <nav className="relative bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">QA Test Case Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm text-white/80">
                  Welcome, {user?.firstName || 'User'}!
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to the QA Platform
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Manage your test cases, projects, and quality assurance workflows with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white ml-3">Recent Projects</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              View and manage your latest QA projects and test suites.
            </p>
            <div className="text-xs text-white/50 bg-white/10 rounded-lg px-3 py-2 inline-block">
              No projects yet
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white ml-3">Quick Actions</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Create new test cases, projects, or run test suites quickly.
            </p>
            <div className="text-xs text-white/50 bg-white/10 rounded-lg px-3 py-2 inline-block">
              Coming soon
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white ml-3">Test Cases</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Organize and execute your test cases with detailed tracking.
            </p>
            <div className="text-xs text-white/50 bg-white/10 rounded-lg px-3 py-2 inline-block">
              No test cases yet
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Platform Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/5 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
              <div className="text-sm text-white/70">Total Projects</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">0</div>
              <div className="text-sm text-white/70">Test Cases</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
              <div className="text-sm text-white/70">Test Suites</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-6">
              <div className="text-3xl font-bold text-orange-400 mb-2">0</div>
              <div className="text-sm text-white/70">Executions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
