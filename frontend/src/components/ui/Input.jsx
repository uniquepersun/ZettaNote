const Input = ({ type, id, name, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
    />
  );
};

export default Input;
