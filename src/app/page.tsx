import React from "react";
import { Button, Card, Image, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import NotificationBell from "@src/components/NotificationBell";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
        {/* <NotificationBell /> */}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f6fef9] to-white min-h-[90vh] flex flex-col-reverse md:flex-row items-center justify-between px-4 py-8 md:px-16 gap-8 relative overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#e9f7f1] rounded-full opacity-50 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#e9f7f1] rounded-full opacity-50 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        {/* Left Text */}
        <div className="max-w-xl mt-8 md:mt-0 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            YOUR BEST PLACE TO GET EASY MICRO TASKS <br className="hidden md:block" />
            AND EARN REAL MONEY FROM IT
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-6 leading-relaxed">
            POST YOUR MICRO TASK ADVERTISEMENTS AND GET IT DONE BY MANY FREELANCERS
          </p>
          <div className="flex space-x-4">
            <Link href="/sign-in">
            <Button 
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 transition-all duration-300"
              size="lg"
            >
              Get Started
            </Button>
            </Link>
            <Link
            href="/TaskFeed"
            >
            <Button
              variant="bordered"
              className="border-green-600 text-green-700 px-6 py-3 transition-all duration-300 hover:bg-green-50"
              size="lg"
              
            >
              View Demo
            </Button>
            </Link>
          </div>
        </div>

        {/* Right Image/Chart */}
        <div className="flex justify-center md:w-1/2 z-10">
          <div className="relative">
            {/* Circle background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#e9f7f1]"></div>
            
            {/* Person image */}
            <img
              src="https://picsum.photos/600/600"
              alt="Person working on laptop"
              className="relative z-10 rounded-full w-[400px] h-[400px] object-cover"
              // removeWrapper
            />
          </div>
        </div>
      </section>
{/* "Save Money. Make Money" Section */}
<section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 px-4 md:px-16 overflow-hidden">
  {/* Background swirl or shape (optional) */}
  <div className="absolute inset-0 bg-[url('https://picsum.photos/1600/900?blur=3')] bg-cover bg-center opacity-30" />

  {/* Overlay to darken background if needed */}
  <div className="absolute inset-0 bg-black opacity-20" />

  <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center z-10">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
      Save Money. Make Money.
    </h1>
    <p className="text-lg md:text-xl mb-8">
      Members like you have already cashed out:
    </p>

    {/* Large currency figure */}
    <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4">
      ₹ 634,206,386
    </div>

    <p className="text-sm md:text-base text-gray-100">
      in cash back from using OurPlatform
    </p>
  </div>
</section>

