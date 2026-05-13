import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      navigate(location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/dashboard"));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-6">
        <LockKeyhole className="mb-5 h-10 w-10 text-cyan-300" />
        <h1 className="text-3xl font-black text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Login to continue learning.</p>
        <div className="mt-6 space-y-4">
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="mt-4 flex justify-end">
          <Link className="text-sm font-semibold text-cyan-200 hover:text-cyan-100" to="/forgot-password">Forgot password?</Link>
        </div>
        <button disabled={loading} className="btn-primary mt-6 w-full" type="submit">{loading ? "Signing in..." : "Login"}</button>
        <p className="mt-5 text-center text-sm text-slate-400">
          New here? <Link className="font-bold text-cyan-200" to="/register">Create account</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
