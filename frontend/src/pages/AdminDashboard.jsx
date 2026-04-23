import React, { useState, useEffect } from 'react';
import { Layout, Palette, Image as ImageIcon, MessageSquare, LogOut, Save, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', category: '', location: '', fullLocation: '', image: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [contentRes, projectsRes, leadsRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/projects'),
        fetch('/api/contact', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (leadsRes.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const [contentData, projectsData, leadsData] = await Promise.all([
        contentRes.json(),
        projectsRes.json(),
        leadsRes.json()
      ]);
      
      setContent(contentData);
      setProjects(projectsData);
      setLeads(leadsData);
      setLoading(false);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(content)
      });
      if (res.ok) setSaveStatus('success');
      else setSaveStatus('error');
    } catch (e) { setSaveStatus('error'); }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleImageUpload = async (e, pathCallback) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setSaveStatus('saving');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        pathCallback(data.url);
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDeleteProject = async (_id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingProject;
    const url = isEdit ? `/api/projects/${editingProject._id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(projectForm)
      });
      if (res.ok) {
        setIsAddingProject(false);
        setEditingProject(null);
        setProjectForm({ title: '', category: '', location: '', fullLocation: '', image: '' });
        fetchData();
      } else {
        const errData = await res.json();
        alert('Error: ' + JSON.stringify(errData.errors || errData.error));
      }
    } catch (e) { alert('Submission Failed'); }
  };

  const startEdit = (proj) => {
    setEditingProject(proj);
    setProjectForm({ ...proj });
    setIsAddingProject(true);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#DAA520]">Authenticating Ar. Mayur...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-zinc-900 flex flex-col pt-8">
        <div className="px-8 mb-12 flex items-center gap-3">
          <div className="w-8 h-8 border border-[#DAA520] rounded-full flex items-center justify-center text-[#DAA520] font-bold">M</div>
          <span className="font-serif font-bold tracking-widest text-sm uppercase">Ar. Mayur — Admin</span>
        </div>

        <nav className="flex-grow space-y-2 px-4">
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${activeTab === 'content' ? 'bg-[#DAA520] text-black font-bold' : 'text-gray-400 hover:bg-zinc-900'}`}
          >
            <Layout size={18} /> Website Content
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${activeTab === 'projects' ? 'bg-[#DAA520] text-black font-bold' : 'text-gray-400 hover:bg-zinc-900'}`}
          >
            <ImageIcon size={18} /> Manage Projects
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${activeTab === 'leads' ? 'bg-[#DAA520] text-black font-bold' : 'text-gray-400 hover:bg-zinc-900'}`}
          >
            <MessageSquare size={18} /> Leads & Enquiries
          </button>
        </nav>

        <button 
          onClick={() => { localStorage.removeItem('adminToken'); window.location.href = '/'; }}
          className="m-4 flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded text-sm transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif text-white uppercase tracking-widest">
              {activeTab === 'content' && 'Full Website Customizer'}
              {activeTab === 'projects' && 'Project Management'}
              {activeTab === 'leads' && 'Client Enquiries'}
            </h1>
            <p className="text-gray-500 text-sm mt-2">Control every aspect of your brand presence.</p>
          </div>
          
          {activeTab === 'content' && (
            <button 
              onClick={handleSaveContent}
              className="flex items-center gap-2 bg-[#DAA520] text-black px-6 py-3 font-bold text-sm tracking-widest hover:bg-white transition-all shadow-lg"
            >
              {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
              {saveStatus === 'success' ? 'CHANGES SAVED!' : 'PUBLISH CHANGES'}
            </button>
          )}
        </header>

        {/* Tab Content: Website Content (FULL CUSTOMIZER) */}
        {activeTab === 'content' && (
          <div className="space-y-12 max-w-6xl pb-20">
            {/* Section 0: Brand Identity */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6 shadow-2xl">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2">0. Global Brand Identity</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-sans">Main Logo Source (URL or Path)</label>
                  <input type="text" value={content?.logo} onChange={(e) => setContent({...content, logo: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none" placeholder="/logo.png" />
                </div>
              </div>
            </div>

            {/* Section 1: Hero Branding */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6 shadow-2xl">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2 flex justify-between">
                <span>1. Hero (Home) Presence</span>
                <span className="text-gray-600 font-sans italic normal-case font-normal text-[10px]">Your first impression</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-sans">Primary Title</label>
                  <input type="text" value={content?.hero?.title} onChange={(e) => setContent({...content, hero: {...content.hero, title: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-sans">Tagline / Subtitle</label>
                  <input type="text" value={content?.hero?.subtitle} onChange={(e) => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase font-sans">Vision Statement (Hero Description)</label>
                <textarea value={content?.hero?.description} onChange={(e) => setContent({...content, hero: {...content.hero, description: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none h-24 resize-none" />
              </div>
              
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <label className="text-xs text-gray-400 uppercase font-sans">Hero Background Images (Rotating)</label>
                {content?.hero?.images?.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={img} onChange={(e) => {
                      const ni = [...content.hero.images];
                      ni[idx] = e.target.value;
                      setContent({...content, hero: {...content.hero, images: ni}});
                    }} className="flex-grow bg-black border border-zinc-800 p-2 text-xs focus:border-[#DAA520] outline-none" />
                    <button onClick={() => {
                      const ni = content.hero.images.filter((_, i) => i !== idx);
                      setContent({...content, hero: {...content.hero, images: ni}});
                    }} className="text-red-900 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                ))}
                <button onClick={() => setContent({...content, hero: {...content.hero, images: [...(content.hero.images || []), ""]}})} className="text-[10px] text-[#DAA520] font-bold">+ ADD NEW SLIDE</button>
              </div>
            </div>

            {/* Section 2: Personal Branding (About) */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2">2. About Ar. Mayur (Biography)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-sans">Portrait Image Source</label>
                  <div className="flex gap-2">
                    <input type="text" value={content?.about?.about_image} onChange={(e) => setContent({...content, about: {...content.about, about_image: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none" placeholder="/about_image.jpg" />
                    <label className="bg-zinc-800 hover:bg-[#DAA520] hover:text-black text-xs px-4 py-3 cursor-pointer transition-colors font-bold tracking-widest whitespace-nowrap flex items-center justify-center">
                      UPLOAD
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, (url) => setContent({...content, about: {...content.about, about_image: url}}))} 
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-sans">Official Signature Text</label>
                  <input type="text" value={content?.about?.signature} onChange={(e) => setContent({...content, about: {...content.about, signature: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase font-sans">Full Bio / Studios Story</label>
                <textarea value={content?.about?.description} onChange={(e) => setContent({...content, about: {...content.about, description: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#DAA520] outline-none h-40 resize-none font-serif leading-relaxed" />
              </div>
            </div>

            {/* Section 3: Domain Expertise Metrics */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2">3. Studios Metrics (Project Counts)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content?.expertise?.map((exp, idx) => (
                  <div key={idx} className="border border-zinc-800 p-4 bg-black/40 space-y-2 group transition-all">
                    <input value={exp.title} onChange={(e) => {
                      const newExp = [...content.expertise];
                      newExp[idx].title = e.target.value;
                      setContent({...content, expertise: newExp});
                    }} className="w-full bg-black border-none text-[10px] uppercase font-bold text-gray-500 tracking-widest outline-none group-hover:text-white" />
                    <input value={exp.count} onChange={(e) => {
                      const newExp = [...content.expertise];
                      newExp[idx].count = e.target.value;
                      setContent({...content, expertise: newExp});
                    }} className="w-full bg-black border-none text-3xl font-serif text-[#DAA520] outline-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Studios Capabilities (Services) */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2 flex justify-between">
                <span>4. Capabilities (Services)</span>
                <button 
                  onClick={() => setContent({...content, services: [...(content.services || []), {title: 'New Service', description: 'Meta info...'}]})}
                  className="text-[10px] text-zinc-500 hover:text-[#DAA520]">+ New Vertical</button>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content?.services?.map((s, idx) => (
                  <div key={idx} className="border border-zinc-800 p-4 bg-black/40 relative group">
                    <button onClick={() => { const ns = [...content.services]; ns.splice(idx, 1); setContent({...content, services: ns}); }} className="absolute top-2 right-2 text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500"><Trash2 size={12}/></button>
                    <input value={s.title} onChange={(e) => { const ns = [...content.services]; ns[idx].title = e.target.value; setContent({...content, services: ns}); }} className="w-full bg-black border-none text-sm font-bold text-white mb-2 outline-none" />
                    <textarea value={s.description} onChange={(e) => { const ns = [...content.services]; ns[idx].description = e.target.value; setContent({...content, services: ns}); }} className="w-full bg-black border-none text-xs text-zinc-500 outline-none h-12 resize-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Dynamic Pricing Tiers */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2">5. Package Pricing (Plans)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content?.pricing?.plans?.map((plan, idx) => (
                  <div key={idx} className="border border-zinc-800 p-6 bg-black/40 space-y-4">
                    <input value={plan.name} onChange={(e) => {
                      const np = [...content.pricing.plans]; np[idx].name = e.target.value;
                      setContent({...content, pricing: {...content.pricing, plans: np}});
                    }} className="w-full bg-black border-none text-xs font-bold text-white uppercase tracking-widest outline-none h-10 overflow-hidden" />
                    <div className="flex items-center gap-2 border-y border-zinc-900 py-2">
                       <span className="text-gray-500 text-[10px]">₹</span>
                       <input value={plan.price} onChange={(e) => {
                         const np = [...content.pricing.plans]; np[idx].price = e.target.value;
                         setContent({...content, pricing: {...content.pricing, plans: np}});
                       }} className="w-full bg-black border-none text-lg font-serif text-[#DAA520] outline-none" />
                    </div>
                    <textarea value={plan.description} onChange={(e) => {
                      const np = [...content.pricing.plans]; np[idx].description = e.target.value;
                      setContent({...content, pricing: {...content.pricing, plans: np}});
                    }} className="w-full bg-black border-none text-[10px] text-gray-500 h-16 resize-none outline-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Official Studios Credentials */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8 space-y-6">
              <h3 className="text-[#DAA520] text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#DAA520]/20 pb-2">6. Studios Credentials & Socials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase">Official Email</label>
                    <input type="email" value={content?.contact?.email} onChange={(e) => setContent({...content, contact: {...content.contact, email: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-xs outline-none focus:border-[#DAA520]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase">Studios Hotline</label>
                    <input type="text" value={content?.contact?.phone} onChange={(e) => setContent({...content, contact: {...content.contact, phone: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-xs outline-none focus:border-[#DAA520]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase">Headquarters</label>
                    <input type="text" value={content?.contact?.address} onChange={(e) => setContent({...content, contact: {...content.contact, address: e.target.value}})} className="w-full bg-black border border-zinc-800 p-3 text-xs outline-none focus:border-[#DAA520]" />
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase">Instagram URL</label>
                    <input type="text" value={content?.contact?.social?.instagram} onChange={(e) => setContent({...content, contact: {...content.contact, social: {...content.contact.social, instagram: e.target.value}}})} className="w-full bg-black border border-zinc-800 p-3 text-xs outline-none focus:border-[#DAA520]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase">Facebook URL</label>
                    <input type="text" value={content?.contact?.social?.facebook} onChange={(e) => setContent({...content, contact: {...content.contact, social: {...content.contact.social, facebook: e.target.value}}})} className="w-full bg-black border border-zinc-800 p-3 text-xs outline-none focus:border-[#DAA520]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase">LinkedIn Profile</label>
                    <input type="text" value={content?.contact?.social?.linkedin} onChange={(e) => setContent({...content, contact: {...content.contact, social: {...content.contact.social, linkedin: e.target.value}}})} className="w-full bg-black border border-zinc-800 p-3 text-xs outline-none focus:border-[#DAA520]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Project Management */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {isAddingProject ? (
              <form onSubmit={handleProjectSubmit} className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-6 max-w-2xl">
                <h3 className="text-[#DAA520] text-sm font-bold tracking-widest uppercase">
                  {editingProject ? 'Edit Project' : 'New Project Details'}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <input placeholder="Project Title" required className="bg-black border border-zinc-800 p-3 text-sm outline-none focus:border-[#DAA520]" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                  <select required className="bg-black border border-zinc-800 p-3 text-sm outline-none focus:border-[#DAA520]" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})}>
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Plotting Design">Plotting Design</option>
                    <option value="Others">Others</option>
                  </select>
                  <input placeholder="Location (Roorkee)" required className="bg-black border border-zinc-800 p-3 text-sm outline-none focus:border-[#DAA520]" value={projectForm.location} onChange={e => setProjectForm({...projectForm, location: e.target.value})} />
                  <input placeholder="Full Address (Optional)" className="bg-black border border-zinc-800 p-3 text-sm outline-none focus:border-[#DAA520]" value={projectForm.fullLocation} onChange={e => setProjectForm({...projectForm, fullLocation: e.target.value})} />
                </div>
                <input placeholder="Image URL (Unsplash or Static Link)" required className="w-full bg-black border border-zinc-800 p-3 text-sm outline-none focus:border-[#DAA520]" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} />
                <div className="flex gap-4">
                  <button type="submit" className="bg-[#DAA520] text-black px-8 py-3 font-bold text-sm tracking-widest">
                    {editingProject ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
                  </button>
                  <button type="button" onClick={() => { setIsAddingProject(false); setEditingProject(null); setProjectForm({title:'',category:'',location:'',fullLocation:'',image:''}); }} className="text-gray-500 hover:text-white px-8 py-3 text-sm font-bold tracking-widest">CANCEL</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj._id} className="bg-black border border-zinc-900 group relative">
                    <img src={proj.image} alt={proj.title} className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="p-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest truncate">{proj.title}</h4>
                      <p className="text-xs text-[#DAA520] mt-1">{proj.category}</p>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => startEdit(proj)} className="p-2 border border-zinc-800 hover:border-[#DAA520] text-gray-500 hover:text-[#DAA520] transition-colors"><Edit2 size={14}/></button>
                        <button onClick={() => handleDeleteProject(proj._id)} className="p-2 border border-zinc-800 hover:border-red-500 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))}
                <div onClick={() => setIsAddingProject(true)} className="border border-zinc-900 border-dashed flex flex-col items-center justify-center p-8 text-gray-600 hover:text-[#DAA520] hover:border-[#DAA520] transition-colors cursor-pointer min-h-[200px]">
                  <Plus size={32} />
                  <span className="text-xs font-bold tracking-widest mt-2">ADD NEW PROJECT</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Leads */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <p className="text-zinc-600 text-center py-20 uppercase tracking-widest text-sm italic">No recent enquiries found.</p>
            ) : (
              leads.map((lead) => (
                <div key={lead._id} className="bg-zinc-900/30 border border-zinc-900 p-6 flex justify-between items-start hover:bg-black transition-colors">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#DAA520] border border-[#DAA520]/40 px-2 py-0.5 rounded uppercase font-bold tracking-widest">{lead.type || 'Standard Enquiry'}</span>
                    <h4 className="text-lg font-serif pt-2">{lead.fullName || lead.name}</h4>
                    <p className="text-sm text-gray-400">{lead.email} | {lead.phone}</p>
                    {lead.requirements && <p className="text-xs text-gray-500 italic mt-2">"{lead.requirements}"</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4 font-bold">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    <button className="bg-zinc-800 hover:bg-[#DAA520] hover:text-black text-xs px-4 py-2 transition-colors font-bold tracking-widest">VIEW DETAILS</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

const Loader2 = ({ className, size }) => (
  <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
