import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { ContactForm } from '../../../components/contact-form';
import { MessageSquare, Mail, Phone, MapPin, Globe } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'navigation');
  return {
    title: t('header.dropdowns.company.contact.label'),
    description: 'Get in touch with the GateFlow team in Cairo and Dubai.',
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t, dict } = await getTranslation(locale, 'contact');

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6">
          {t('hero.headline')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline')}
        </p>
      </section>

      <section className="container px-6 grid lg:grid-cols-5 gap-16 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
           <ContactCard 
              icon={<MessageSquare className="text-success" />}
              title={t('cards.whatsapp.title')}
              detail={t('cards.whatsapp.detail')}
              desc={t('cards.whatsapp.desc')}
              link="https://wa.me/201000000000"
              linkBtn={t('cards.whatsapp.linkBtn')}
           />
           <ContactCard 
              icon={<Mail className="text-indigo-500" />}
              title={t('cards.email.title')}
              detail={t('cards.email.detail')}
              desc={t('cards.email.desc')}
           />
           <ContactCard 
              icon={<Phone className="text-primary" />}
              title={t('cards.sales.title')}
              detail={t('cards.sales.detail')}
              desc={t('cards.sales.desc')}
           />
           
           <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/10 to-indigo-500/10 border overflow-hidden">
               <div className="p-8 bg-card rounded-[1.9rem] border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                     <MapPin className="text-primary" />
                     <h3 className="font-bold text-lg">{t('cards.regional.title')}</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <span className="text-2xl">🇪🇬</span>
                        <div>
                           <p className="font-bold">{t('cards.regional.cairo.name')}</p>
                           <p className="text-sm text-muted-foreground">{t('cards.regional.cairo.desc')}</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <span className="text-2xl">🇦🇪</span>
                        <div>
                           <p className="font-bold">{t('cards.regional.dubai.name')}</p>
                           <p className="text-sm text-muted-foreground">{t('cards.regional.dubai.desc')}</p>
                        </div>
                     </div>
                  </div>
               </div>
           </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
           <ContactForm dict={dict} />
        </div>
      </section>
    </div>
  );
}

function ContactCard({ icon, title, detail, desc, link, linkBtn }: any) {
   return (
      <div className="flex gap-5 p-6 rounded-2xl border bg-card hover:bg-muted/30 transition-colors">
         <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center shrink-0 shadow-sm">
            {icon}
         </div>
         <div className="flex-1">
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-1">{title}</h4>
            <p className="text-lg font-black mb-1">{detail}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
            {link && (
               <a href={link} className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-success hover:underline">
                  {linkBtn}
               </a>
            )}
         </div>
      </div>
   )
}
