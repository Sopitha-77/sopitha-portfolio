import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Eye, Download, CheckCircle, Calendar, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';
import { certifications } from '../data/constants';

// Import your actual certificate images
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
    textColor: "text-indigo-400",
    description: "Comprehensive fullstack development certification covering frontend and backend technologies"
  },
  {
    title: "Data Analytics and Data Science using Python",
    issuer: "Inlustro",
    year: "2023",
    image: googleAnalytics,
    color: "from-blue-600/80 to-cyan-600/80",
    textColor: "text-blue-400",
    description: "Data analysis and machine learning with Python programming"
  },
  {
    title: "Cyber Security Experts",
    issuer: "Future Calls",
    year: "2022",
    image: ibmDataScience,
    color: "from-emerald-600/80 to-teal-600/80",
    textColor: "text-emerald-400",
    description: "Advanced cybersecurity techniques and threat prevention strategies"
  },
  {
    title: "Cloud Computing",
    issuer: "Nptel",
    year: "2023",
    image: awsCloud,
    color: "from-orange-600/80 to-red-600/80",
    textColor: "text-orange-400",
    description: "Cloud infrastructure, deployment, and management fundamentals"
  }
];

const Certifications = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px as breakpoint for tablet/desktop
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = (index) => {
    console.log(`Card ${index} clicked: ${certificateDetails[index]?.title}`);
    // You can add modal or navigation logic here
  };

  const handleViewCertificate = (index) => {
    const cert = certificateDetails[index];
    if (cert?.image) {
      window.open(cert.image, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadCertificate = (index, e) => {
    e?.stopPropagation();
    const cert = certificateDetails[index];
    if (cert?.image) {
      const link = document.createElement('a');
      link.href = cert.image;
      link.download = `${cert.title.replace(/\s+/g, '_')}_${cert.year}.png`;
      link.click();
    }
  };

  // Mobile carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % certificateDetails.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + certificateDetails.length) % certificateDetails.length);
  };

  return (
    <section id="certifications" className="min-h-screen flex items-center px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-lg sm:blur-xl" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-1 sm:mb-2">
                Certifications
              </h2>
              <p className="text-slate-400 text-sm sm:text-lg">Validated expertise through accredited programs</p>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left Side - CardSwap Animation (Desktop) / Carousel (Mobile) */}
          <div className="lg:w-1/2 relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            {!isMobile ? (
              // Desktop: CardSwap Animation
              <div className="relative h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CardSwap
                    width={300}
                    height={250}
                    cardDistance={25}
                    verticalDistance={35}
                    delay={3500}
                    pauseOnHover={true}
                    skewAmount={4}
                    easing="elastic"
                    onCardClick={handleCardClick}
                  >
                    {certificateDetails.map((cert, index) => (
                      <Card 
                        key={index} 
                        className="group cursor-pointer overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-500"
                      >
                        {/* Certificate Image */}
                        <div className="relative h-48 sm:h-52 overflow-hidden">
                          {cert.image ? (
                            <img 
                              src={cert.image} 
                              alt={cert.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${cert.color} flex items-center justify-center`}>
                              <Award className="w-12 h-12 text-white opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          {/* Year Badge */}
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-600/50">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-300" />
                              <span className="text-xs font-medium text-white">{cert.year}</span>
                            </div>
                          </div>
                          
                          {/* Issuer Badge */}
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-white" />
                              <span className="text-xs font-medium text-white truncate max-w-[80px]">
                                {cert.issuer.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            <button 
                              onClick={(e) => handleDownloadCertificate(index, e)}
                              className="bg-black/70 backdrop-blur-sm p-1.5 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all hover:scale-110 group-hover:bg-black/80"
                              title="Download Certificate"
                              aria-label={`Download ${cert.title} certificate`}
                            >
                              <Download className="w-3.5 h-3.5 text-white" />
                            </button>
                            <button 
                              onClick={() => handleViewCertificate(index)}
                              className="bg-black/70 backdrop-blur-sm p-1.5 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all hover:scale-110 group-hover:bg-black/80"
                              title="View Certificate"
                              aria-label={`View ${cert.title} certificate`}
                            >
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Certificate Info */}
                        <div className="p-3 sm:p-4 flex flex-col">
                          <div className="flex-1 mb-2">
                            <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                              {cert.title}
                            </h3>
                            <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                              {cert.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${cert.textColor} bg-opacity-10`}>
                                <CheckCircle className="w-3 h-3" />
                              </div>
                              <div>
                                <div className="text-xs font-medium text-white truncate max-w-[100px]">
                                  {cert.issuer}
                                </div>
                                <div className="text-xs text-slate-400">Issued {cert.year}</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleViewCertificate(index)}
                              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
                              aria-label={`View full details of ${cert.title}`}
                            >
                              <span>View</span>
                              <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
                </div>
              </div>
            ) : (
              // Mobile: Carousel View
              <div className="relative h-full">
                <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-sm">
                  {/* Carousel Container */}
                  <div 
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {certificateDetails.map((cert, index) => (
                      <div key={index} className="w-full flex-shrink-0">
                        <div className="p-4">
                          {/* Certificate Image */}
                          <div className="relative h-48 w-full overflow-hidden rounded-xl mb-4">
                            {cert.image ? (
                              <img 
                                src={cert.image} 
                                alt={cert.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${cert.color} flex items-center justify-center`}>
                                <Award className="w-16 h-16 text-white opacity-50" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-600/50">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                  <span className="text-xs font-medium text-white">{cert.year}</span>
                                </div>
                              </div>
                              <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <div className="flex items-center gap-1.5">
                                  <Building className="w-3.5 h-3.5 text-white" />
                                  <span className="text-xs font-medium text-white">{cert.issuer}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="absolute bottom-3 right-3 flex gap-2">
                              <button 
                                onClick={(e) => handleDownloadCertificate(index, e)}
                                className="bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all"
                                aria-label={`Download ${cert.title} certificate`}
                              >
                                <Download className="w-4 h-4 text-white" />
                              </button>
                              <button 
                                onClick={() => handleViewCertificate(index)}
                                className="bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all"
                                aria-label={`View ${cert.title} certificate`}
                              >
                                <Eye className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Certificate Info */}
                          <div className="p-3">
                            <h3 className="text-lg font-bold text-white mb-2">
                              {cert.title}
                            </h3>
                            <p className="text-sm text-slate-300 mb-4">
                              {cert.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${cert.textColor} bg-opacity-10`}>
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{cert.issuer}</div>
                                  <div className="text-xs text-slate-400">Issued {cert.year}</div>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleViewCertificate(index)}
                                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
                              >
                                <span>View Full</span>
                                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Navigation */}
                <div className="flex items-center justify-between mt-4">
                  <button 
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {certificateDetails.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentSlide === index 
                            ? 'bg-indigo-500 w-6' 
                            : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                        aria-label={`Go to certificate ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
                    aria-label="Next certificate"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Certificate Details */}
          <div className="lg:w-1/2 space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-br from-slate-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-indigo-500/10 rounded-lg">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Certified Expertise</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {certificateDetails.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-3 sm:p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer active:scale-[0.98]"
                    onClick={() => handleViewCertificate(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewCertificate(index)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${cert.title} certificate details`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${cert.color}/20 border border-slate-700/50 flex-shrink-0`}>
                        <Award className={`w-5 h-5 sm:w-6 sm:h-6 ${cert.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                          <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate text-sm sm:text-base">
                            {cert.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 ${cert.textColor} bg-opacity-20 rounded-full flex items-center gap-1 flex-shrink-0 w-fit`}>
                            <Calendar className="w-3 h-3" />
                            {cert.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                          <span className="text-xs sm:text-sm text-slate-400 truncate">{cert.issuer}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                          {cert.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700/50 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                          <span>Verified Certification</span>
                        </div>
                      </div>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group self-end sm:self-auto">
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

           
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 640px) {
          .text-balance {
            text-wrap: balance;
          }
        }
        
        /* Mobile touch improvements */
        @media (max-width: 1024px) {
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </section>
  );
};

export default Certifications;