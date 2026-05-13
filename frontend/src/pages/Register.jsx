import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-6">
        <UserPlus className="mb-5 h-10 w-10 text-cyan-300" />
        <h1 className="text-3xl font-black text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Start building skills with LearnSphere.</p>
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength="6" required />
        </div>
        <button disabled={loading} className="btn-primary mt-6 w-full" type="submit">{loading ? "Creating..." : "Register"}</button>
        <p className="mt-5 text-center text-sm text-slate-400">
          Already have an account? <Link className="font-bold text-cyan-200" to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
