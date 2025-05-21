import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-24">
          {/* Hero text */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Bridge the Gap Between{" "}
              <span className="text-indigo-600">Learning</span> and{" "}
              <span className="text-indigo-600">Helping</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with peers. Share skills. Grow together.
            </p>
            <div className="flex space-x-4">
              <button onClick={()=> (navigate('/signup'))} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300">
                Get Started
              </button>
              <button onClick={()=> (navigate('/login'))} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-300">
                Login
              </button>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="md:w-1/2 flex justify-center">
            <div className="rounded-xl p-8 w-full max-w-md h-64 md:h-80 flex items-center justify-center mt-10">
              {/* <span className="text-indigo-400 text-lg">Illustration of students collaborating</span> */}
              <img src="src\assets\students collbrating.jpg" alt="" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
