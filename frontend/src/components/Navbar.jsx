import { BookOpen, LayoutDashboard, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-cyan-300/15 text-cyan-200" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300 text-slate-950 shadow-glow">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tight text-white">LearnSphere</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink className={navClass} to="/courses">Courses</NavLink>
          {isAuthenticated && <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>}
          {isAuthenticated && <NavLink className={navClass} to="/purchased">Purchased</NavLink>}
          {isAdmin && <NavLink className={navClass} to="/admin">Admin</NavLink>}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn-secondary px-3 py-2">
                <User className="h-4 w-4" />
                {user?.name?.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-secondary px-3 py-2">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link className="btn-secondary px-4 py-2" to="/login">Login</Link>
              <Link className="btn-primary px-4 py-2" to="/register">Join now</Link>
            </>
          )}
        </div>

        <button className="btn-secondary px-3 py-2 md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink onClick={() => setOpen(false)} className={navClass} to="/courses">Courses</NavLink>
            {isAuthenticated && <NavLink onClick={() => setOpen(false)} className={navClass} to="/dashboard"><LayoutDashboard className="inline h-4 w-4" /> Dashboard</NavLink>}
            {isAuthenticated && <NavLink onClick={() => setOpen(false)} className={navClass} to="/purchased">Purchased</NavLink>}
            {isAdmin && <NavLink onClick={() => setOpen(false)} className={navClass} to="/admin"><ShieldCheck className="inline h-4 w-4" /> Admin</NavLink>}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary mt-2 w-full">Logout</button>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link onClick={() => setOpen(false)} className="btn-secondary" to="/login">Login</Link>
                <Link onClick={() => setOpen(false)} className="btn-primary" to="/register">Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
