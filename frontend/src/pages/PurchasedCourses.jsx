import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import api from "../utils/api";

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/users/enrolled");
        setCourses(data.courses);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <Spinner label="Loading purchases" />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Library</p>
        <h1 className="mt-2 text-4xl font-black text-white">Purchased courses</h1>
      </div>
      {courses.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <CourseCard key={course._id} course={course} owned />)}</div> : <EmptyState title="Your library is empty" />}
    </section>
  );
};

export default PurchasedCourses;
