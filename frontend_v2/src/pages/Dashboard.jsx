import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import Note from '../components/dashboard/Note';
import authContext from '../context/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(authContext);
  const [activePage, setActivePage] = useState(null);
  const [pageContent, setPageContent] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  useEffect(() => {
    if (activePage?.id) {
      loadPageContent(activePage.id);
    } else {
      setPageContent('');
    }
  }, [activePage]);

  const loadPageContent = async (pageId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pages/getpage`,
        { pageId },
        { withCredentials: true }
      );
      
      if (response.data.Page) {
        setPageContent(response.data.Page.pageData || '');
        setLastSaved(response.data.Page.updatedAt);
      }
    } catch (error) {
      toast.error('Failed to load page content');
      console.error('Error loading page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (newContent) => {
    setPageContent(newContent);
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      handleSave(newContent);
    }, 2000);
  };

  const handleSave = async (content = pageContent) => {
    if (!activePage?.id) return;
    
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pages/savepage`,
        {
          pageId: activePage.id,
          newPageData: content
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setLastSaved(new Date().toISOString());
        toast.success('Page saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save page');
      console.error('Error saving page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async () => {
    if (!activePage?.id) return;
    
    if (!confirm(`Are you sure you want to delete "${activePage.name}"?`)) return;
    
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/pages/deletepage`,
        {
          data: { pageId: activePage.id },
          withCredentials: true
        }
      );
      
      if (response.data.success || response.data.message?.includes('deleted')) {
        toast.success('Page deleted successfully!');
        setActivePage(null);
        setPageContent('');
      }
    } catch (error) {
      toast.error('Failed to delete page');
      console.error('Error deleting page:', error);
    }
  };

  const handleRenamePage = () => {
    const newName = prompt(`Rename "${activePage.name}" to:`, activePage.name);
    if (newName && newName.trim() && newName !== activePage.name) {
      toast.info('Rename functionality would be implemented with backend API');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/20 pt-16 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <Sidebar 
        onPageSelect={(page) => {
          setActivePage(page);
          setIsSidebarOpen(false); // Close sidebar on mobile when page is selected
        }} 
        selectedPageId={activePage?.id}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        {/* Enhanced Top Bar */}
        <TopBar 
          activePage={activePage}
          onSave={() => handleSave()}
          onDelete={handleDeletePage}
          onRename={handleRenamePage}
          lastSaved={lastSaved}
          isLoading={isLoading}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* Enhanced Note Editor */}
        <Note 
          activePage={activePage}
          content={pageContent}
          onContentChange={handleContentChange}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Dashboard;