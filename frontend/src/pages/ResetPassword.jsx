import { KeyRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      localStorage.setItem("learnsphere_token", data.token);
      setUser(data.user);
      toast.success("Password updated");
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
        <KeyRound className="mb-5 h-10 w-10 text-cyan-300" />
        <h1 className="text-3xl font-black text-white">Choose new password</h1>
        <input className="input mt-6" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required />
        <button disabled={loading} className="btn-primary mt-6 w-full" type="submit">{loading ? "Updating..." : "Update password"}</button>
      </form>
    </section>
  );
};

export default ResetPassword;
