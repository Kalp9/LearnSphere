import { ArrowRight, BookOpen, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { CourseGridSkeleton } from "../components/Skeleton";
import api from "../utils/api";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.courses.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Learn, buy, and build skills in one secure place
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            LearnSphere
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A modern course marketplace with curated developer courses, secure Razorpay checkout, and instant access to purchased learning paths.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/courses" className="btn-primary">
              Browse courses
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/register" className="btn-secondary">Create free account</Link>
          </div>
        </div>

        <div className="glass relative rounded-lg p-5">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1300&q=80"
            alt="Learner working through online courses"
            className="h-[420px] w-full rounded-lg object-cover"
          />
          <div className="absolute bottom-10 left-10 right-10 rounded-lg border border-white/10 bg-slate-950/78 p-5 backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-cyan-200">50K+</p>
                <p className="text-xs text-slate-400">Learners</p>
              </div>
              <div>
                <p className="text-2xl font-black text-teal-200">24/7</p>
                <p className="text-xs text-slate-400">Access</p>
              </div>
              <div>
                <p className="text-2xl font-black text-rose-200">100%</p>
                <p className="text-xs text-slate-400">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Protected access", ShieldCheck, "JWT cookies and role-based dashboards keep course access private."],
            ["Instant checkout", CreditCard, "Razorpay order creation and backend signature verification included."],
            ["Career-ready skills", BookOpen, "Focused courses for frontend, backend, database, payments, and deployment."]
          ].map(([title, Icon, body]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-slate-950/35 p-5">
              <Icon className="mb-4 h-7 w-7 text-cyan-300" />
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Featured</p>
            <h2 className="mt-2 text-3xl font-black text-white">Popular courses</h2>
          </div>
          <Link to="/courses" className="btn-secondary hidden sm:flex">View all</Link>
        </div>
        {loading ? <CourseGridSkeleton /> : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <CourseCard key={course._id} course={course} />)}</div>}
      </section>
    </>
  );
};

export default Home;
