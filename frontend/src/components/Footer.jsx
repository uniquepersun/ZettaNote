import { Github, Globe, Files } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-base-300 py-8 px-4 md:px-8 text-sm text-base-content/80">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-base-content">ZettaNote</h2>
          <p className="max-w-md text-sm mt-1">
            An open-source note-taking platform — create, edit, and share notes effortlessly. Built
            with ❤️ by the community.
          </p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm">
          <a
            href="https://github.com/braydenidzenga/ZettaNote"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary flex items-center gap-1"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary flex items-center gap-1"
          >
            <Files size={16} /> Documentation
          </a>
          <a
            href="https://zettanote.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary flex items-center gap-1"
          >
            <Globe size={16} /> Website
          </a>
        </div>

        {/* Right Section */}
        <div className="text-xs text-center md:text-right text-base-content/60">
          <p>© {new Date().getFullYear()} ZettaNote. All rights reserved.</p>
          <p>
            Contributions welcome on{' '}
            <a
              href="https://github.com/ikeshav26/ZettaNote"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
