import * as Icons from 'lucide-react';
import type { WindowData } from '@/store/use-desktop-store';

type Division = NonNullable<WindowData['division']>;

export function CompanyInfoApp({ data }: { data?: WindowData }) {
  const division = data?.division;
  
  if (division?.name === 'About Najee Jeremiah') {
    return <NajeeProfile division={division} />;
  }
  
  if (division?.name === 'Contact') {
    return <ContactPage division={division} />;
  }
  
  return <NJAYCOCorporate division={division} />;
}

function NajeeProfile({ division }: { division?: Division }) {
  return (
    <div className="h-full bg-white overflow-y-auto text-slate-800 font-sans">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,_#fff_1px,_transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Icons.User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Najee Jeremiah</h1>
          <p className="text-purple-200 text-lg font-medium">CEO & Founder · The Najee Jeremiah Company</p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <section className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <p className="text-lg leading-relaxed text-slate-700">
            {division?.fullDescription || 
              "Najee Jeremiah is a multi-industry entrepreneur, technologist, educator, and creative visionary. He is the founder and CEO of The Najee Jeremiah Company (NJAYCO), a holding company spanning music, education, technology, media, and local business infrastructure."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Icons.Briefcase className="text-indigo-600 w-5 h-5" /> Roles & Ventures
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Entrepreneur', desc: 'Founder of 20+ companies and brands under NJAYCO', icon: Icons.Rocket },
              { title: 'Technologist', desc: 'Full-stack developer and software architect', icon: Icons.Code },
              { title: 'Educator', desc: 'Creator of game-based and AI-powered learning tools', icon: Icons.GraduationCap },
              { title: 'Creative Director', desc: 'Music, media, and brand development visionary', icon: Icons.Music },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{item.title}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactPage({ division }: { division?: Division }) {
  return (
    <div className="h-full bg-white overflow-y-auto text-slate-800 font-sans">
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-12 text-center">
        <Icons.Mail className="w-16 h-16 mx-auto mb-4 text-blue-200" />
        <h1 className="text-4xl font-display font-bold mb-2">Contact NJAYCO</h1>
        <p className="text-blue-200 text-lg">We'd love to hear from you</p>
      </div>
      <div className="max-w-2xl mx-auto p-8 space-y-6">
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icons.Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">Website</div>
              <a href="https://njayco.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">njayco.com</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icons.Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <a href="mailto:hello@njayco.com" className="text-blue-600 hover:underline text-sm">hello@njayco.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NJAYCOCorporate({ division }: { division?: Division }) {
  return (
    <div className="h-full bg-white overflow-y-auto text-slate-800 font-sans">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10">
          <Icons.Building2 className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">
            {division?.name || 'The Najee Jeremiah Company'}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {division?.shortDescription || 'A multimedia, education, and technology holding company building platforms, brands, and infrastructure.'}
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8 py-12 space-y-12">
        {division?.fullDescription && (
          <section className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-lg leading-relaxed text-slate-700">{division.fullDescription}</p>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 border-b border-slate-200 pb-2">
            <Icons.Target className="text-blue-600" /> Core Focus Areas
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Technology', desc: 'Custom app development and software infrastructure.' },
              { title: 'Education', desc: 'Game-based, AI-powered learning tools.' },
              { title: 'Media & Music', desc: 'Label services, direct-to-fan commerce, and branding.' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 border-b border-slate-200 pb-2">
            <Icons.Briefcase className="text-blue-600" /> Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">
            NJAYCO exists to create an interconnected ecosystem of businesses that elevate culture, empower learning, and build sustainable local digital infrastructure. Every division works together to form a modern conglomerate.
          </p>
        </section>
      </div>
    </div>
  );
}
