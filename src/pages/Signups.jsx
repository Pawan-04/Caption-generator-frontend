import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, UserPlus } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/40">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <UserPlus size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Join us today! Please enter your details
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:opacity-90 disabled:opacity-70 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 font-semibold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}