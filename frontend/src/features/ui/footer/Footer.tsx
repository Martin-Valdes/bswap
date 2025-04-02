import { NavigationLinks } from '@/shared/navigation/NavigationLinks';
import { IconType } from 'react-icons';
import { TiSocialInstagram } from "react-icons/ti";
import { FaWhatsapp } from "react-icons/fa";
import { RiTelegram2Fill } from "react-icons/ri";
import styles from './Footer.module.css'
import Image from 'next/image';

const footerNavLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/mylibrary', label: 'Mi Biblioteca' },
  { href: '/community', label: 'Comunidad' },
  { href: '/exchange', label: 'Intercambios' },
  { href: '/reviews', label: 'Reseñas' }
];

type SocialLink = {
  href: string;
  icon: IconType;
  ariaLabel: string;
}
const socialLinks: SocialLink[] = [
  { href: 'https://instagram.com/bswap', icon: TiSocialInstagram, ariaLabel: 'Síguenos en Instagram' },
  { href: 'https://whatsapp.com/+541150502020', icon: FaWhatsapp, ariaLabel: 'Escribenos' },
  { href: 'https://telegram.com/bswap', icon: RiTelegram2Fill, ariaLabel: 'Síguenos en Telegram' },
];

export default function Footer() {
  return (
    <footer className={`w-full text-white ${styles.bg_bswap}`}>
      <div className="container mx-auto px-4 py-1">
    
        <div className={styles.footerGrid}> 
          <div className={styles.logoSection}>
            <div className='relative w-32 h-12'>
              <Image 
                src="/logoSinFondo.png" 
                alt="BSwap Logo" 
                fill 
                priority 
                className="object-contain" 
                sizes="(max-width: 768px) 100vw, 128px" 
              />
            </div>
            <div className='mt-4'>
           
              <p className="font-['Roboto_Serif'] text-sm leading-[20px]  text-white pt-4 pl-8">
                ¿Tienes dudas o necesitas ayuda? Escríbenos y te responderemos lo antes posible.
              </p>
            </div>
          </div>

          <div className={styles.navigationSection}>
            <NavigationLinks
              variant="footer"
              linkClassName="text-white text-xs font-roboto font-bold transition-colors duration-200"
              links={footerNavLinks}
            />
          </div>

          <div className={styles.registrationSection}> 
            <button className="ml-8 bg-white text-black rounded-[40px] px-6 py-2 font-semibold hover:bg-blue-300 hover:text-gray-950 transition-all duration-200">
              Registrarse
            </button>
          </div>

          {/* redes sociales */}
          <div className={styles.socialSection}>
            <div className='m-8'> 
              <h4 className='text-lg font-bold'>Síguenos</h4>
              <div className='flex gap-4'>
                {socialLinks.map((link) => (
                  <a                
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <link.icon size={24} className="hover:scale-110 transition-transform duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}