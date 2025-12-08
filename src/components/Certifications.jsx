import React from 'react';
import { Award, ExternalLink, Eye, Download, CheckCircle, Calendar, Building } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';
import { certifications } from '../data/constants';

// Import your actual certificate images - Update these paths according to your actual certificates
import metaFrontend from '../assets/fullstack.png';
import googleAnalytics from '../assets/dataanalytics.png';
import ibmDataScience from '../assets/cyber.png';
import awsCloud from '../assets/cloud.png';

// Certificate details with images, years, and descriptions
const certificateDetails = [
  {
    title: "Fullstack Development",
    issuer: "Imarticus Learning",
    year: "2024",
    image: metaFrontend,
    color: "from-indigo-600/80 to-purple-600/80",
    textColor: "text-indigo-400"
  },
  {
    title: "Data Analytics and Data science using python",
    issuer: "Inlustro",
    year: "2023",
    image: googleAnalytics,
    color: "from-blue-600/80 to-cyan-600/80",
    textColor: "text-blue-400"
  },
  {
    title: "Cyber Security Experts",
    issuer: "Future Calls",
    year: "2022",
    image: ibmDataScience,
    color: "from-emerald-600/80 to-teal-600/80",
    textColor: "text-emerald-400"
  },
  {
    title: "Cloud Computing",
    issuer: "Nptel",
    year: "2023",
    image: awsCloud,
    color: "from-orange-600/80 to-red-600/80",
    textColor: "text-orange-400"
  }
];

const Certifications = () => {
  const handleCardClick = (index) => {
    console.log(`Card ${index} clicked: ${certifications[index]}`);
    // You can add modal or navigation logic here
  };

  const handleViewCertificate = (index) => {
    const cert = certificateDetails[index];
    // Open certificate image in new tab or show modal
    if (cert.image) {
      window.open(cert.image, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadCertificate = (index, e) => {
    e.stopPropagation();
    const cert = certificateDetails[index];
    if (cert.image) {
      const link = document.createElement('a');
      link.href = cert.image;
      link.download = `${cert.title.replace(/\s+/g, '_')}_${cert.year}.png`;
      link.click();
    }
  };

  return (
    <section id="certifications" className="min-h-screen flex items-center px-4 sm:px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl" />
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                Certifications
              </h2>
              <p className="text-slate-400 text-lg">Validated expertise through accredited programs</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - CardSwap Animation */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-[500px] sm:h-[600px] flex items-center justify-center">
              {/* CardSwap Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CardSwap
                  width={350}
                  height={280}
                  cardDistance={35}
                  verticalDistance={45}
                  delay={3500}
                  pauseOnHover={true}
                  skewAmount={6}
                  easing="elastic"
                  onCardClick={handleCardClick}
                >
                  {certificateDetails.map((cert, index) => (
                    <Card 
                      key={index} 
                      className="group cursor-pointer overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-500"
                    >
                      {/* Certificate Image */}
                      <div className="relative h-60 overflow-hidden">
                        {cert.image ? (
                          <img 
                            src={cert.image} 
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${cert.color} flex items-center justify-center`}>
                            <Award className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Year Badge */}
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-600/50">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-xs font-medium text-white">{cert.year}</span>
                          </div>
                        </div>
                        
                        {/* Issuer Badge */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-white" />
                            <span className="text-xs font-medium text-white">{cert.issuer.split(' ')[0]}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadCertificate(index, e);
                            }}
                            className="bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all hover:scale-110 group-hover:bg-black/80"
                            title="Download Certificate"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                          <button 
                            onClick={() => handleViewCertificate(index)}
                            className="bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all hover:scale-110 group-hover:bg-black/80"
                            title="View Certificate"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Certificate Info */}
                      <div className="p-4 flex flex-col">
                        <div className="flex-1 mb-3">
                          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                            {cert.title}
                          </h3>
                          <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                            {cert.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${cert.textColor} bg-opacity-10`}>
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-white">{cert.issuer}</div>
                              <div className="text-xs text-slate-400">Issued {cert.year}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewCertificate(index)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
                          >
                            <span>View Full</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>

              {/* Floating Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-float"
                    style={{
                      left: `${(i * 20) % 100}%`,
                      top: `${Math.sin(i * 0.5) * 50 + 50}%`,
                      animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Certificate Details */}
          <div className="lg:w-1/2 space-y-8">
            <div className="bg-gradient-to-br from-slate-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg">
                  <Award className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Certified Expertise</h3>
              </div>
            
              
              <div className="space-y-4">
                {certificateDetails.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleViewCertificate(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${cert.color}/20 border border-slate-700/50 flex-shrink-0`}>
                        <Award className={`w-6 h-6 ${cert.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                            {cert.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 ${cert.textColor} bg-opacity-20 rounded-full flex items-center gap-1 flex-shrink-0 ml-2`}>
                            <Calendar className="w-3 h-3" />
                            {cert.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-sm text-slate-400">{cert.issuer}</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {cert.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          <span>Verified Certification</span>
                        </div>
                      </div>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group">
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>
        </div>

        {/* Mobile Grid View (for smaller screens) */}
        <div className="mt-16 lg:hidden">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">All Certifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificateDetails.map((cert, index) => (
              <div 
                key={index}
                className="p-5 bg-gradient-to-br from-slate-900/50 to-black/50 backdrop-blur-sm rounded-xl border border-slate-700/50 group cursor-pointer"
                onClick={() => handleViewCertificate(index)}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${cert.color}/20 border border-slate-700/50`}>
                    <Award className={`w-6 h-6 ${cert.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {cert.title.split('(')[0]}
                      </h4>
                      <span className={`text-xs px-2 py-1 ${cert.textColor} bg-opacity-20 rounded-full`}>
                        {cert.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span className="text-sm text-slate-400">{cert.issuer}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-3">{cert.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-slate-400">Verified</span>
                  </div>
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group">
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;