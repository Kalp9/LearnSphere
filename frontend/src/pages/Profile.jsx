import { Save, UserCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await api.put("/users/profile", payload);
      setUser(data.user);
      setForm((current) => ({ ...current, password: "" }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="glass rounded-lg p-6 sm:p-8">
        <UserCircle className="mb-5 h-12 w-12 text-cyan-300" />
        <h1 className="text-4xl font-black text-white">Profile</h1>
        <p className="mt-2 text-slate-400">Update your account details and password.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input sm:col-span-2" placeholder="Avatar URL" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
          <input className="input sm:col-span-2" type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button disabled={loading} className="btn-primary mt-6" type="submit">
          <Save className="h-5 w-5" />
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
};

export default Profile;
