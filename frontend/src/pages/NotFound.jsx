import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12">
    <div className="glass max-w-lg rounded-lg p-8 text-center">
      <p className="text-7xl font-black text-cyan-200">404</p>
      <h1 className="mt-4 text-3xl font-black text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
      <Link className="btn-primary mt-6" to="/">
        <Home className="h-5 w-5" />
        Go home
      </Link>
    </div>
  </section>
);

export default NotFound;
