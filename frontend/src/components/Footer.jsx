import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Footer = () => {
  const { content } = useContent();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const contact = content?.contact || {
    email: "Mayuroffficial@gmail.com",
    phone: "+91 7017975034",
    address: "Roorkee, Uttarakhand, India"
  };

  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          message: formData.message
        }),
      });

      if (response.ok) {
        setStatus({ type: 'success', text: 'Message sent successfully!' });
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', text: errorData.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Server error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <footer id="contact" className="bg-zinc-950 text-white border-t border-zinc-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* Contact Content CTA */}
          <div>
            <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-sm uppercase mb-4">Get In Touch</h4>
            <h2 className="text-4xl sm:text-6xl font-serif mb-8 leading-tight">
              Have a Project in <span className="text-[#DAA520] italic">Mind?</span>
            </h2>
            <p className="text-gray-400 font-sans text-lg mb-12 max-w-md">
              Whether you need architecture, interior design, or urban planning, Alpine Architecture Studios is ready to build your vision.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-[#DAA520] transition-colors">
                  <MapPin className="text-[#DAA520]" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-sans uppercase tracking-widest">Address</p>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-serif text-lg hover:text-[#DAA520] transition-colors decoration-[#DAA520]/30 underline-offset-4 hover:underline"
                  >
                    {contact.address}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-[#DAA520] transition-colors">
                  <Phone className="text-[#DAA520]" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-sans uppercase tracking-widest">Phone</p>
                  <a 
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`} 
                    className="font-serif text-lg hover:text-[#DAA520] transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-[#DAA520] transition-colors">
                  <Mail className="text-[#DAA520]" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-sans uppercase tracking-widest">Email</p>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="font-serif text-lg hover:text-[#DAA520] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-6 border-t border-zinc-900">
                <p className="text-sm text-gray-500 font-sans uppercase tracking-widest mb-4">Follow Us</p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/alpinestudio.co.in/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#DAA520] hover:bg-[#DAA520]/10 transition-all group">
                    <Instagram className="text-gray-400 group-hover:text-[#DAA520] transition-colors" size={20} />
                  </a>
                  <a href="https://www.youtube.com/@alpinestudio" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#DAA520] hover:bg-[#DAA520]/10 transition-all group">
                    <Youtube className="text-gray-400 group-hover:text-[#DAA520] transition-colors" size={20} />
                  </a>
                  <a href={`https://wa.me/917017975034?text=${encodeURIComponent('Hi! I am interested in Alpine Architecture services.')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all group">
                    <MessageCircle className="text-gray-400 group-hover:text-[#25D366] transition-colors" size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black p-8 sm:p-12 border border-zinc-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520] opacity-5 rounded-bl-full"></div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {status.text && (
                <div className={`p-3 text-sm font-sans rounded border ${status.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
                  {status.text}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#DAA520] outline-none px-4 py-3 text-white transition-colors" placeholder="Your first name" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#DAA520] outline-none px-4 py-3 text-white transition-colors" placeholder="Your last name" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#DAA520] outline-none px-4 py-3 text-white transition-colors" placeholder="your.email@example.com" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Your Message *</label>
                <textarea rows="4" name="message" value={formData.message} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#DAA520] outline-none px-4 py-3 text-white transition-colors resize-none" placeholder="Tell us about your project..." required></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#DAA520] text-black font-semibold font-sans tracking-widest py-4 hover:bg-white transition-colors disabled:opacity-50">
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500 font-sans tracking-wide">
          <p>© {new Date().getFullYear()} Alpine Studios. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-600">Design by Mac Studio Hub</span>
          </div>
        </div>
      </div>
    </footer>

    {/* Floating WhatsApp Button */}
    <a
      href={`https://wa.me/917017975034?text=${encodeURIComponent('Hi! I am interested in Alpine Studios services.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 animate-bounce"
      style={{ animationDuration: '2s', animationIterationCount: '3' }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="text-white" size={28} />
    </a>
    </>
  );
};

export default Footer;

