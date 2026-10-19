import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Play, Pause, Maximize2, Sparkles } from 'lucide-react';
import FadeIn from '../../components/FadeIn';
import SEO from '../../components/SEO';

export default function About() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SEO 
        title="About Us"
        description="Learn about Precision Dental Services, Ireland's premier digital dental laboratory utilizing industry-leading Ivoclar PrograMill 7 technology."
        keywords="dental lab about us, ivoclar programill 7 ireland, dental technicians monaghan, precision dental team"
      />
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden bg-slate-900 border-b border-slate-800">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1} direction="up">
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 leading-tight">
                About <span className="text-sky-400">Precision Dental Services</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
                <p className="text-xl text-slate-300 leading-relaxed">
                  With decades of experience in the field of dental technology, Precision Dental services has invested in the latest world class CAD/CAM technology to collaborate with Dental Laboratories and clinics to achieve a high quality digital workflow.
                </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <FadeIn delay={0.1}>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Commitment to Quality</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  We are the first company in Ireland to take delivery of the new Ivoclar Programill 7 milling machine that can produce an unbeatable standard of digital dentures.
                </p>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Our team consists of highly skilled dental technicians who bridge the gap between cutting-edge digital capabilities and traditional dental artistry.
                </p>
              </FadeIn>

              <div className="space-y-6">
                <FadeIn delay={0.3} direction="right">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Expert Craftsmanship</h4>
                      <p className="text-slate-600">Decades of combined experience ensuring optimal functional and aesthetic results.</p>
                    </div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.5} direction="right">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Premium Materials</h4>
                      <p className="text-slate-600">We source only the highest quality, CE-certified materials for all our fabrications.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* High-Tech Video Showcase */}
            <div className="order-1 lg:order-2">
              <FadeIn delay={0.2} direction="left">
                <div 
                  ref={containerRef}
                  className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group bg-slate-900"
                >
                  <video 
                    ref={videoRef}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src="/videos/ivoclar-programill-showcase.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Floating Live Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Ivoclar PrograMill 7 in Action
                  </div>

                  {/* Interactive Play/Pause & Fullscreen Controls */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900/95 backdrop-blur-md text-white transition-all hover:scale-105 border border-white/20 shadow-md cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label="Fullscreen"
                      className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900/95 backdrop-blur-md text-white transition-all hover:scale-105 border border-white/20 shadow-md cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Glassmorphic Caption Bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-6 z-20 flex flex-col justify-end pointer-events-none">
                    <p className="text-white font-bold text-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-400" /> World Class Milling Technology
                    </p>
                    <p className="text-slate-300 text-sm mt-0.5">Ireland's premier 5-axis digital dental fabrication</p>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <FadeIn delay={0.2} direction="up">
        <section className="py-20 bg-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">Experience the Precision Difference</h2>
            <p className="text-slate-400 text-lg mb-8">View our extensive range of milled and printed products, or open an account to get started.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products" className="w-full sm:w-auto text-center px-6 py-3 lg:px-8 lg:py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                Our Products
              </Link>
              <Link to="/login" className="w-full sm:w-auto justify-center px-6 py-3 lg:px-8 lg:py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/20">
                Open Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
