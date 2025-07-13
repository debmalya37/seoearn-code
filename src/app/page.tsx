// app/page.tsx
'use client';
import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import InteractiveHero from '@src/components/InteractiveHero';
import Hero2 from '@src/components/Hero2';
import { motion } from 'framer-motion'
import CountUp from 'react-countup'


export default function Home() {

  const steps = [
    {
      icon: 'fa6-solid:tasks',
      title: 'Post a Task',
      desc: 'Advertisers spin up tasks in seconds, set your budget, and watch the work roll in. Get the results you need fast.'
    },
    {
      icon: 'fa6-solid:user-check',
      title: 'Complete & Earn',
      desc: 'Freelancers choose tasks, submit proof, and get paid instantly upon approval.'
    },
    {
      icon: 'fa6-solid:sitemap',
      title: 'Referral Bonuses',
      desc: 'Automatically earn 10% on direct referrals and 5% on second‑level signups.'
    }
  ]
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-black">
      <Hero2 />
      {/* Hero */}
      {/* <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-teal-500 text-white flex flex-col-reverse lg:flex-row items-center px-6 lg:px-24 py-24">
        {/* Decorative floating icons
        <div className="pointer-events-none absolute top-10 left-1/4 animate-float-slow">
          <Icon icon="fa6-solid:check-circle" className="text-white/30 w-12 h-12" />
        </div>
        <div className="pointer-events-none absolute bottom-16 right-1/3 animate-float">
          <Icon icon="fa6-solid:tasks" className="text-white/20 w-14 h-14" />
        </div>

        <div className="lg:w-1/2 space-y-6 z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-snug tracking-tight drop-shadow-lg">
            Earn from Micro‑Tasks<br className="hidden md:inline" />
            or Post Your Own
          </h1>
          <p className="text-lg lg:text-xl opacity-90 max-w‑2xl">
            Connect advertisers and freelancers on one platform—get tasks done or earn real cash, plus multi‑level referral bonuses.
          </p>
          <div className="flex gap-4">
            <Link href="/sign-in" className="relative">
              <Button className="bg-white/90 text-green-600 font-semibold px-6 py-3 backdrop-blur-sm hover:bg-white">
                Get Started
              </Button>
              <span className="absolute inset-0 rounded border-2 border-white opacity-0 hover:opacity-40 transition" />
            </Link>
            <Link href="/task-feed">
              <Button variant="bordered" className="border-white text-white px-6 py-3 hover:bg-white hover:bg-opacity-20">
                Browse Tasks
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 mb-12 lg:mb-0 flex justify-center relative z-10">
          <img
            src="/assets/hero-illustration.svg"
            alt="Micro‑tasks dashboard"
            className="w-full max-w-lg drop-shadow-2xl"
          />
        </div>

        {/* SVG wave separator 
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M0,0 C360,120 1080,0 1440,120 L1440,0 L0,0 Z" />
          </svg>
        </div>
      </section> */}

      {/* Demo Credentials (Glassmorphic card) */}
      {/* Demo Credentials — Dark Glass Hero */}
<section className="relative py-20 px-6 lg:px-24 bg-gray-900 text-gray-200">
  {/* Accent Top Bar */}
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-teal-400 rounded-b-lg" />

  <h2 className="relative text-3xl lg:text-4xl font-extrabold text-center mb-12">
    Demo Login Credentials
  </h2>

  <div className="max-w-md mx-auto">
    <div className="relative p-10 bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
      {/* Faux Terminal Buttons */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="block w-3 h-3 bg-yellow-500 rounded-full"></span>
        <span className="block w-3 h-3 bg-green-500 rounded-full"></span>
      </div>

      {[
        { label: 'URL', value: 'https://seoearningspace.com/sign-in' },
        { label: 'Email', value: 'test@gmail.com' },
        { label: 'Password', value: 'test@123' },
      ].map((item) => (
        <div key={item.label} className="flex justify-between items-center mb-6">
          <span className="font-semibold text-teal-300">{item.label}:</span>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-700 bg-opacity-60 px-3 py-1 rounded text-sm">
              {item.value}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(item.value)}
              className="p-1 hover:bg-gray-700 rounded transition"
              title="Copy to clipboard"
            >
              <Icon icon="mdi:content-copy" className="w-5 h-5 text-teal-300" />
            </button>
          </div>
        </div>
      ))}

      {/* Action Button */}
      <div className="mt-8 text-center">
        <Link href="/sign-in">
          <span className="inline-block px-8 py-3 bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold rounded-lg shadow-lg transition">
            Try Demo Now
          </span>
        </Link>
      </div>
    </div>
  </div>
</section>


     {/* How It Works */}
     <section className="relative overflow-hidden bg-[#000318] text-gray-200 py-24 px-6 lg:px-32">
      {/* Floating gradient blobs */}
      <motion.div
        className="absolute top-10 left-1/3 w-64 h-64 bg-green-600/20 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-16 right-1/4 w-80 h-80 bg-teal-600/20 rounded-full filter blur-2xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      {/* Section Title */}
      <div className="relative z-10 mb-16 text-center">
        <h2 className="text-5xl font-extrabold">How It Works</h2>
        <p className="mt-2 text-lg opacity-80">
          Three simple steps to get started and start earning today.
        </p>
      </div>

      {/* Steps Grid */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        {steps.map((s, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Card className="p-8 bg-[#11142f]/50 backdrop-blur-md border border-[#1f203f] rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-500/30 p-4 rounded-full transition-all group-hover:bg-green-500">
                  <Icon icon={s.icon} className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-100">{s.title}</h3>
              <p className="text-gray-300">{s.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="block w-full h-8"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M1200 0L0 120 1200 120V0Z"
            fill="#000318"
          />
        </svg>
      </div>
    </section>

{/* Stats */}
<section className="relative py-20 px-6 lg:px-24 bg-gray-900 text-white overflow-hidden">
  {/* Subtle animated gradient blobs */}
  <motion.div
    className="absolute top-0 left-1/4 w-72 h-72 bg-green-700/20 rounded-full filter blur-3xl"
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
  />
  <motion.div
    className="absolute bottom-0 right-1/3 w-96 h-96 bg-green-800/20 rounded-full filter blur-2xl"
    animate={{ y: [0, -30, 0] }}
    transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
  />

  <h2 className="relative text-4xl lg:text-5xl font-extrabold text-center mb-12 z-10">
    Platform Statistics
  </h2>

  <div className="relative max-w-6xl mx-auto grid gap-8 md:grid-cols-3 z-10">
    {[
      { icon: 'mdi:wallet', label: 'Paid Out', end: 634000000 },
      { icon: 'mdi:calendar-check', label: 'Daily Tasks', end: 1500 },
      { icon: 'mdi:briefcase', label: 'Advertisers', end: 54000 },
    ].map((s, idx) => (
      <motion.div
        key={s.label}
        className="p-8 bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg text-center group hover:scale-105 transition-transform"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.2 }}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-600/30 p-3 rounded-full group-hover:bg-green-600 transition-colors">
            <Icon icon={s.icon} className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="text-5xl font-extrabold mb-2">
          <CountUp end={s.end} duration={2.5} separator="," />
        </div>
        <p className="uppercase tracking-wider opacity-80">{s.label}</p>
      </motion.div>
    ))}
  </div>
</section>

{/* Testimonials (Dark Glass Cards) */}
<section className="relative py-20 px-6 lg:px-24 bg-gray-900 text-gray-200">
  {/* Top accent bar */}
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-400 rounded-b-lg" />

  <h2 className="relative text-4xl font-extrabold text-center mb-12">
    What Our Users Say
  </h2>

  <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
    {[
      {
        quote: "“Tasks are clear, payouts are instant—love it!”",
        name: "Carlos H.",
        flag: "🇧🇷"
      },
      {
        quote: "“Super user‑friendly interface and reliable payments.”",
        name: "Joanne",
        flag: "🇫🇷"
      },
      {
        quote: "“Referral bonuses really stack up. Highly recommend!”",
        name: "José",
        flag: "🇲🇽"
      }
    ].map((t, i) => (
      <div
        key={i}
        className="relative p-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl"
      >
        {/* Faux terminal window buttons */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
        </div>

        {/* Quote */}
        <p className="text-lg italic mb-6 leading-relaxed">
          {t.quote}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-700 my-4" />

        {/* Author */}
        <div className="flex items-center space-x-3">
          {/* Flag */}
          <span className="text-2xl">{t.flag}</span>
          {/* Name */}
          <span className="font-semibold text-teal-300">{t.name}</span>
          {/* Stars */}
          <div className="flex space-x-1">
            {[...Array(5)].map((_, star) => (
              <Icon
                key={star}
                icon="fa6-solid:star"
                className="text-yellow-400 w-4 h-4"
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


{/* Footer */}
     
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
      <h5 className="text-white font-semibold mb-4">Follow Us</h5>
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
</footer>

    </div>
  );
}
