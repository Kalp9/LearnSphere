import { BookOpen, CreditCard, GraduationCap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const enrolled = user?.enrolledCourses || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass rounded-lg p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Dashboard</p>
        <h1 className="mt-2 text-4xl font-black text-white">Hello, {user?.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Track your enrolled courses, continue lessons, and manage your LearnSphere profile.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Enrolled", enrolled.length, GraduationCap],
          ["Role", user?.role, ShieldCheck],
          ["Payments", "Secure", CreditCard],
          ["Catalog", "Live", BookOpen]
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <Icon className="mb-3 h-6 w-6 text-cyan-300" />
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Continue learning</h2>
          <p className="mt-1 text-sm text-slate-400">Your purchased courses appear here.</p>
        </div>
        {isAdmin && <Link className="btn-secondary" to="/admin">Admin dashboard</Link>}
      </div>

      <div className="mt-6">
        {enrolled.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {enrolled.map((course) => <CourseCard key={course._id} course={course} owned />)}
          </div>
        ) : (
          <EmptyState title="No enrolled courses yet" description="Browse the catalog and unlock a course to start learning." />
        )}
      </div>
    </section>
  );
};

export default Dashboard;
