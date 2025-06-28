import Link from 'next/link'
import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <div>
      <footer className="bg-white py-8 px-4 md:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0 text-gray-600 text-2xl">
            <Link href="https://facebook.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="Facebook">
                <FaFacebookF />
              </span>
            </Link>
            <Link href="https://twitter.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="Twitter">
                <FaTwitter />
              </span>
            </Link>
            <Link href="https://instagram.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="Instagram">
                <FaInstagram />
              </span>
            </Link>
            <Link href="https://linkedin.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </span>
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500">
              Proudly powered by <strong>Kyrptaroid</strong>
            </p>
            <p className="text-gray-500">&copy; SEO Earning Space, 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
