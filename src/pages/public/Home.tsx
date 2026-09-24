import { Link } from 'react-router-dom';
import { ArrowRight, Box, Target, Layers, Settings, ArrowUpRight } from 'lucide-react';
import heroVideo from '../../assets/hero-video.mp4';
import FadeIn from '../../components/FadeIn';
import SEO from '../../components/SEO';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SEO 
        title="Digital Dental Manufacturing Ireland"
        description="Precision Dental Services offers state-of-the-art CAD/CAM dental milling, 3D printing, and digital denture manufacturing for labs and clinics across Ireland."
        keywords="dental laboratory, digital dentistry, dental milling ireland, cad/cam dental, 3D printing dental, precision dental services"
      />
      {/* Hero Section */}
      <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            {/* Left Column: Text Content */}
            <div className="w-full lg:w-5/12 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
              <FadeIn delay={0.1}>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
                  State of the art <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
                    CAD/CAM Technologies
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                  Precision Dental Services supports dental laboratories and clinics in the fabrication of high precision prosthetic restorations using state of the art CAD/CAM Technologies.
                </p>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link 
                    to="/login"
                    className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-base font-medium rounded-xl transition-all shadow-md shadow-primary-500/10 hover:-translate-y-0.5"
                  >
                    Open an Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/products"
                    className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-base font-medium rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
                  >
                    View Products
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Video */}
            <div className="w-full lg:w-7/12 order-1 lg:order-2">
              <FadeIn delay={0.2} direction="left">
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none aspect-[4/3] bg-white rounded-3xl rounded-tl-[100px] sm:rounded-tl-[140px] overflow-hidden shadow-xl border border-slate-200 flex items-center justify-center group">
                  <video 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-[1.05] mix-blend-multiply"
                  >
                    <source src={heroVideo} type="video/mp4" />
                  </video>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* Services/Products Highlights */}
      <section className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Precision Milled & 3D Printed</h2>
              <p className="text-slate-600 text-lg">We offer a wide range of digital manufacturing services to suit your clinical and laboratory needs.</p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <FadeIn delay={0.1}>
              <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] hover:shadow-primary-500/20 hover:-translate-y-2 transition-all duration-500 group h-full">
                {/* Spinning Gradient Border */}
                <div className="absolute -inset-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,theme(colors.primary.500)_50%,transparent_100%)] opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative bg-white h-full w-full rounded-[22px] p-8 z-10 flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Box className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">Zirconia & Metal</h3>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow">High-strength, precision-milled monolithic and layered structures for ultimate durability.</p>
                  <Link to="/products" className="inline-flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700 group/link mt-auto">
                    Learn more <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </FadeIn>
            
            {/* Feature 2 */}
            <FadeIn delay={0.3}>
              <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 group h-full">
                {/* Spinning Gradient Border */}
                <div className="absolute -inset-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,theme(colors.blue.500)_50%,transparent_100%)] opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative bg-white h-full w-full rounded-[22px] p-8 z-10 flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Layers className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">Digital Dentures</h3>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow">Including Ivotion and PMMA milled dentures for a perfect fit and efficient workflow.</p>
                  <Link to="/products" className="inline-flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 group/link mt-auto">
                    Learn more <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </FadeIn>
            
            {/* Feature 3 */}
            <FadeIn delay={0.5}>
              <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-500 group h-full">
                {/* Spinning Gradient Border */}
                <div className="absolute -inset-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,theme(colors.indigo.500)_50%,transparent_100%)] opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative bg-white h-full w-full rounded-[22px] p-8 z-10 flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">3D Printing</h3>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow">Custom Impression Trays, Models, Surgical Guides, and more printed with extreme accuracy.</p>
                  <Link to="/products" className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700 group/link mt-auto">
                    Learn more <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <FadeIn delay={0.2} direction="up">
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-6">
              <Settings className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to upgrade your digital workflow?</h2>
            <p className="text-lg text-slate-600 mb-10">Upload your digital files directly to our secure portal and track your manufacturing orders in real-time.</p>
            <Link 
              to="/login"
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-lg font-medium rounded-xl transition-all shadow-lg"
            >
              Create Your Account Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
