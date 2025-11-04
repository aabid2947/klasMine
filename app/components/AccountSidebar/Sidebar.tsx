'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'My Profile', href: '/account', icon: '/assets/images/icon/profile.svg' },
    { label: 'Dashboard', href: '/account/dashboard', icon: '/assets/images/icon/dashboard.svg' },
    { label: 'My Plan', href: '/account/my-plan', icon: '/assets/images/icon/myplan.svg' },
    { label: 'My Order History', href: '/account/order-history', icon: '/assets/images/icon/orderhistory.svg' },
    { label: 'Notification', href: '/account/notifications', icon: '/assets/images/icon/notification.svg' },
    { label: 'Change Password', href: '/account/change-password', icon: '/assets/images/icon/changepassword.svg' },
    {
      label: 'Logout',
      icon: '/assets/images/icon/logout.svg',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="sticky top-20 p-8 w-[340px] min-h-[calc(100vh-64px)] bg-white shadow-lg">
      {menuItems.map(({ label, href, icon, onClick }, index) => {
        const isActive = pathname === href;
        const key = href || `${label}-${index}`;

        if (onClick) {
          return (
            <div
              key={key}
              onClick={onClick}
              className="flex items-center gap-3 mb-5 px-4 py-4 rounded-lg text-[18px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-all"
            >
              <Image src={icon} alt={`${label} icon`} width={20} height={20} />
              <span>{label}</span>
            </div>
          );
        }

        if (href) {
          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-3 mb-5 px-4 py-4 rounded-lg text-[18px] font-medium transition-all ${
                isActive ? 'bg-custom-gradient text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Image
                src={icon}
                alt={`${label} icon`}
                width={20}
                height={20}
                className={`${isActive ? 'filter brightness-0 invert' : ''}`}
              />
              <span>{label}</span>
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Sidebar;
