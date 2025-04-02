
import { IconType } from 'react-icons';

export type NavLink = {
  href: string;
  label: string;
  icon?: IconType;
};

type NavigationLinksProps = {
  variant: 'header' | 'footer';/* para reusar el menu en header y footer */
  className?: string;
  linkClassName?: string;
  links: NavLink[];
};

export const NavigationLinks = ({ 
  variant, 
  className, 
  linkClassName,
  links
}: NavigationLinksProps) => {
  return (
    <nav className={className}>
      <ul className={variant === 'footer' ? 'grid grid-cols justify-items-center leading-none pb-6 gap-y-2' : 'flex gap-4'}>
        {links.map((link) => (
          <li key={link.href}>
            <a 
              href={link.href} 
              className={linkClassName} >
             {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};