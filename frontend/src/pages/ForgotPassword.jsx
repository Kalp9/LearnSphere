import { Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset email sent");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-6">
        <Mail className="mb-5 h-10 w-10 text-cyan-300" />
        <h1 className="text-3xl font-black text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-400">Enter your email and we will send a secure reset link.</p>
        <input className="input mt-6" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button disabled={loading} className="btn-primary mt-6 w-full" type="submit">{loading ? "Sending..." : "Send reset link"}</button>
      </form>
    </section>
  );
};

export default ForgotPassword;