{/* Payment Stats Section */}
<section className="relative bg-gradient-to-r from-teal-700 to-cyan-600 py-12 px-4 md:px-16 text-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Card 1 */}
    <div className="flex flex-col p-6 bg-white/10 rounded shadow">
      {/* Image at the top */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded">
        <img
          src="https://picsum.photos/400/300?random=10" // or any image URL
          alt="Paid to members"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-3xl font-bold">$634,206,386</h3>
      <p className="text-white/90 mt-2">paid to members around the globe</p>
    </div>

    {/* Card 2 */}
    <div className="flex flex-col p-6 bg-white/10 rounded shadow">
      <div className="w-full h-48 mb-4 overflow-hidden rounded">
        <img
          src="https://picsum.photos/400/300?random=23" // or any image URL
          alt="Gift cards"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-3xl font-bold">7,000+</h3>
      <p className="text-white/90 mt-2">
        gift cards redeemed daily from popular merchants and restaurants
      </p>
    </div>

    {/* Card 3 */}
    <div className="flex flex-col p-6 bg-white/10 rounded shadow">
      <div className="w-full h-48 mb-4 overflow-hidden rounded">
        <img
          src="https://picsum.photos/400/300?random=35" // or any image URL
          alt="Retailers"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-3xl font-bold">1,500+</h3>
      <p className="text-white/90 mt-2">of retailers to earn cash‑back from</p>
    </div>
  </div>
</section>


      {/* Stats Row */}
      <section className="bg-white py-8 md:py-12 px-4 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Stat 1 */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-700">31,991</h3>
            <p className="text-gray-600">Total participants</p>
          </div>
          {/* Stat 2 */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-700">482</h3>
            <p className="text-gray-600">Now Online</p>
          </div>
          {/* Stat 3 */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-700">10,053,575</h3>
            <p className="text-gray-600">Total Earned</p>
          </div>
        </div>
      </section>

      {/* Three Feature Cards */}
      <section className="bg-[#f6fef9] py-12 px-4 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: As well as */}
          <Card className="p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="w-full mb-4 overflow-hidden rounded">
              <img
                src="https://picsum.photos/400/300?random=1"
                alt="Feature image"
                className="object-contain w-full h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">As well as:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                A typical you can influence to help users decide whether they should
                visit your site through those search results.
              </li>
              <li>A typical you can influence to help users decide.</li>
              <li>
                A typical you can influence to help users decide whether they
                should visit.
              </li>
              <li>
                A typical you can influence to help users decide whether they
                should visit your site through.
              </li>
            </ul>
          </Card>

          {/* Card 2: Your Benefits */}
          <Card className="p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="w-full mb-4 overflow-hidden rounded">
              <img
                src="https://picsum.photos/400/300?random=2"
                alt="Feature image"
                className="object-contain w-full h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">Your Benefits:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                A typical you can influence to help users decide whether they should
                visit your site through those search results.
              </li>
              <li>A typical you can influence to help users decide.</li>
              <li>
                A typical you can influence to help users decide whether they
                should visit.
              </li>
              <li>
                A typical you can influence to help users decide whether they
                should visit your site through.
              </li>
            </ul>
          </Card>

          {/* Card 3: Especially for you */}
          <Card className="p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="w-full mb-4 overflow-hidden rounded">
              <img
                src="https://picsum.photos/400/300?random=3"
                alt="Feature image"
                className="object-contain w-full h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">Especially for you:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                A typical you can influence to help users decide whether they should
                visit your site through those search results.
              </li>
              <li>A typical you can influence to help users decide.</li>
              <li>
                A typical you can influence to help users decide whether they
                should visit.
              </li>
              <li>
                A typical you can influence to help users decide whether they
                should visit your site through.
              </li>
            </ul>
          </Card>
        </div>
      </section>

{/* Testimonials Section */}
<section className="bg-white py-12 px-4 md:px-16">
  <h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
  
  {/* Horizontal scroll container for the testimonial cards */}
  <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto pb-4">
    {/* Each testimonial card */}
    <div className="min-w-[280px] w-[280px] bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col">
      {/* Star Ratings & Verified Badge */}
      <div className="flex items-center mb-2">
        {/* Example star icons (using Iconify or any icon library) */}
        {[...Array(5)].map((_, i) => (
          <Icon key={i} icon="fa6-solid:star" className="text-green-600 w-4 h-4 mr-1" />
        ))}
        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-[2px] rounded-full">Verified</span>
      </div>
      {/* Short Review Text */}
      <p className="text-sm text-gray-700 mb-4">
        “Gostei muito. A great platform to earn from micro tasks. Highly recommended!”
      </p>
      {/* Reviewer Name */}
      <div className="mt-auto text-xs text-gray-500">
        Carlos Henrique <br />
        <span className="text-gray-400">User from Brazil</span>
      </div>
    </div>

    {/* Repeat for other testimonial cards */}
    <div className="min-w-[280px] w-[280px] bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} icon="fa6-solid:star" className="text-green-600 w-4 h-4 mr-1" />
        ))}
        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-[2px] rounded-full">Verified</span>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        “Super experiência – super user-friendly. Earned money quickly. Awesome!”
      </p>
      <div className="mt-auto text-xs text-gray-500">
        Joanne, <br />
        <span className="text-gray-400">User from France</span>
      </div>
    </div>

    <div className="min-w-[280px] w-[280px] bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} icon="fa6-solid:star" className="text-green-600 w-4 h-4 mr-1" />
        ))}
        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-[2px] rounded-full">Verified</span>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        “Muy Buenas encuestas. I love how simple the tasks are. Payout is fast.”
      </p>
      <div className="mt-auto text-xs text-gray-500">
        José, <br />
        <span className="text-gray-400">User from Mexico</span>
      </div>
    </div>

    <div className="min-w-[280px] w-[280px] bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} icon="fa6-solid:star" className="text-green-600 w-4 h-4 mr-1" />
        ))}
        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-[2px] rounded-full">Verified</span>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        “Super et fiable ! The micro tasks are straightforward. Great support too.”
      </p>
      <div className="mt-auto text-xs text-gray-500">
        Angélique, <br />
        <span className="text-gray-400">User from Belgium</span>
      </div>
    </div>

    <div className="min-w-[280px] w-[280px] bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} icon="fa6-solid:star" className="text-green-600 w-4 h-4 mr-1" />
        ))}
        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-[2px] rounded-full">Verified</span>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        “Excelente plataforma de micro tareas. Very easy to use. Love it!”
      </p>
      <div className="mt-auto text-xs text-gray-500">
        Jorge, <br />
        <span className="text-gray-400">User from Spain</span>
      </div>
    </div>
  </div>

  {/* Trustpilot-like note and Sign Up button */}
  <div className="text-center mt-8">
    <p className="text-sm text-gray-500 mb-4">
      Rated 4.0 / 5 based on 39,244 reviews. Showing our 5 star reviews.
    </p>
    <Link href="/sign-up">
    <Button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 transition-all duration-300">
      Sign Up Now
    </Button>
    </Link>
  </div>
</section>

      {/* Additional Single Stat */}
      <section className="bg-white py-12 px-4 md:px-16">
        <Card className="max-w-md mx-auto bg-green-50 p-6 text-center">
          <h3 className="text-4xl font-bold text-green-700">54,641</h3>
          <p className="text-gray-600">Advertisers</p>
        </Card>
      </section>

      {/* Total Earned Card */}
      {/* <section className="bg-white py-12 px-4 md:px-16">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Card className="w-72 h-72 rounded-full bg-green-100 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Total Earned</h2>
            <span className="text-4xl font-bold text-green-700">$10,053,575</span>
          </Card>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-white py-8 px-4 md:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0 text-gray-600">
            <Link href="https://facebook.com" className="hover:text-green-700">
              <Icon icon="fa6-brands:facebook-f" width={24} height={24} />
            </Link>
            <Link href="https://twitter.com" className="hover:text-green-700">
              <Icon icon="fa6-brands:twitter" width={24} height={24} />
            </Link>
            <Link href="https://instagram.com" className="hover:text-green-700">
              <Icon icon="fa6-brands:instagram" width={24} height={24} />
            </Link>
            <Link href="https://linkedin.com" className="hover:text-green-700">
              <Icon icon="fa6-brands:linkedin-in" width={24} height={24} />
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
  );
}
