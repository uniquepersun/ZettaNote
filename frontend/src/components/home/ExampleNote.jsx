const ExampleNote = () => (
  <div className="max-w-xl mx-auto bg-[color:var(--color-base-100)] border border-[color:var(--color-base-300)] rounded-lg p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-[color:var(--color-base-content)]">
        Meeting Notes — 12 Oct 2025
      </h3>
      <div className="text-sm text-[color:var(--color-neutral-content)]">
        Private • Edited 2h ago
      </div>
    </div>
    <p className="mt-3 text-sm text-[color:var(--color-neutral-content)] leading-relaxed">
      Quick summary: Decide migration plan for the frontend — start with a Vite parallel folder,
      migrate auth pages first, then dashboard. Public share will be read-only links.
    </p>
    <div className="mt-4 flex gap-2">
      <button className="px-3 py-1 rounded-md text-sm border border-[color:var(--color-base-300)]">
        Edit
      </button>
      <button className="px-3 py-1 rounded-md text-sm bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)]">
        Share (public)
      </button>
    </div>
  </div>
);

export default ExampleNote;
