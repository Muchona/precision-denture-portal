import { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import FadeIn from '../../components/FadeIn';
import SEO from '../../components/SEO';

export default function Gallery() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth the velocity to prevent jagged skewing
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map velocity to a skew angle. When scrolling fast down, it skews positive; scrolling fast up skews negative.
  const skewY = useTransform(smoothVelocity, [-2000, 0, 2000], [-8, 0, 8]);
  // Add a subtle scale effect based on absolute velocity
  const scale = useTransform(smoothVelocity, [-2000, 0, 2000], [0.95, 1, 0.95]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      <SEO 
        title="Gallery"
        description="View our gallery of precision dental work and state-of-the-art laboratory facility."
        keywords="dental lab gallery, precision dental work, dental laboratory photos"
      />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-slate-900 border-b border-slate-800">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1} direction="up">
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 leading-tight">
                Our <span className="text-sky-400">Gallery</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                A showcase of our world-class digital dental laboratory and the precision restorations we craft every day.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <FadeIn key={index} delay={index * 0.1} direction="up">
                <motion.div 
                  style={{ skewY, scale }}
                  className="group relative aspect-[4/3] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-shadow hover:shadow-md hover:border-primary-200"
                >
                  <div className="absolute inset-0 bg-slate-50/50"></div>
                  <div className="relative z-10 flex flex-col items-center text-slate-400 p-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-medium text-slate-600 mb-1">Image Coming Soon</p>
                    <p className="text-sm text-slate-500">We are currently updating our gallery with new photos.</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
