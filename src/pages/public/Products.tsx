import { Info, Box, Layers, Printer, Target } from 'lucide-react';
import FadeIn from '../../components/FadeIn';
import SEO from '../../components/SEO';

export default function Products() {
  const milledPMMA = [
    { name: 'Oversized milled digital denture', price: '€150 per denture', description: 'Oversize Process: The denture base and denture teeth are separately milled but not final milled. This allows the teeth to be bonded to the base and returned to the mill for final milling. The final mill precisely removes excess bonding material and finishes the milling process.' },
    { name: 'Ivoclar Oversized Milled Denture', price: '€280 per denture' },
    { name: 'Vita Vionic Digital Denture', price: '€300 per denture' },
    { name: 'Ivoclar Ivotion Milled Denture', price: '€240 per denture', description: 'The Ivotion disc contains both the tooth and base in one disc. The disc is placed in the mill to conduct one uninterrupted milling process.' },
    { name: 'Milled Denture Base only', price: '€80' },
    { name: 'Milled Tooth Arch only', price: '€40' },
    { name: 'Milled Acrylic Bitesplint', price: '€100' },
    { name: 'Acetal Framework', price: '€120' },
    { name: 'Acetal Clasps', price: '€20 per clasp' },
    { name: 'Temporary PMMA Restoration', price: '€20 per unit' }
  ];

  const zirconia = [
    { name: 'IPS e.max monolithic', price: '€35' },
    { name: 'IPS e.max Prime', price: '€40' },
    { name: 'IPS e.max Prime Aesthetic', price: '€40' },
    { name: 'Argen Ultra', price: '€30' },
    { name: 'Argen HT+', price: '€35' },
    { name: 'Argen HT+ Multilayer', price: '€40' },
    { name: 'Katana YML', price: '€40' }
  ];

  const lithiumDisilicate = [
    { name: 'Emax', price: '€80' },
    { name: 'Vita Enamic', price: '€80' }
  ];

  const printing = [
    { name: 'Tryin', price: '€50' },
    { name: 'Custom Impression Tray', price: '€15' },
    { name: 'Model', price: '€25' },
    { name: 'Model Die', price: '€6 per unit' },
    { name: 'Surgical Guide', price: '€80' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SEO 
        title="Products & Pricing"
        description="View our extensive range of high-precision milled and 3D printed prosthetic restorations, including Zirconia, PMMA, and digital dentures."
        keywords="dental milling prices, zirconia crowns ireland, digital dentures cost, dental 3D printing prices"
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
                Products <span className="text-sky-400">&</span> Pricing
              </h1>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <p className="text-xl text-slate-300 leading-relaxed">
                High precision prosthetic restorations manufactured to your exact designs.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
            <Info className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-primary-900 mb-2">Manufacturing Only Approach</h3>
              <p className="text-primary-800 text-sm leading-relaxed mb-3">
                All of our products are provided <strong>manufactured only</strong>. This is to allow laboratories and clinics to add their own personal artistic finishing touches to the restoration. All restorations will be manufactured strictly to your submitted designs.
              </p>
              <ul className="text-sm text-primary-700 space-y-1 list-disc list-inside">
                <li><strong>Zirconia</strong> will be supplied un-sintered (green state).</li>
                <li><strong>Lithium Disilicate</strong> will be not crystalized.</li>
                <li><strong>PMMA</strong> will be unpolished.</li>
                <li><strong>Printed Products</strong> will be cured but not trimmed/polished.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Milled PMMA */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Box className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Milled PMMA</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {milledPMMA.map((item, i) => (
                  <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        {item.description && (
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                      <span className="font-bold text-primary-600 whitespace-nowrap">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* Zirconia */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Zirconia</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {zirconia.map((item, i) => (
                    <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <span className="font-bold text-primary-600">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lithium Disilicate */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Lithium Disilicate</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {lithiumDisilicate.map((item, i) => (
                    <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <span className="font-bold text-primary-600">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Printing */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <Printer className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Printing</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {printing.map((item, i) => (
                    <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <span className="font-bold text-primary-600">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
