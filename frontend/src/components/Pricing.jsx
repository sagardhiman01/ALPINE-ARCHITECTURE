import React, { useState } from 'react';
import { Check, Send, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Pricing = () => {
  const { content, loading } = useContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    propertySize: '',
    projectType: 'Residential',
    scope: 'Architecture (Planning & Elevation)',
    categories: [],
    otherCategory: '',
    requirements: '',
    budget: '',
    timeline: '',
    preferredDate: '',
    preferredTime: '',
    referral: '',
    otherReferral: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const plans = content?.pricing?.plans || [
    { name: "Consultation Call", price: "₹1199", description: "Quick session for architectural doubts.", recommended: false },
    { name: "Design Meeting", price: "₹2199", description: "Detailed plan review with Ar. Mayur.", recommended: true },
    { name: "Vastu Review", price: "₹2199", description: "Specialized Vastu guidance for your space.", recommended: false }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedCategories = checked 
        ? [...formData.categories, value]
        : formData.categories.filter(cat => cat !== value);
      setFormData({ ...formData, categories: updatedCategories });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData(initialFormState);
      } else {
        throw new Error('Something went wrong. Please try again or contact us directly.');
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-zinc-950 text-white border-t border-zinc-900">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl text-center">
        <div className="mb-16">
          <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-sm uppercase mb-4 text-center mx-auto">Investment</h4>
          <h2 className="text-4xl sm:text-5xl font-serif mb-6">Transparent Pricing Plans</h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto">
            Choose the perfect architectural service package tailored to your project scope and requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-12 mb-24">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 border transition-all duration-300 hover:-translate-y-2 ${plan.recommended ? 'border-[#DAA520] bg-black shadow-2xl lg:scale-105 z-10' : 'border-zinc-800 bg-zinc-900/30'} flex flex-col h-full text-left`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#DAA520] text-black text-xs font-bold tracking-widest uppercase py-1 px-4">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-serif mb-6">{plan.name}</h3>
              
              <div className="mb-6">
                <span className="text-4xl font-serif text-[#DAA520]">{plan.price}</span>
                <span className="text-sm text-gray-500 font-sans ml-2">{plan.unit}</span>
              </div>

              <p className="text-gray-400 font-sans text-sm mb-12 leading-relaxed">{plan.description}</p>
              
              <a 
                href="#consultation-form" 
                className={`w-full text-center py-4 font-sans text-sm tracking-widest font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-auto block ${
                  plan.recommended 
                    ? 'bg-[#DAA520] text-black hover:bg-white hover:text-black' 
                    : 'border border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520] hover:text-black'
                }`}
              >
                SELECT PLAN
              </a>
            </div>
          ))}
        </div>

        {/* Consultation Form Section */}
        <div id="consultation-form" className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 p-8 sm:p-12 shadow-2xl text-left">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif text-white mb-4">Book Your Architectural Consultation</h3>
            <p className="text-gray-400 font-sans text-sm">Please provide your project details below, and our experts will reach out to schedule your session.</p>
          </div>

          {submitSuccess ? (
            <div className="py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-[#DAA520]/20 border border-[#DAA520] rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={32} className="text-[#DAA520]" />
              </div>
              <h2 className="text-3xl font-serif text-white">Application Submitted!</h2>
              <p className="text-gray-400 font-sans max-w-md mx-auto">
                Thank you for reaching out to **Alpine Studios**. We have received your consultation request and will contact you shortly on your WhatsApp number/Email.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="text-[#DAA520] font-sans text-sm tracking-widest hover:underline pt-10"
              >
                BOOK ANOTHER CONSULTATION
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {submitError && (
                <div className="p-4 bg-red-900/20 border border-red-900 text-red-500 text-sm font-sans mb-6">
                  {submitError}
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Full Name</label>
                  <input 
                    name="fullName" value={formData.fullName} onChange={handleInputChange} required
                    type="text" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Email ID</label>
                  <input 
                    name="email" value={formData.email} onChange={handleInputChange} required
                    type="email" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="john@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Phone Number (WhatsApp Preferred)</label>
                  <input 
                    name="phone" value={formData.phone} onChange={handleInputChange} required
                    type="tel" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="+91 00000 00000" 
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Project Location (City & State)</label>
                  <input 
                    name="location" value={formData.location} onChange={handleInputChange} required
                    type="text" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="City name, State" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Plot Size / Property Size (sq.ft.)</label>
                  <input 
                    name="propertySize" value={formData.propertySize} onChange={handleInputChange} required
                    type="text" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="e.g. 1500 sq.ft." 
                  />
                </div>
              </div>

              {/* Project Type & Scope */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                <div className="space-y-4 text-left">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Project Type</label>
                  <div className="flex flex-wrap gap-6">
                    {['Residential', 'Commercial', 'Renovation'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" name="projectType" value={type} checked={formData.projectType === type} onChange={handleInputChange}
                          className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 text-left">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Scope of Work</label>
                  <div className="flex flex-wrap gap-6">
                    {['Architecture (Planning & Elevation)', 'Interior Design', 'Both'].map(scope => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" name="scope" value={scope} checked={formData.scope === scope} onChange={handleInputChange}
                          className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Consultation Category Checkboxes */}
              <div className="space-y-4 pt-4 text-left">
                <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Consultation Category (Select one or more)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                  {['Full House Planning', 'Kitchen Consultancy', 'Bedroom Design', 'Living Room Design', 'Bathroom Design', 'Elevation / Facade Design', 'Vastu Consultation', 'Furniture Layout', 'Material Selection'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" value={cat} checked={formData.categories.includes(cat)} onChange={handleInputChange}
                        className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{cat}</span>
                    </label>
                  ))}
                  <div className="col-span-2 sm:col-span-1">
                    <input 
                      name="otherCategory" value={formData.otherCategory} onChange={handleInputChange}
                      type="text" className="w-full bg-black/50 border-b border-zinc-700 p-2 text-xs text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="Other Specify..." 
                    />
                  </div>
                </div>
              </div>

              {/* Requirements & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Your Requirements / Briefly describe your project</label>
                  <textarea 
                    name="requirements" value={formData.requirements} onChange={handleInputChange} required
                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-[#DAA520] outline-none transition-colors h-32 resize-none" placeholder="We just bought a 120 sq. yd plot and need planning + modern elevation"
                  ></textarea>
                </div>
                <div className="space-y-8 text-left">
                  <div className="space-y-4">
                    <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Budget Range (Optional but recommended)</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Under ₹5 Lakhs', '₹5–15 Lakhs', '₹15–50 Lakhs', '₹50 Lakhs+'].map(budget => (
                        <label key={budget} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" name="budget" value={budget} checked={formData.budget === budget} onChange={handleInputChange}
                            className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                          />
                          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{budget}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Project Timeline</label>
                    <div className="flex flex-wrap gap-4">
                      {['Immediate (0–1 month)', '1–3 months', '3–6 months', 'Just Exploring'].map(time => (
                        <label key={time} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" name="timeline" value={time} checked={formData.timeline === time} onChange={handleInputChange}
                            className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                          />
                          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing Slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520] mb-4">Preferred Consultation Date</label>
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm">
                    {/* Month Selection Header */}
                    <div className="flex justify-between items-center mb-6 px-1">
                      <button 
                        type="button" 
                        onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                        className="p-1 hover:text-[#DAA520] transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-sm font-sans font-bold text-white uppercase tracking-widest">
                        {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                        className="p-1 hover:text-[#DAA520] transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-widest">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {/* Empty slots for the first week */}
                      {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      
                      {/* Days of Month */}
                      {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                        const day = i + 1;
                        const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                        const dateStr = d.toISOString().split('T')[0];
                        const isPast = d < new Date(new Date().setHours(0,0,0,0));
                        const isSelected = formData.preferredDate === dateStr;
                        
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => setFormData(prev => ({ ...prev, preferredDate: dateStr }))}
                            className={`aspect-square flex items-center justify-center rounded-full text-xs font-sans transition-all
                              ${isPast ? 'text-zinc-700 cursor-not-allowed opacity-30 px-1' : 'text-zinc-300 hover:bg-[#DAA520] hover:text-black'}
                              ${isSelected ? 'bg-[#DAA520] text-black font-bold shadow-[0_0_15px_rgba(218,165,32,0.4)]' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <input type="hidden" name="preferredDate" value={formData.preferredDate} required />
                </div>
                <div className="space-y-4 text-left">
                  <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">Preferred Time Slot</label>
                  <div className="flex flex-wrap gap-4">
                    {['Morning (10 AM – 1 PM)', 'Afternoon (1 PM – 4 PM)', 'Evening (4 PM – 8 PM)'].map(slot => (
                      <label key={slot} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" name="preferredTime" value={slot} checked={formData.preferredTime === slot} onChange={handleInputChange}
                          className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Referral Source */}
              <div className="space-y-4 pt-4 text-left">
                <label className="block text-xs font-sans tracking-widest uppercase text-[#DAA520]">How did you hear about us?</label>
                <div className="flex flex-wrap gap-6">
                  {['Instagram', 'Google', 'Referral', 'Website'].map(source => (
                    <label key={source} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" name="referral" value={source} checked={formData.referral === source} onChange={handleInputChange}
                        className="accent-[#DAA520] w-4 h-4 cursor-pointer" 
                      />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{source}</span>
                    </label>
                  ))}
                  <input 
                    name="otherReferral" value={formData.otherReferral} onChange={handleInputChange}
                    type="text" className="bg-transparent border-b border-zinc-700 p-1 text-xs text-white focus:border-[#DAA520] outline-none transition-colors" placeholder="Other source..." 
                  />
                </div>
              </div>

              {/* Submission Section */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-800">
                <p className="text-xs text-gray-500 italic">By clicking "Book My Consultation", you agree to be contacted via WhatsApp/Email by Alpine Studios.</p>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-64 bg-[#DAA520] text-black py-4 font-sans text-sm tracking-widest font-bold hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 uppercase leading-none shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Processing...
                    </>
                  ) : 'Book My Consultation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
