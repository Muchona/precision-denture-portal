import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import FadeIn from '../../components/FadeIn';
import SEO from '../../components/SEO';
import { useState } from 'react';
import { notify } from '../../lib/notify';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const result = await response.json();
      if (result.success) {
        setIsSent(true);
      } else {
        notify.error("Something went wrong.");
      }
    } catch (error) {
      notify.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SEO 
        title="Contact Us"
        description="Get in touch with Precision Dental Services in Monaghan. Contact us today to discuss your digital dental manufacturing needs or to open an account."
        keywords="contact precision dental, dental lab monaghan, dental clinic contact, dental manufacturing ireland"
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
                Contact <span className="text-sky-400">Us</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <p className="text-xl text-slate-300 leading-relaxed">
                Get in touch with Precision Dental Services. We're here to support your digital dentistry needs.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <FadeIn delay={0.3} direction="right">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Get in Touch</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0 group">
                      <Phone className="w-7 h-7 text-primary-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Phone</h4>
                      <p className="text-slate-600 text-lg">
                        <a href="tel:+353871887583" className="hover:text-primary-600 hover:underline underline-offset-4 decoration-primary-500/30 transition-all">087 188 7583</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group">
                      <Mail className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Email</h4>
                      <p className="text-slate-600 text-lg">
                        <a href="mailto:info@precisiondental.ie" className="hover:text-blue-600 hover:underline underline-offset-4 decoration-blue-500/30 transition-all">info@precisiondental.ie</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 group">
                      <MapPin className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Address</h4>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        <a href="https://maps.google.com/?q=37+Glaslough+Street,+Monaghan,+Ireland" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline underline-offset-4 decoration-indigo-500/30 transition-all block">
                          Precision Dental Services<br />
                          37 Glaslough Street<br />
                          Monaghan, Co. Monaghan<br />
                          Ireland<br />
                          H18 A096
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0 group">
                      <Clock className="w-7 h-7 text-teal-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Hours</h4>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        Monday - Friday<br />
                        9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={0.4} direction="left" className="h-full">
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 h-full">
              
              {isSent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 min-h-[400px]">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Message Sent!</h3>
                  <p className="text-slate-500 text-lg mb-8 max-w-sm">
                    Thank you for reaching out. We have received your message and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSent(false)} 
                    className="px-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="access_key" value="151cd373-85c6-4275-be6c-0aa913d84551" />
                    <input type="hidden" name="subject" value="New Contact Form Submission - Precision Dental" />
                    <input type="hidden" name="from_name" value="Precision Dental Portal" />
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        id="message"
                        rows={6}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <FadeIn delay={0.2} direction="up">
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden">
              <div className="w-full h-[400px] rounded-[20px] overflow-hidden">
                <iframe 
                  title="Precision Dental Services Location"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  referrerPolicy="no-referrer-when-downgrade" 
                  src="https://maps.google.com/maps?q=37+Glaslough+Street,+Monaghan,+Ireland+(Precision+Dental+Services)&t=&z=16&ie=UTF8&iwloc=&output=embed">
                </iframe>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

    </div>
  );
}
