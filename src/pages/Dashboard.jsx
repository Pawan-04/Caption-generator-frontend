import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDropzone } from "react-dropzone";
import Webcam from "react-webcam";
import { toast } from "react-hot-toast";
import { 
  LogOut, UploadCloud, Camera, ImagePlus, Loader2, 
  Sparkles, X, Zap, ShieldCheck, Clock, User
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [username, setUsername] = useState("Creator");
  
  const webcamRef = useRef(null);

  useEffect(() => {
    api.get("/auth/check")
      .then((res) => {
         if(res.data?.user?.username) setUsername(res.data.user.username);
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setCaption(""); 
      setIsCameraOpen(false); 
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false
  });

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const capturedFile = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
          setFile(capturedFile);
          setPreview(URL.createObjectURL(capturedFile));
          setCaption("");
          setIsCameraOpen(false);
        });
    }
  }, [webcamRef]);

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please select or capture an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/post/create", formData);
      setCaption(res.data.post.caption);
      toast.success("Caption generated successfully!");
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Error generating caption");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
    }
    navigate("/");
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setIsCameraOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Sparkles size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CapGen AI</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                <User size={16} />
                {username}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Hero Section */}
        <div className="mb-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-32 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Welcome to the Ultimate Caption Studio
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Transform your visual content into engaging stories. Our industry-leading AI analyzes your images to generate highly relevant, engaging, and creative captions perfect for any social media platform in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Zap size={14} /> Lightning Fast
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                <ShieldCheck size={14} /> Highly Accurate
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                <Clock size={14} /> 24/7 Availability
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Info (3 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">How it Works</h3>
              <ol className="relative border-l border-slate-200 ml-3 space-y-6">                  
                <li className="pl-6 relative">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-4 ring-white text-indigo-600 font-bold text-xs">1</span>
                  <h4 className="font-semibold text-slate-800 text-sm">Upload Image</h4>
                  <p className="text-sm text-slate-500 mt-1">Drag & drop a photo or snap one using your webcam.</p>
                </li>
                <li className="pl-6 relative">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-4 ring-white text-indigo-600 font-bold text-xs">2</span>
                  <h4 className="font-semibold text-slate-800 text-sm">AI Analysis</h4>
                  <p className="text-sm text-slate-500 mt-1">Our models analyze the context, objects, and mood.</p>
                </li>
                <li className="pl-6 relative">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-4 ring-white text-indigo-600 font-bold text-xs">3</span>
                  <h4 className="font-semibold text-slate-800 text-sm">Get Caption</h4>
                  <p className="text-sm text-slate-500 mt-1">Copy your new caption and share it with the world!</p>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
               <Sparkles size={32} className="mb-4 text-indigo-200" />
               <h3 className="text-lg font-bold mb-2">Pro Tip</h3>
               <p className="text-indigo-100 text-sm leading-relaxed">
                 High-resolution images with clear subjects yield the most creative and accurate captions. Try uploading a scenic landscape or a clear portrait!
               </p>
            </div>

          </div>

          {/* Right Workspace (8 columns) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 h-full">
              
              <div className="flex flex-col md:flex-row gap-6 h-full">
                
                {/* Image Input Area */}
                <div className="flex-1 flex flex-col gap-4">
                  {!preview && !isCameraOpen && (
                    <div 
                      {...getRootProps()} 
                      className={`flex-1 min-h-[350px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer group ${
                        isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <UploadCloud size={36} />
                      </div>
                      <h3 className="text-slate-800 font-bold text-lg mb-1 text-center">
                        {isDragActive ? "Drop to Upload" : "Upload your Image"}
                      </h3>
                      <p className="text-slate-500 text-sm text-center mb-6 px-4">
                        Drag and drop your file here, or click to browse your computer
                      </p>
                      
                      <div className="flex items-center gap-4 w-full max-w-xs mb-6">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">OR</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setIsCameraOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 w-full max-w-xs py-2.5 px-4 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-semibold"
                      >
                        <Camera size={18} />
                        Use Web Camera
                      </button>
                    </div>
                  )}

                  {isCameraOpen && !preview && (
                    <div className="flex-1 flex flex-col items-center border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-900 relative min-h-[350px]">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                      />
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        <span className="animate-pulse inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Camera Active
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
                        <button
                          onClick={() => setIsCameraOpen(false)}
                          className="flex items-center gap-2 bg-white/90 backdrop-blur text-slate-800 px-4 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-sm"
                        >
                          <X size={18} /> Cancel
                        </button>
                        <button
                          onClick={capturePhoto}
                          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg text-sm"
                        >
                          <Camera size={18} /> Capture Photo
                        </button>
                      </div>
                    </div>
                  )}

                  {preview && (
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-1 min-h-[350px]">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          onClick={clearSelection}
                          className="flex items-center gap-2 bg-white/95 backdrop-blur text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all transform translate-y-4 group-hover:translate-y-0 shadow-xl"
                        >
                          <ImagePlus size={18} /> Replace Image
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !file}
                    className="w-full flex items-center justify-center py-4 px-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-md text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-3" size={20} />
                        Analyzing via AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 text-indigo-400" size={20} />
                        Generate Caption
                      </>
                    )}
                  </button>
                </div>

                {/* Output Area */}
                <div className="flex-1 flex flex-col">
                  <div className={`flex-1 rounded-2xl border ${caption ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'} p-6 flex flex-col relative overflow-hidden transition-colors duration-500`}>
                    
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Sparkles size={16} /> Result Output
                    </h3>

                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                      {loading ? (
                        <div className="flex flex-col items-center text-indigo-600 w-full max-w-xs mx-auto">
                          <Loader2 className="animate-spin mb-4" size={40} />
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4 overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse w-2/3"></div>
                          </div>
                          <p className="text-sm font-medium text-slate-500 animate-pulse text-center">
                            Extracting context and generating creative copy...
                          </p>
                        </div>
                      ) : !caption ? (
                        <div className="flex flex-col items-center text-slate-400 text-center">
                          <div className="bg-slate-100 p-4 rounded-full mb-4 shadow-inner">
                            <Sparkles size={28} className="text-slate-300" />
                          </div>
                          <p className="text-base font-medium text-slate-500">
                            Awaiting Image Input
                          </p>
                          <p className="text-sm mt-1 max-w-xs">
                            Upload an image and hit generate to see the AI magic.
                          </p>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 relative mb-6">
                            <Sparkles className="absolute -top-3 -left-3 text-yellow-400 fill-current" size={24} />
                            <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-medium">
                              "{caption}"
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(caption);
                              toast.success("Copied to clipboard!");
                            }}
                            className="w-full py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors flex justify-center items-center gap-2"
                          >
                            Copy Caption
                          </button>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}