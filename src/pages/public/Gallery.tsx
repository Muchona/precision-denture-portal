import { useState } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';
import FadeIn from '../../components/FadeIn';
import SEO from '../../components/SEO';

const galleryItems = [
  {
    src: '/images/gallery/ivoclar-programill-7.jpg',
    title: 'Ivoclar PrograMill 7',
    category: 'CAD/CAM Milling',
    description: "Ireland's first PrograMill 7 5-axis milling machine delivering world-class dental restorations."
  },
  {
    src: '/images/gallery/milled-digital-denture.jpg',
    title: 'Milled Digital Denture',
    category: 'Digital Dentures',
    description: 'Precision milled digital denture in fixture ring showcasing tooth and base bonding.'
  },
  {
    src: '/images/gallery/argenz-zirconia-milled.jpg',
    title: 'ArgenZ HT+ Multilayer Zirconia',
    category: 'Zirconia Milling',
    description: 'Freshly milled monolithic multilayer zirconia arch still held in the disc fixture.'
  },
  {
    src: '/images/gallery/asiga-3d-printer.jpg',
    title: 'Asiga 3D Printing System',
    category: '3D Printing',
    description: 'High-precision 3D printed dental models and arches on the Asiga build platform.'
  },
  {
    src: '/images/gallery/material-changer-discs.jpg',
    title: 'Automated Material Changer',
    category: 'Lab Automation',
    description: 'Multi-disc loader drawer enabling seamless, continuous production across zirconia and PMMA.'
  },
  {
    src: '/images/gallery/milled-bitesplint-occlusal.jpg',
    title: 'Milled Acrylic Bite Splint',
    category: 'Bite Splints',
    description: 'Crystal-clear precision milled acrylic nightguard seated on dental master model.'
  },
  {
    src: '/images/gallery/milled-bitesplint-articulation.jpg',
    title: 'Bite Splint Articulation',
    category: 'Bite Splints',
    description: 'Frontal occlusal articulation check ensuring ideal bite balance and patient comfort.'
  },
  {
    src: '/images/gallery/cad-cam-disc-nesting.jpg',
    title: 'CAD/CAM Disc Nesting',
    category: 'Digital Workflow',
    description: 'Advanced CAM nesting software calculating optimal milling paths and sprue supports.'
  },
  {
    src: '/images/gallery/programill-touchscreen.jpg',
    title: 'PrograMill 7 Interface',
    category: 'CAD/CAM Technology',
    description: 'Intuitive smart interface powering Ireland’s leading digital prosthetic laboratory.'
  }
];

export default function Gallery() {
  const [activeImage, setActiveImage] = useState<typeof galleryItems[0] | null>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const skewY = useTransform(smoothVelocity, [-2000, 0, 2000], [-5, 0, 5]);
  const scale = useTransform(smoothVelocity, [-2000, 0, 2000], [0.97, 1, 0.97]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      <SEO 
        title="Gallery"
        description="Explore our digital dental laboratory and authentic restorations crafted with the Ivoclar PrograMill 7 and Asiga 3D printing."
        keywords="dental lab gallery, precision dental work, ivoclar programill 7 photos, dental laboratory photos ireland"
      />
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden bg-slate-900 border-b border-slate-800">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {galleryItems.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05} direction="up">
                <motion.div 
                  style={{ skewY, scale }}
                  onClick={() => setActiveImage(item)}
                  className="group relative aspect-[4/3] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary-300"
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* Image Modal Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setActiveImage(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            >
              <button 
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
                <img 
                  src={activeImage.src} 
                  alt={activeImage.title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  {activeImage.category}
                </span>
                <h3 className="text-2xl font-bold mt-1 mb-2">{activeImage.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{activeImage.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
