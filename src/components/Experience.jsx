import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, Zap, ExternalLink, Code, Palette, Monitor, Smartphone, Users } from 'lucide-react';
import { experiences } from '../data/constants';
import ElectricBorder from './ElectricBorder';

const Experience = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Different colors for each experience card
  const experienceColors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#10b981', // Emerald
  ];

  // Different electric border colors for variation
  const electricColors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple  
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#10b981', // Green
  ];

  // Skills for each experience
  const experienceSkills = [
    ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'React', 'Figma', 'UI/UX'], // Frontend Developer Intern
    ['HTML', 'CSS', 'JavaScript', 'Figma'], // Web Developer Intern
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center px-4 sm:px-6 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
              <Briefcase className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Experience
              </h2>
              <p className="text-lg text-gray-400 mt-2">Professional journey and career milestones</p>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/20 via-purple-500/20 to-transparent" />

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              const electricColor = electricColors[idx % electricColors.length];
              const cardColor = experienceColors[idx % experienceColors.length];
              const skills = experienceSkills[idx] || [];

              return (
                <div 
                  key={idx}
                  className={`relative ${isEven ? 'md:pr-1/2 md:pl-0' : 'md:pl-1/2 md:pr-0'} pl-16 md:pl-0`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-6 z-10">
                    <div className="relative">
                      <div className={`w-4 h-4 rounded-full border-2 border-white/20 ${hoveredIndex === idx ? 'scale-125' : ''} transition-transform duration-300`}
                           style={{ backgroundColor: cardColor + '40' }} />
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"
                           style={{ borderColor: cardColor }} />
                    </div>
                  </div>

                  {/* Electric Border Card */}
                  <div className={`relative ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                    <ElectricBorder
                      color={electricColor}
                      speed={0.7 + idx * 0.1}
                      chaos={0.7}
                      thickness={2}
                      className="transition-all duration-500 hover:scale-[1.02]"
                      style={{ 
                        borderRadius: '20px',
                        opacity: hoveredIndex === idx ? 1 : 0.9,
                        transform: hoveredIndex === idx ? 'translateY(-5px)' : 'none'
                      }}
                    >
                      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: cardColor + '20' }}>
                                <Briefcase className="w-5 h-5" style={{ color: cardColor }} />
                              </div>
                              <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                  {exp.role}
                                </h3>
                                <p className="text-lg text-gray-300">{exp.company}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>{exp.period}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>{exp.type}</span>
                              </div>
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className="px-4 py-2 bg-black/40 backdrop-blur-sm border border-slate-700/50 rounded-xl">
                            <span className="text-sm font-medium" style={{ color: cardColor }}>
                              {exp.type}
                            </span>
                          </div>
                        </div>

                        {/* Responsibilities */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            Key Responsibilities & Achievements
                          </h4>
                          <ul className="space-y-3">
                            {exp.points.map((point, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-300 group/item">
                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${hoveredIndex === idx ? 'scale-125' : ''}`}
                                     style={{ backgroundColor: cardColor }} />
                                <span className="group-hover/item:text-white transition-colors">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Skills Tags */}
                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                          <h5 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Technologies & Tools
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1.5 text-xs font-medium rounded-full bg-black/40 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105"
                                style={{ 
                                  color: hoveredIndex === idx ? cardColor : '#9ca3af',
                                  borderColor: hoveredIndex === idx ? cardColor + '50' : 'rgba(100, 116, 139, 0.3)'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ElectricBorder>

                    {/* Connection Line */}
                    <div className={`absolute top-6 ${isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} hidden md:block`}>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full animate-float"
              style={{
                background: `linear-gradient(90deg, ${electricColors[i % electricColors.length]}, transparent)`,
                left: `${(i * 15) % 100}%`,
                top: `${Math.sin(i * 0.5) * 50 + 50}%`,
                animation: `float ${4 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.3
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;