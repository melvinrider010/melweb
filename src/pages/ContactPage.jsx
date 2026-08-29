import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import collegeInfo from '../data/college_info.json';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Institutional Contact & Location</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Contact Us & Campus Location</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          St. Philomena's College (Autonomous), PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India. Reach out to our central administration, admissions desk, or COE office.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="font-serif font-bold text-xl text-slate-900">Send an Institutional Inquiry</h2>
          
          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center text-emerald-800">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <p className="font-bold text-base">Inquiry Submitted Successfully!</p>
              <p className="text-xs text-emerald-700">Thank you for contacting St. Philomena's College. Our administration desk will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="Enter full name" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]" />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email Address *</label>
                  <input type="email" required placeholder="name@example.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subject / Inquiry Type *</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496] font-semibold text-slate-800">
                  <option value="Admissions">Admissions Inquiry (2026–27)</option>
                  <option value="Examinations">Examinations & Verification</option>
                  <option value="Transcripts">Transcripts & Certificates</option>
                  <option value="Research">RDC & Research Collaborations</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Your Message *</label>
                <textarea rows={4} required placeholder="Write your inquiry message here..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"></textarea>
              </div>

              <button type="submit" className="btn-primary-blue px-6 py-2.5 rounded-md font-bold text-xs inline-flex items-center">
                <Send className="w-4 h-4 mr-1.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Details & Map */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#071A33] text-white p-8 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#FFD84A]">Official Address & Desk</h3>
            <div className="space-y-3 text-xs text-slate-200">
              <p className="flex items-start"><MapPin className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0 mt-0.5" /> PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India</p>
              <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0" /> {collegeInfo.phone}</p>
              <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0" /> {collegeInfo.email}</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
              <p><span className="font-bold text-white">Office Hours:</span> Mon – Sat: 9:00 AM – 5:00 PM</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-serif font-bold text-sm text-slate-900">Interactive Map Location</h4>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <iframe
                title="St. Philomena's College Map Location"
                src="https://maps.google.com/maps?q=St.+Philomena%27s+College+Bannimantap+Mysuru&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
