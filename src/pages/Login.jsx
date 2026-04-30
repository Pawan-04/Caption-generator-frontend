import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/login", form);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/40">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <LogIn size={32} />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Please enter your details to sign in
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 disabled:opacity-70 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}