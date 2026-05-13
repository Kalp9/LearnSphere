import { SearchX } from "lucide-react";

const EmptyState = ({ title = "Nothing here yet", description = "Try adjusting your filters." }) => (
  <div className="glass flex flex-col items-center justify-center rounded-lg px-6 py-14 text-center">
    <SearchX className="mb-4 h-12 w-12 text-cyan-300" />
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
  </div>
);

export default EmptyState;
