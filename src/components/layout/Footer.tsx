import { ChartNoAxesCombined, Cog, House, IdCard } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const footerOption = [
  {
    name: 'Home',
    icon: <House />,
    href: '/',
  },
  {
    name: 'Records',
    icon: <IdCard />,
    href: '/records',
  },
  {
    name: 'Analytics',
    icon: <ChartNoAxesCombined />,
    href: '/analytics',
  },
  {
    name: 'Settings',
    icon: <Cog />,
    href: '/settings',
  },
];
export default function Footer() {
  const { pathname: pathName } = useLocation();
  return (
    <footer className=''>
      <ol className='fixed z-10 backdrop-blur-md bottom-0 w-full border-t-[1px] border-slate-600 flex justify-evenly py-3 gap-3'>
        {footerOption.map(({ name, href, icon }) => {
          const isActive = pathName === href;
          return (
            <NavLink
              key={href + name}
              to={href}
              className={`${isActive && 'text-primary'}`}
            >
              <li className='grid gap-y-1 place-items-center'>
                <span>{icon}</span>
                <span className='text-xs font-semibold'>{name}</span>
              </li>
            </NavLink>
          );
        })}
      </ol>
    </footer>
  );
}