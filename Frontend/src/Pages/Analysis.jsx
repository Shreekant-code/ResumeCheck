import { useEffect, useState } from "react";
import { useAuth } from "../Context/Authtoken";
import { useSnackbar } from "notistack";
import {
  FaCheckCircle,
  FaLightbulb,
  FaExclamationCircle,
  FaEnvelope,
  FaPhone,
  FaYoutube,
  FaGraduationCap,
  FaBriefcase
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaPython } from "react-icons/fa";
import { SiMongodb, SiRedux, SiTailwindcss } from "react-icons/si";

const COLORS = ["#6366F1", "#EF4444", "#FBBF24", "#22C55E"]; // Added green for new metric

export const Analysis = () => {
  const { axiosInstance } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const skillIcons = {
    "ReactJS": <FaReact className="inline text-blue-400 mr-1" />,
    "Node.js": <FaNodeJs className="inline text-green-500 mr-1" />,
    "JavaScript (ES6+)": <FaJsSquare className="inline text-yellow-400 mr-1" />,
    "HTML5": <FaHtml5 className="inline text-orange-500 mr-1" />,
    "CSS3": <FaCss3Alt className="inline text-blue-600 mr-1" />,
    "Python": <FaPython className="inline text-blue-300 mr-1" />,
    "MongoDB": <SiMongodb className="inline text-green-600 mr-1" />,
    "Redux": <SiRedux className="inline text-purple-600 mr-1" />,
    "TailwindCSS": <SiTailwindcss className="inline text-teal-400 mr-1" />,
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axiosInstance.get("/resume", { withCredentials: true });
        setResume(res.data.resume);
      } catch (err) {
        console.error(err);
        enqueueSnackbar(err.response?.data?.message || "Failed to fetch resume", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse text-indigo-500 text-4xl mb-4">🔍 Scanning Resume...</div>
        <p className="text-gray-400">Analyzing content, extracting ATS metrics...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        No resume found. Please upload first.
      </div>
    );
  }

 
  const metrics = [
    { name: "ATS Score", value: resume.atsScore, color: COLORS[0] },
    { name: "Weaknesses", value: Math.min(resume.weaknesses.length * 10, 100), color: COLORS[1] },
    { name: "Overall", value: resume.overallScore, color: COLORS[2] },
    { name: "Skills Match", value: resume.skillsMatchPercentage || 0, color: COLORS[3] } // 🟢 new metric
  ];

  const renderDonut = (data) => (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={[{ name: data.name, value: data.value }, { name: "remaining", value: 100 - data.value }]}
          innerRadius={70}
          outerRadius={100}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          isAnimationActive={true}
          paddingAngle={2}
        >
          <Cell key="filled" fill={data.color} />
          <Cell key="empty" fill="#1F2937" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400 flex items-center justify-center gap-2">
        Resume Analysis <FaCheckCircle className="text-green-400 animate-bounce" />
      </h1>

      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg max-w-6xl mx-auto space-y-8">

        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-200">
          <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-indigo-400 font-semibold">Name:</span> {resume.text.split(' ')[0]} {resume.text.split(' ')[1]}
          </div>
          <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-indigo-400 font-semibold flex items-center gap-2"><FaEnvelope /> Email:</span> {resume.email}
          </div>
          <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-indigo-400 font-semibold flex items-center gap-2"><FaPhone /> Phone:</span> {resume.phone}
          </div>
        </div>

        {/* Education + Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200">
          <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-indigo-400 font-semibold flex items-center gap-2"><FaGraduationCap /> Education:</span>
            <p>{resume.education || "N/A"}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-indigo-400 font-semibold flex items-center gap-2"><FaBriefcase /> Experience:</span>
            <p>{resume.experience || "No professional experience"}</p>
          </div>
        </div>

       
        {resume.youtubeLinks?.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <h3 className="text-indigo-400 font-semibold mb-2">Suggested Video for this Resume</h3>
           <div className="flex flex-wrap gap-3">
  {resume.youtubeLinks.map((link, idx) => (
    <a
      key={idx}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors max-w-full break-all bg-gray-900/40 px-3 py-2 rounded-lg"
    >
      <FaYoutube className="flex-shrink-0" />
      <span className="truncate sm:whitespace-normal">{link}</span>
    </a>
  ))}
</div>

          </div>
        )}

        {/* Donut Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center relative">
              {renderDonut(metric)}
              <div className="absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold text-white">{metric.value}%</span>
                <p className="text-gray-300 text-sm">{metric.name}</p>
              </div>
            </div>
          ))}
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-indigo-400 font-semibold mb-2">Skills</h3>
            <ul className="list-disc list-inside">
              {resume.skills?.length ? resume.skills.map((s, idx) => (
                <li key={idx}>{skillIcons[s] || null}{s}</li>
              )) : <li>None</li>}
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-1">
              <FaLightbulb /> Strengths
            </h3>
            <ul className="list-disc list-inside">
              {resume.strengths?.length ? resume.strengths.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-1">
              <FaExclamationCircle /> Weaknesses
            </h3>
            <ul className="list-disc list-inside">
              {resume.weaknesses?.length ? resume.weaknesses.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
            </ul>
          </div>
        </div>

        
        {resume.suggestions?.length > 0 && (
          <div className="bg-gray-900 p-6 rounded-3xl">
            <h3 className="text-indigo-400 font-bold mb-6 text-xl flex items-center gap-3">
              💡 Suggestions for Improvement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resume.suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 hover:shadow-indigo-500/50 transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-indigo-400 text-2xl animate-pulse">💫</span>
                    <h4 className="text-white font-semibold text-base tracking-wide">
                      Suggestion #{idx + 1}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
