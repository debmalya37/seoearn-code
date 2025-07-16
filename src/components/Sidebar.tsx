'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaWallet, FaLink, FaCreditCard, FaTimes, FaBars } from 'react-icons/fa';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [safeBalance, setSafeBalance] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [volume, setVolume]     = useState(0);

  useEffect(() => {
    async function loadWallet() {
      if (!session?.user?.email) return;

      try {
        const res = await axios.get(`/api/wallet/balance?userId=${session.user?._id}`);
        if (res.data.success) {
          setBalance(res.data.balance || 0);
          setSafeBalance(res.data.safe || 0);
        }
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
      }
    }

    loadWallet();
  }, [session]);

  // fetch total transaction volume on mount & whenever session changes 
  useEffect(() => {
    if (!session?.user?._id) return;
    axios.get('/api/transactions/total')
      .then(res => {
        if (res.data.success) setVolume(res.data.totalValue || 0);
      })
      .catch(console.error);
  }, [session]);
  
  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <FaTimes className='text-black' size={20} /> : <FaBars size={20}  className='text-black' />}
      </button>

      {/* Sidebar drawer */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-200 shadow-md flex flex-col
          transform transition-transform duration-300 z-40 pt-20
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:z-auto
        `}
      >
        {/* Balance Section */}
        <div className="bg-blue-500 text-white p-4 text-center">
          <h3 className="text-lg font-bold">${balance.toFixed(4)}</h3>
          <p className="text-sm">MY BALANCE</p>
        </div>
        {/* Total Volume */}
      <div className="bg-purple-600 text-white p-4 text-center mt-2">
        <h3 className="text-lg font-bold">${volume.toFixed(2)}</h3>
        <p className="text-sm">TOTAL TRANSACTION VALUE</p>
      </div>
        {/* Uncomment if you need safeBalance */}
        {/* <div className="bg-teal-500 text-white p-4 text-center">
          <h3 className="text-lg font-bold">${safeBalance.toFixed(4)}</h3>
          <p className="text-sm">MONEY IN SAFE</p>
        </div> */}

        {/* Menu Items */}
        <div className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link href="/Wallet">
                <span className="flex items-center text-gray-700 hover:text-blue-500">
                  <FaWallet className="mr-3" />
                  MY WALLET
                </span>
              </Link>
            </li>
            <li>
              <Link href="/referrals">
                <span className="flex items-center text-gray-700 hover:text-blue-500">
                  <FaLink className="mr-3" />
                  MY REF LINK
                </span>
              </Link>
            </li>
            {/* <li className="flex items-center text-gray-700 hover:text-blue-500">
              <FaCreditCard className="mr-3" />
              PAYMENT DETAILS
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
