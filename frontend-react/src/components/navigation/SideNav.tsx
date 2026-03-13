import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Users, Compass, Store } from 'lucide-react';

const navItems = [
  { to: '/app/home', icon: <Home size={24} />, label: 'Home' },
  { to: '/app/chat', icon: <MessageSquare size={24} />, label: 'Chats' },
  { to: '/app/contacts', icon: <Users size={24} />, label: 'Contacts' },
  { to: '/app/discover', icon: <Compass size={24} />, label: 'Discover' },
  { to: '/app/store', icon: <Store size={24} />, label: 'Market' },
];

const SideNav = () => {
  return (
    <aside className="w-64 flex flex-col bg-surface-container-light dark:bg-surface-container-dark border-r border-outline-variant-light dark:border-outline-variant-dark p-3">
      <div className="mb-4">
        {/* Placeholder for Logo or App Name */}
        <h1 className="text-2xl font-bold p-4">Your App</h1>
      </div>
      <nav className="flex-1 flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-container-light text-on-primary-container-light dark:bg-primary-container-dark dark:text-on-primary-container-dark'
                  : 'hover:bg-surface-container-highest-light dark:hover:bg-surface-container-highest-dark'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        {/* Optional: User Profile / Settings Link */}
      </div>
    </aside>
  );
};

export default SideNav;
