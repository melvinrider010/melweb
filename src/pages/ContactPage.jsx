import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, UserCheck, ShieldCheck, ExternalLink, Building2, HelpCircle } from 'lucide-react';
import contactData from '../data/contact_info.json';
import collegeInfo from '../data/college_info.json';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1500px] mx-auto text-[#071A33]">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#142e61] via-[#274C97] to-[#18397a] p-8 sm:p-10 rounded-2xl text-white shadow-md border-b-4 border-[#C9A84C] space-y-4">
        <div className="flex items-center space-x-2.5">
          <span className="bg-[#C9A84C] text-[#071A33] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Official Directory
          </span>
          <span className="text-blue-200 text-xs font-semibold">St. Philomena's College (Autonomous), Mysuru</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          Contact Us & Campus Helpdesk
        </h1>
        <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
          We’re here to assist you! Connect directly with our institutional leadership, public relations desk, admissions office, or autonomous examination branch.
        </p>
      </div>

      {/* Key Administrative Officers Section */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <UserCheck className="w-5 h-5 text-[#274C97]" />
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">Key Administrative Contacts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactData.keyPersonnel.map((person, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 border-t-4 border-[#274C97]">
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-[#C9A84C] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {person.designation}
                </span>
                <h3 className="font-serif font-bold text-base text-slate-900">{person.name}</h3>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-[#1C5496] shrink-0" />
                  <span className="font-semibold mr-1">Mobile:</span>
                  <a href={person.telLink} className="text-[#1C5496] hover:text-[#0F3B70] font-mono font-bold hover:underline">
                    {person.mobile}
                  </a>
                </p>
                {person.landline && (
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="font-semibold mr-1">Landline:</span>
                    <a href={`tel:${person.landline.replace(/\s+/g, '')}`} className="font-mono hover:underline text-slate-700">
                      {person.landline}
                    </a>
                  </p>
                )}
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-[#1C5496] shrink-0" />
                  <span className="font-semibold mr-1">Email:</span>
                  <a href={`mailto:${person.email}`} className="text-slate-800 hover:text-[#1C5496] hover:underline truncate">
                    {person.email}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid: Departmental Directory & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Departmental Desks */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#1C5496]" />
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">Departmental Desks & Inquiries</h2>
          </div>

          <div className="space-y-4">
            {contactData.departmentalContacts.map((dept, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-[#1C5496] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-serif font-bold text-base text-slate-900">{dept.department}</h3>
                  {dept.portalUrl && (
                    <a
                      href={dept.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-[#1C5496] bg-blue-50 px-3 py-1 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors w-fit"
                    >
                      <span>Online Portal</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-700">
                  <p className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-[#C9A84C] shrink-0" />
                    <span className="font-semibold mr-1">Phone:</span>
                    <span className="font-mono">{dept.phone}</span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-[#C9A84C] shrink-0" />
                    <span className="font-semibold mr-1">Email:</span>
                    <a href={`mailto:${dept.email}`} className="text-[#1C5496] hover:underline truncate">
                      {dept.email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-slate-900">Send an Institutional Inquiry</h3>
              <p className="text-xs text-slate-500">Fill out this quick form and our reception desk will route your query to the appropriate authority.</p>
            </div>
            
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center text-emerald-800">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-bold text-base">Inquiry Submitted Successfully!</p>
                <p className="text-xs text-emerald-700">Thank you for contacting St. Philomena's College. Our administrative desk will review and respond shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-[#1C5496] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Inquiry Category *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496] font-semibold text-slate-800"
                    >
                      <option value="Admissions">Admissions Inquiry (2026–27)</option>
                      <option value="Examinations">Examinations & Marksheets</option>
                      <option value="Placements">Placements & Recruiter Relations</option>
                      <option value="Transcripts">Transcripts & Verification</option>
                      <option value="General">General Administrative Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your query or message in detail..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary-blue px-6 py-2.5 rounded-md font-bold text-xs inline-flex items-center">
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Campus Details, Office Hours & Interactive Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Official Address Card */}
          <div className="bg-[#071A33] text-white p-7 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#FFD84A] flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#FFD84A]" />
              <span>Campus Address</span>
            </h3>
            
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>St. Philomena's College (Autonomous)</strong><br />
              PB No. 2, Bannimantap, Mysuru – 570015<br />
              Karnataka, India
            </p>

            <div className="space-y-2.5 text-xs text-slate-200 pt-3 border-t border-slate-800">
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0" />
                <span>Helpline / Office:</span>
                <a href="tel:+919008580707" className="font-mono font-bold text-[#FFD84A] hover:underline ml-1.5">
                  +91 9008580707
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0" />
                <span>PRO / Placement:</span>
                <a href="tel:+916364118983" className="font-mono font-bold text-[#FFD84A] hover:underline ml-1.5">
                  +91 6364118983
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0" />
                <span>Rector Office:</span>
                <a href="tel:+917022371285" className="font-mono font-bold text-[#FFD84A] hover:underline ml-1.5">
                  +91 7022371285
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-[#FFD84A] shrink-0" />
                <span>General Email:</span>
                <a href={`mailto:${collegeInfo.email}`} className="text-white hover:underline ml-1.5">
                  {collegeInfo.email}
                </a>
              </p>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-serif font-bold text-base text-slate-900 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#1C5496]" />
              <span>Campus Office Hours</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Monday – Friday</span>
                <span className="font-bold text-slate-900">9:00 AM – 5:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Saturday</span>
                <span className="font-bold text-slate-900">9:00 AM – 1:00 PM</span>
              </div>
              <div className="flex justify-between py-1 text-rose-700">
                <span className="font-medium">Sunday & Holidays</span>
                <span className="font-bold">Closed</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-slate-900">Interactive Location Map</h4>
              <a
                href="https://maps.google.com/?q=St.+Philomena%27s+College+Mysuru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#1C5496] hover:underline flex items-center"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
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
