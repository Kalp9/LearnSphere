import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import { CourseGridSkeleton } from "../components/Skeleton";
import api from "../utils/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        const { data } = await api.get(`/courses?${params.toString()}`);
        setCourses(data.courses);
        setCategories(data.categories);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchCourses, 250);
    return () => clearTimeout(timeout);
  }, [search, category]);

  const resultLabel = useMemo(() => `${courses.length} course${courses.length === 1 ? "" : "s"} found`, [courses.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Catalog</p>
          <h1 className="mt-2 text-4xl font-black text-white">Explore courses</h1>
          <p className="mt-2 text-slate-400">{resultLabel}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input className="input pl-10" placeholder="Search courses" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <select className="input pl-10" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>
      {loading ? <CourseGridSkeleton /> : courses.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <CourseCard key={course._id} course={course} />)}</div> : <EmptyState title="No courses found" />}
    </section>
  );
};

export default Courses;
