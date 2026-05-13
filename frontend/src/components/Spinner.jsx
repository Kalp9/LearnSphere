const Spinner = ({ label = "Loading" }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-slate-300">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-300" />
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
  </div>
);

export default Spinner;
