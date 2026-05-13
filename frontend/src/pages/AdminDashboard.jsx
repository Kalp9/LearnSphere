import { Edit3, Plus, Save, Trash2, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import api from "../utils/api";
import { formatCurrency } from "../utils/format";
import { mediaUrl } from "../utils/media";

const initialCourse = {
  title: "",
  description: "",
  price: "",
  category: "",
  thumbnail: "",
  instructor: "",
  videoUrl: ""
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialCourse);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = useMemo(() => [...new Set(courses.map((course) => course.category))], [courses]);

  const loadAdmin = async () => {
    setLoading(true);
    try {
      const [statsRes, coursesRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/courses"),
        api.get("/users")
      ]);
      setStats(statsRes.data.stats);
      setCourses(coursesRes.data.courses);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const resetForm = () => {
    setForm(initialCourse);
    setThumbnailFile(null);
    setEditingId("");
  };

  const editCourse = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      videoUrl: course.videoUrl
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitCourse = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);

      if (editingId) {
        await api.put(`/courses/${editingId}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Course updated");
      } else {
        await api.post("/courses", payload, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Course created");
      }

      resetForm();
      await loadAdmin();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      toast.success("Course deleted");
      await loadAdmin();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      toast.success("User role updated");
      await loadAdmin();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted");
      await loadAdmin();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Spinner label="Loading admin" />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Admin</p>
        <h1 className="mt-2 text-4xl font-black text-white">Command center</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Users", stats?.totalUsers, Users],
          ["Courses", stats?.totalCourses, Plus],
          ["Orders", stats?.totalOrders, Save],
          ["Sales", formatCurrency(stats?.totalSales), Plus]
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <Icon className="mb-3 h-6 w-6 text-cyan-300" />
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submitCourse} className="glass mt-8 rounded-lg p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit course" : "Add course"}</h2>
            <p className="text-sm text-slate-400">Upload a thumbnail file or provide an image URL.</p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input" placeholder="Instructor" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required />
          <input className="input" type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="input" list="categories" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <datalist id="categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
          <input className="input md:col-span-2" placeholder="Video URL" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          <input className="input md:col-span-2" type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
          <textarea className="input min-h-32 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <button disabled={saving} className="btn-primary mt-6" type="submit">
          <Save className="h-5 w-5" />
          {saving ? "Saving..." : editingId ? "Update course" : "Create course"}
        </button>
      </form>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="mb-4 text-2xl font-black text-white">Manage courses</h2>
          {courses.length ? (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course._id} className="glass flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center">
                  <img src={course.thumbnailUrl || mediaUrl(course.thumbnail)} alt={course.title} className="h-24 w-full rounded-lg object-cover sm:w-36" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white">{course.title}</h3>
                    <p className="text-sm text-slate-400">{course.category} · {formatCurrency(course.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary px-3" onClick={() => editCourse(course)} type="button"><Edit3 className="h-4 w-4" /></button>
                    <button className="btn-secondary px-3 text-rose-200" onClick={() => deleteCourse(course._id)} type="button"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No courses yet" />
          )}
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-black text-white">Manage users</h2>
          <div className="glass overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id} className="border-b border-white/5">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select className="input min-w-28 py-2" value={item.role} onChange={(e) => updateRole(item._id, e.target.value)}>
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button className="btn-secondary px-3 text-rose-200" onClick={() => deleteUser(item._id)} type="button">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
