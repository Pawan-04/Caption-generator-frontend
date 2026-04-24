import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    api.get("/auth/check")
      .then(() => {})
      .catch(() => navigate("/"));
  }, []);

  
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
      setCaption(""); // clear old caption
    }
  };


  const handleGenerate = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await api.post("/post/create", formData);

      
      setCaption(res.data.post.caption);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Error generating caption");
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // optional if you create this route
    } catch (err) {}

    navigate("/");
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center p-6">

    {/* Glass Card */}
    <div className="w-full max-w-5xl backdrop-blur-lg bg-white/30 border border-white/40 rounded-2xl shadow-2xl p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          ✨ AI Caption Generator
        </h1>

        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* LEFT - Upload */}
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/60 rounded-xl p-6 hover:border-blue-400 transition">

          <input
            type="file" 
            onChange={handleFileChange}
            className="mb-4 text-sm bg-white/50 rounded-lg p-2 cursor-pointer hover:bg-white/70 transition"
          />

          {!preview && (
            <p className="text-gray-600 text-sm text-center bg-white/50 rounded-lg p-3">
              Drag & drop or upload image
            </p>
          )}

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-56 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !file}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition transform hover:scale-105"
          >
            {loading ? "✨ Generating..." : "Generate Caption"}
          </button>

        </div>

        {/* RIGHT - Caption */}
        <div className="flex-1 flex flex-col justify-center">

          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Generated Caption
          </h2>

          <div className="bg-white/40 backdrop-blur-md p-5 rounded-xl shadow-inner min-h-[120px] flex items-center">

            {loading && (
              <p className="text-gray-500 animate-pulse">
                Generating caption...
              </p>
            )}

            {!loading && !caption && (
              <p className="text-gray-500">
                Your caption will appear here...
              </p>
            )}

            {caption && (
              <p className="text-gray-800 leading-relaxed animate-fadeIn">
                {caption}
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  </div>
);
}