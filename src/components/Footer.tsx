import Link from 'next/link'
import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { Icon } from '@iconify/react';
function Footer() {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-400 py-16 px-6 lg:px-24 border-[#000318] border-t-[5px] border-x-0">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    <div>
      <h5 className="text-white font-semibold mb-4">About</h5>
      <p>Micro‑tasks & digital goods marketplace. Earn, refer, and grow with us.</p>
    </div>
    <div>
      <h5 className="text-white font-semibold mb-4">Quick Links</h5>
      <ul className="space-y-2">
        <li>
          <Link href="/terms-and-conditions" className="hover:text-white">
            Terms
          </Link>
        </li>
        <li>
          <Link href="/privacy-policy" className="hover:text-white">
            Privacy
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-white">
            Support
          </Link>
        </li>
      </ul>
    </div>
    <div>
      <h5 className="text-white font-semiabold mb-4">Follow Us</h5>
      <div className="flex space-x-4 text-xl">
        <Link href="#" className="hover:text-white">
          <Icon icon="mdi:facebook" />
        </Link>
        <Link href="#" className="hover:text-white">
          <Icon icon="mdi:twitter" />
        </Link>
        <Link href="#" className="hover:text-white">
          <Icon icon="mdi:instagram" />
        </Link>
      </div>
    </div>
  </div>
  <p className="text-center text-sm mt-12">&copy; {new Date().getFullYear()} SEO Earning Space. All rights reserved.</p>
  <div className="text-center md:text-right">
            <p className="text-gray-500">
              Proudly powered by <strong>Kyrptaroid</strong>
            </p>
            <p className="text-gray-500">&copy; SEO Earning Space, 2024. All rights reserved.</p>
          </div>
</footer>
    </div>
  )
}

export default Footer
