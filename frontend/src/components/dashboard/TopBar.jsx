import React, { useContext, useState } from 'react';
import {
  FiShare2,
  FiEdit3,
  FiTrash2,
  FiCopy,
  FiExternalLink,
  FiSave,
  FiClock,
  FiFile,
  FiLink,
  FiRefreshCw,
  FiGlobe,
  FiLock,
  FiDownload,
  FiMessageCircle,
  FiSettings,
  FiCheckCircle,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authContext from '../../context/AuthProvider';
import { VITE_API_URL } from '../../env';

const TopBar = ({
  activePage,
  onSave,
  onDelete,
  onRename,
  lastSaved,
  isLoading,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const navigate = useNavigate();
  const { user, setuser } = useContext(authContext);

  const handleUnauthorized = (error) => {
    if (error.response && error.response.status === 401) {
      setuser(null);
      localStorage.removeItem('zetta_user');
      toast.error('Session expired. Please login again.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return true;
    }
    return false;
  };
  const [shareSettings, setShareSettings] = useState({
    isPublic: true,
    allowComments: false,
    allowDownload: true,
    expiresAt: null,
  });

  const generateShareableLink = async () => {
    if (!activePage?.id) return;

    setIsGeneratingLink(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/pages/publicshare`,
        {
          pageId: activePage.id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data) {
        const publicLink = `${window.location.origin}/public/${response.data.publicShareId}`;
        setShareableLink(publicLink);

        if (response.data.message === 'Already Shared') {
          toast.success('🔗 Public link retrieved successfully!');
        } else {
          toast.success('🔗 Public link generated successfully!');
        }
      } else {
        throw new Error(
          response.data?.Error || response.data?.message || 'Failed to generate link'
        );
      }
    } catch (error) {
      if (handleUnauthorized(error)) return;
      console.error('Error generating share link:', error);
      if (error.response) {
        toast.error(
          `❌ Failed to generate link: ${
            error.response.data?.Error || error.response.data?.message || 'Server error'
          }`
        );
      } else if (error.request) {
        toast.error('❌ Network error. Please check your connection.');
      } else {
        toast.error(`❌ Failed to generate link: ${error.message}`);
      }
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const regenerateLink = async () => {
    if (!activePage?.id) return;

    toast.loading('Regenerating link...', { id: 'regenerate' });

    try {
      await generateShareableLink();
      toast.success('New link generated!', { id: 'regenerate' });
    } catch (error) {
      toast.error('Failed to regenerate link', { id: 'regenerate' });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
    generateShareableLink();
  };

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return 'Never saved';
    const now = new Date();
    const saved = new Date(timestamp);
    const diffInSeconds = Math.floor((now - saved) / 1000);

    if (diffInSeconds < 60) return 'Saved just now';
    if (diffInSeconds < 3600) return `Saved ${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `Saved ${Math.floor(diffInSeconds / 3600)}h ago`;
    return `Saved ${saved.toLocaleDateString()}`;
  };

  return (
    <>
      <div className="h-16 lg:h-20 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 lg:px-8 sticky top-16 z-30 shadow-sm">
        {/* Left Section - Enhanced Page Info */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-sm btn-circle lg:hidden hover:btn-primary hover:scale-110 transition-all duration-200"
            title={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10">
              <FiFile className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content truncate max-w-32 sm:max-w-48 lg:max-w-md">
                {activePage?.name || 'Select a page'}
              </h1>
              <div className="flex items-center space-x-2 lg:space-x-3 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 lg:space-x-2 text-base-content/60">
                  <FiClock className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="font-medium hidden sm:inline">{formatLastSaved(lastSaved)}</span>
                </div>
                {isLoading && (
                  <div className="flex items-center space-x-2 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Saving...</span>
                  </div>
                )}
                {!isLoading && activePage && (
                  <div className="flex items-center space-x-2 text-success">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm font-medium">Synced</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Enhanced Actions */}
        {activePage && (
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Action Buttons Group */}
            <div className="flex items-center gap-5 bg-base-200/50 rounded-2xl p-1 lg:p-1.5 border border-base-300/30 shadow-sm">
              {/* Save Button */}
              <button
                onClick={onSave}
                className="btn btn-ghost btn-sm gap-1 lg:gap-2 hover:btn-success hover:scale-105 transition-all duration-200 rounded-xl"
                disabled={isLoading}
                title="Save page (Ctrl+S)"
              >
                <FiSave className="w-4 h-4" />
                <span className="hidden sm:inline lg:inline">Save</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="btn btn-primary btn-sm gap-1 lg:gap-2 hover:scale-105 transition-all duration-200 rounded-xl shadow-lg shadow-primary/25"
                title="Share page publicly"
              >
                <FiShare2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl border border-base-300/60 backdrop-blur-xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 pb-6 bg-base-100 border-b border-base-300/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                    <FiGlobe className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content">
                      Share "{activePage?.name}"
                    </h3>
                    <p className="text-sm text-base-content/70 mt-1">
                      Create a public link to share your page with anyone
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn btn-ghost btn-sm btn-circle hover:btn-error hover:scale-110 transition-all text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Enhanced Modal Content */}
            <div className="p-8 space-y-8">
              {/* Public Link Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-lg font-semibold text-base-content">
                    <FiLink className="w-5 h-5 text-primary" />
                    Public Link
                  </label>
                  <button
                    onClick={regenerateLink}
                    className="btn btn-ghost btn-sm gap-2 hover:btn-primary rounded-xl"
                    disabled={isGeneratingLink}
                    title="Generate new link"
                  >
                    <FiRefreshCw className={`w-4 h-4 ${isGeneratingLink ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">New Link</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    className="input input-bordered w-full pr-20 text-sm bg-base-50 border-2 focus:border-primary rounded-xl h-12"
                    value={shareableLink}
                    readOnly
                    placeholder={
                      isGeneratingLink
                        ? '🔗 Generating secure public link...'
                        : 'Your public link will appear here'
                    }
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => copyToClipboard(shareableLink)}
                      className="btn btn-primary btn-sm btn-circle hover:scale-110 transition-all"
                      disabled={!shareableLink || isGeneratingLink}
                      title="Copy to clipboard"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(shareableLink, '_blank')}
                      className="btn btn-secondary btn-sm btn-circle hover:scale-110 transition-all"
                      disabled={!shareableLink || isGeneratingLink}
                      title="Open in new tab"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {shareableLink && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Public link is active and ready to share</span>
                  </div>
                )}
              </div>

              {/* Share Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-base-content flex items-center gap-3">
                  <FiSettings className="w-5 h-5 text-secondary" />
                  Sharing Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={shareSettings.isPublic}
                        onChange={(e) =>
                          setShareSettings({ ...shareSettings, isPublic: e.target.checked })
                        }
                      />
                      <div className="flex items-center gap-2">
                        <FiGlobe className="w-4 h-4" />
                        <span className="label-text font-medium">Public Access</span>
                      </div>
                    </label>
                    <p className="text-xs text-base-content/60 ml-8">
                      Anyone with the link can view
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                        checked={shareSettings.allowDownload}
                        onChange={(e) =>
                          setShareSettings({ ...shareSettings, allowDownload: e.target.checked })
                        }
                      />
                      <div className="flex items-center gap-2">
                        <FiDownload className="w-4 h-4" />
                        <span className="label-text font-medium">Allow Download</span>
                      </div>
                    </label>
                    <p className="text-xs text-base-content/60 ml-8">
                      Viewers can download as PDF/MD
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Modal Footer */}
            <div className="p-8 pt-0 flex justify-between items-center border-t border-base-300/60">
              <div className="text-sm text-base-content/60 flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Public sharing is active</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn btn-ghost rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(shareableLink);
                    setShowShareModal(false);
                  }}
                  className="btn btn-primary gap-2 rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                  disabled={!shareableLink}
                >
                  <FiCopy className="w-4 h-4" />
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
