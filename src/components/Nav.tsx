'use client';
import React, { Fragment } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCoffee,
  FaUsers,
  FaUserCog,
  FaDollarSign,
  FaTasks,
} from 'react-icons/fa';
import { BsMegaphoneFill } from 'react-icons/bs';
import NotificationBell from './NotificationBell';
import LanguageToggle from './LanguageToggle';
import avatar from '../../asset/1.png';

const menuItems = [
  { href: '/wallet', icon: FaDollarSign, label: 'Income' },
  { href: '/TaskFeed', icon: FaTasks,      label: 'Feed' },
  { href: '/referrals', icon: FaUsers,      label: 'Referrals' },
  { href: '/Profile',   icon: FaUserCog,    label: 'My Profile' },
  { href: '/CreateAdvertisement',       icon: BsMegaphoneFill, label: 'Ads Management' },
];

export default function Nav() {
  const { data: session } = useSession();

  return (
    <div className="relative flex h-screen">
      {/* dark backdrop under only the sidebar */}

      <Disclosure as="nav" defaultOpen>
        {({ open }) => (
          <>
            {/* Toggle Button */}
            <DisclosureButton
              className={`
                absolute top-4 left-4 z-50 p-2 rounded-full
                bg-gradient-to-tr from-green-300 to-cyan-400
                text-white shadow-lg hover:shadow-2xl
                transform transition-transform duration-300
                ${open ? 'rotate-180' : ''}
                `}
            >
              {open ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
            </DisclosureButton>

            <Transition
              as={Fragment}
              show={open}
              enter="transition-all duration-500"
              leave="transition-all duration-300"
              enterFrom="-translate-x-64 opacity-0"
              enterTo="translate-x-0 opacity-100"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-64 opacity-0"
            >
              <DisclosurePanel
                static
                className={`
                  relative z-10 w-64 flex flex-col items-center py-8 space-y-6
                  bg-white/20 backdrop-blur-xl border-r-2 border-white/30
                  before:absolute before:inset-0
                  before:rounded-tr-3xl before:rounded-br-3xl
                  before:bg-gradient-to-br before:from-white/10 before:to-transparent
                  before:blur-xl before:z-[-1]
                  shadow-2xl rounded-tr-3xl rounded-br-3xl h-[92vh]
                  `}
              >
                  <div className="absolute inset-y-0 left-0 w-64 bg-gray-700 rounded-r-md top-0" />
                {/* Notifications & Language */}
                <div className="w-full px-4 flex justify-end">
                  {/* <NotificationBell /> */}
                </div>
                {/* <LanguageToggle /> */}

                {/* Avatar */}
                <div className="relative w-32 h-20  overflow-hidden">
                <Link href={'/'}>
                  <Image src={avatar} alt="User" fill className="object-fit" /></Link>
                </div>

                {/* Username */}
                {session?.user?.username && (
                  <div className="text-white font-medium text-lg">
                    {session.user.username}
                  </div>
                )}

                {/* Menu Links */}
                <ul className="flex-1 w-full px-4 space-y-3">
                  {menuItems.map(({ href, icon: Icon, label }) => (
                    <li key={label}>
                      <Link href={href}>
                        <span
                          className={`
                            flex items-center gap-3 px-4 py-2
                            bg-white/10 backdrop-blur-md
                            ring-1 ring-white/40
                            rounded-full
                            text-white
                            hover:bg-white/25 hover:ring-2 hover:ring-white/50
                            transition-all
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-base">{label}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Sign Out */}
                {session && (
                  <button
                    onClick={() => signOut()}
                    className={`
                      w-2/4 mx-4 py-2
                      bg-red-500/80 backdrop-blur-sm
                      text-white font-semibold
                      rounded-full
                      hover:bg-red-600/90
                      transition-colors
                    `}
                  >
                    Sign Out
                  </button>
                )}
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}
