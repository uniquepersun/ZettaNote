import { FaGithub, FaGoogle } from 'react-icons/fa';
import { VITE_API_URL } from '../env';

/**
 * OAuthButtons Component
 * Reusable OAuth authentication buttons for Google and GitHub
 * Used in both Login and Signup pages
 */
const OAuthButtons = () => {
  return (
    <>
      {/* OAuth Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-base-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-base-100 text-base-content/60">Or continue with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => (window.location.href = `${VITE_API_URL}/api/auth/google`)}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-base-300 rounded-lg hover:bg-base-200 transition-all duration-200 font-medium"
        >
          <FaGoogle className="w-5 h-5" style={{ color: '#4285F4' }} />
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = `${VITE_API_URL}/api/auth/github`)}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-base-300 rounded-lg hover:bg-base-200 transition-all duration-200 font-medium"
        >
          <FaGithub className="w-5 h-5" />
          <span>GitHub</span>
        </button>
      </div>
    </>
  );
};

export default OAuthButtons;
