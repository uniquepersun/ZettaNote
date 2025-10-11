import propTypes from 'prop-types';

const Feature = ({ icon, title, desc }) => (
  <div className="h-full bg-[color:var(--color-base-200)] border border-[color:var(--color-border,rgba(0,0,0,0.06))] rounded-xl p-6 shadow-sm flex flex-col justify-between">
    <div className="flex items-start gap-4">
      <div className="p-2 flex items-center justify-center rounded-full bg-[color:var(--color-primary)]/10">
        <div className="text-[color:var(--color-primary)]">{icon}</div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-[color:var(--color-base-content)]">{title}</h4>
        <p className="mt-1 text-sm text-[color:var(--color-neutral-content)]">{desc}</p>
      </div>
    </div>
  </div>
);

Feature.propTypes = {
  icon: propTypes.node.isRequired,
  title: propTypes.string.isRequired,
  desc: propTypes.string.isRequired,
};

export default Feature;
