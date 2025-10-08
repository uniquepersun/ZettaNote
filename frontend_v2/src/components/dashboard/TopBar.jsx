import React, { useState } from 'react';
import { 
  FiShare2, 
  FiMoreHorizontal, 
  FiEdit3, 
  FiTrash2, 
  FiCopy, 
  FiExternalLink,
  FiSave,
  FiClock,
  FiFile
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const TopBar = ({ activePage, onSave, onDelete, onRename, lastSaved, isLoading }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);


  const generateShareableLink = async () => {
    if (!activePage?.id) return;
    
    setIsGeneratingLink(true);
    try {
      const mockLink = `${window.location.origin}/shared/${activePage.id}`;
      setShareableLink(mockLink);
      toast.success('Shareable link generated!');
    } catch (error) {
      toast.error('Failed to generate shareable link');
    } finally {
      setIsGeneratingLink(false);
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
      <div className="h-20 bg-base-100 border-b border-base-300 flex items-center justify-between px-8 sticky top-16 z-30 shadow-sm">
        {/* Left Section - Enhanced Page Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10">
              <FiFile className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-base-content truncate max-w-md">
                {activePage?.name || 'Select a page'}
              </h1>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2 text-base-content/60">
                  <FiClock className="w-4 h-4" />
                  <span className="font-medium">{formatLastSaved(lastSaved)}</span>
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
          <div className="flex items-center space-x-4">
            {/* Action Buttons Group */}
            <div className="flex items-center bg-base-200/50 rounded-2xl p-1.5 border border-base-300/30 shadow-sm">
              {/* Save Button */}
              <button
                onClick={onSave}
                className="btn btn-ghost btn-sm gap-2 hover:btn-primary hover:scale-105 transition-all duration-200 rounded-xl"
                disabled={isLoading}
                title="Save page (Ctrl+S)"
              >
                <FiSave className="w-4 h-4" />
                <span className="hidden md:inline">Save</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="btn btn-primary btn-sm gap-2 hover:scale-105 transition-all duration-200 rounded-xl shadow-lg shadow-primary/25"
                title="Share page"
              >
                <FiShare2 className="w-4 h-4" />
                <span className="hidden md:inline">Share</span>
              </button>
            </div>

            {/* More Options Dropdown */}
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-sm btn-circle hover:btn-primary hover:scale-110 transition-all duration-200"
                onClick={() => setActiveDropdown(!activeDropdown)}
              >
                <FiMoreHorizontal className="w-5 h-5" />
              </div>
              {activeDropdown && (
                <ul className="dropdown-content z-50 menu p-3 shadow-2xl bg-base-100 rounded-2xl w-56 border border-base-300/60 backdrop-blur-xl">
                  <li className="menu-title">
                    <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Page Actions</span>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onRename();
                        setActiveDropdown(false);
                      }}
                      className="flex items-center gap-3 text-sm py-3 px-4 hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <FiEdit3 className="w-4 h-4 text-primary" />
                      <span>Rename Page</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        copyToClipboard(window.location.href);
                        setActiveDropdown(false);
                      }}
                      className="flex items-center gap-3 text-sm py-3 px-4 hover:bg-secondary/10 rounded-xl transition-colors"
                    >
                      <FiCopy className="w-4 h-4 text-secondary" />
                      <span>Copy Link</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.open(window.location.href, '_blank');
                        setActiveDropdown(false);
                      }}
                      className="flex items-center gap-3 text-sm py-3 px-4 hover:bg-info/10 rounded-xl transition-colors"
                    >
                      <FiExternalLink className="w-4 h-4 text-info" />
                      <span>Open in New Tab</span>
                    </button>
                  </li>
                  <div className="divider my-2"></div>
                  <li>
                    <button
                      onClick={() => {
                        onDelete();
                        setActiveDropdown(false);
                      }}
                      className="flex items-center gap-3 text-sm py-3 px-4 hover:bg-error/10 text-error rounded-xl transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete Page</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg border border-base-300/60 backdrop-blur-xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 pb-6 bg-base-100 border-b border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <FiShare2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-base-content">Share Your Page</h3>
                    <p className="text-sm text-base-content/60 mt-1">Make your ideas accessible to others</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn btn-ghost btn-sm btn-circle hover:btn-error hover:scale-110 transition-all"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Enhanced Modal Content */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-base font-semibold text-base-content">
                    <FiLink className="w-4 h-4 text-primary" />
                    Shareable Link
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input input-bordered w-full pr-16 text-sm bg-base-50 border-2 focus:border-primary rounded-xl"
                      value={shareableLink}
                      readOnly
                      placeholder={isGeneratingLink ? "🔗 Generating secure link..." : "Your shareable link will appear here"}
                    />
                    <button
                      onClick={() => copyToClipboard(shareableLink)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary btn-sm btn-circle hover:scale-110 transition-all"
                      disabled={!shareableLink || isGeneratingLink}
                      title="Copy to clipboard"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span>Anyone with this link can view your page</span>
                  </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
                  <h4 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    Quick Share Options
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => {
                        const text = `📝 Check out my note: "${activePage?.name}"\n\n${shareableLink}\n\nShared via ZettaNote ✨`;
                        if (navigator.share) {
                          navigator.share({ title: activePage?.name, text, url: shareableLink });
                        } else {
                          copyToClipboard(text);
                        }
                      }}
                      className="btn btn-outline hover:btn-secondary gap-3 justify-start rounded-xl transition-all hover:scale-[1.02]"
                      disabled={!shareableLink}
                    >
                      <FiShare2 className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Share via System</div>
                        <div className="text-xs opacity-70">Use your device's share menu</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        const subject = `📝 ZettaNote: ${activePage?.name}`;
                        const body = `Hi there! 👋\n\nI'd like to share this note with you:\n\n"${activePage?.name}"\n\n${shareableLink}\n\nBest regards,\nShared via ZettaNote ✨`;
                        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                      }}
                      className="btn btn-outline hover:btn-info gap-3 justify-start rounded-xl transition-all hover:scale-[1.02]"
                      disabled={!shareableLink}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <div className="text-left">
                        <div className="font-medium">Email Link</div>
                        <div className="text-xs opacity-70">Open your email client</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                  <p className="text-sm text-base-content/80 text-center">
                    🔐 <strong>Privacy Note:</strong> This link provides read-only access to your page
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Modal Footer */}
            <div className="p-8 pt-0 flex justify-between items-center">
              <div className="text-xs text-base-content/60">
                Link expires: Never • Access: Read-only
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="btn btn-primary gap-2 rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all"
              >
                <span>All Set!</span>
                <div className="w-2 h-2 bg-primary-content rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(false)}
        />
      )}
    </>
  );
};

export default TopBar;
