import React from 'react';
import { GraduationCap, Award, MapPin, Calendar, School, Trophy, Sparkles } from 'lucide-react';

// StarBorder component
const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="relative z-1 bg-gradient-to-b from-black to-gray-900 border border-gray-800 text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px]">
        {children}
      </div>
    </Component>
  );
};

const About = () => {
  return (
    <section id="about" className="min-h-screen flex items-center px-6 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with decorative elements */}
        <div className="flex items-center gap-4 mb-12 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Introduction */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative p-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Frontend Developer skilled in React, JavaScript, and UI/UX design, with hands-on experience in creating responsive and user-friendly web interfaces.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative p-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    I enjoy building clean, modern designs and improving user experience through thoughtful development. Seeking an opportunity to contribute to real-time projects, learn from industry challenges, and grow as a developer.
                  </p>
                </div>
              </div>
            </div>
            
           
          </div>
          
          {/* Right Column - Education & Location Cards */}
          <div className="space-y-8">
            {/* Education Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-8 bg-gradient-to-br from-slate-900 to-gray-900/90 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full translate-x-10 translate-y-10"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text">
                          Education
                        </h3>
                        <p className="text-sm text-gray-400">Academic Journey</p>
                      </div>
                    </div>
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <School className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Degree */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <span className="text-indigo-400 font-bold">B.E</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100">Computer Science Engineering</h4>
                        <p className="text-sm text-gray-400">Bachelor of Engineering</p>
                      </div>
                    </div>
                    
                    {/* University */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <School className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100">VISTAS, Chennai</h4>
                        <p className="text-sm text-gray-400">Vels Institute of Science, Technology & Advanced Studies</p>
                      </div>
                    </div>
                    
                    {/* Performance & Duration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-400">CGPA</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                            8.5
                          </span>
                          <span className="text-sm text-gray-500">/10.0</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-cyan-500" />
                          <span className="text-sm text-gray-400">Duration</span>
                        </div>
                        <div className="text-xl font-bold text-gray-100">2021–2025</div>
                        <p className="text-xs text-gray-500 mt-1">4 Years Program</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;