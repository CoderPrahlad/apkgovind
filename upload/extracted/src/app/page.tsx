'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, Globe, Shield, Zap, Headphones, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react'

// ─── Animated Counter ────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Floating Particles ──────────────────────────────────────
// Pre-computed particle positions to avoid hydration mismatch
const PARTICLE_COUNT = 20
const particleData = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  // Deterministic positions based on index
  initialX: (i * 137.5) % 1200,
  initialY: (i * 223.7) % 800,
  duration: 4 + (i % 7) * 0.8,
  delay: (i % 11) * 0.5,
}))

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particleData.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          style={{ left: p.initialX, top: p.initialY }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Section Wrapper ─────────────────────────────────────────
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Stagger Children ────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ─── Main Page ───────────────────────────────────────────────
// Pre-computed current year to avoid hydration mismatch
const CURRENT_YEAR = 2025

export default function MatkaKingLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Download', href: '#download' },
    { label: 'Trusted', href: '#trust' },
    { label: 'Support', href: '#support' },
  ]

  const stats = [
    { title: '50K+', value: 50, suffix: 'K+', desc: 'Users' },
    { title: '24×7', desc: 'Support' },
    { title: 'Instant', desc: 'Withdrawals' },
    { title: '100%', desc: 'Mobile Ready' },
  ]

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Withdrawals',
      desc: 'Fast processing with smooth wallet experience. Get your winnings in minutes, not hours.',
      gradient: 'from-emerald-500 to-green-400',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trusted Platform',
      desc: 'Advanced systems focused on reliability and performance. Your data stays safe.',
      gradient: 'from-cyan-500 to-blue-400',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Easy Mobile Access',
      desc: 'Smooth experience optimized for Android devices. Play anywhere, anytime.',
      gradient: 'from-emerald-400 to-teal-400',
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: '24×7 Support',
      desc: 'Dedicated customer support anytime you need help. We are always here for you.',
      gradient: 'from-teal-500 to-cyan-400',
    },
  ]

  const downloadFeatures = [
    { icon: <Zap className="w-4 h-4 text-emerald-400" />, text: 'Fast Install' },
    { icon: <Shield className="w-4 h-4 text-emerald-400" />, text: 'Secure Access' },
    { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: 'Live Updates' },
    { icon: <Smartphone className="w-4 h-4 text-emerald-400" />, text: 'Optimized Performance' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#020817] text-white overflow-x-hidden font-sans">
      {/* Background Effects - static divs to avoid hydration mismatch, animated only on client */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <FloatingParticles />

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? 'bg-black/40 shadow-lg shadow-black/20' : 'bg-black/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xl sm:text-2xl font-black shadow-2xl shadow-emerald-500/30"
            >
              MK
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Matka<span className="text-emerald-400">King</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400">Number Game Platform</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-emerald-400 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-black/40 backdrop-blur-xl"
            >
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm mb-6"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Trusted By Thousands Of Users</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
            >
              INDIA&apos;S
              <br />
              FASTEST
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                MATKA PLATFORM
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-gray-300 text-base sm:text-lg leading-relaxed mt-6 sm:mt-8 max-w-2xl"
            >
              Secure gaming experience with lightning-fast performance, instant updates,
              wallet system, live gameplay and seamless mobile access.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10"
            >
              <a
                href="#download"
                className="group bg-emerald-500 hover:bg-emerald-400 text-black transition-all duration-300 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-400/40 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download APK
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="https://sattamatkagovind-app-3.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-300 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Open Platform
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-14"
            >
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(16,185,129,0.3)' }}
                  className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 backdrop-blur-xl transition-colors"
                >
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {item.value ? <AnimatedCounter target={item.value} suffix={item.suffix} /> : item.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* App Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 blur-3xl bg-emerald-500/30 rounded-full"
              />

              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative bg-zinc-900 border border-white/10 rounded-[40px] p-3 sm:p-4 shadow-[0_0_80px_rgba(16,185,129,0.2)] w-[300px] sm:w-[350px]"
              >
                <div className="bg-[#031320] rounded-[32px] overflow-hidden border border-white/10">
                  {/* App Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-5 sm:p-6 text-black">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black">MatkaKing</h2>
                        <p className="text-xs sm:text-sm font-semibold opacity-80">Verified Gaming Platform</p>
                      </div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/20 flex items-center justify-center font-black text-xl sm:text-2xl">
                        MK
                      </div>
                    </div>
                  </div>

                  {/* App Body */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Wallet Balance</p>
                          <h3 className="text-2xl sm:text-3xl font-black mt-1">₹18,450</h3>
                        </div>
                        <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[10, 25, 55, 78, 42, 99].map((num, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          whileHover={{ scale: 1.1, borderColor: 'rgba(16,185,129,0.5)' }}
                          className="aspect-square rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-xl sm:text-2xl font-black cursor-pointer transition-colors"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-colors text-sm sm:text-base"
                      >
                        Play Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white/10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-colors text-sm sm:text-base"
                      >
                        Wallet
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Trust / Features Section */}
        <Section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              Why Choose <span className="text-emerald-400">MatkaKing</span>
            </h2>
            <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto">
              Experience the best-in-class gaming platform built for speed, trust, and convenience.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {features.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, borderColor: 'rgba(16,185,129,0.3)' }}
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7 backdrop-blur-xl hover:bg-white/[0.07] transition-colors duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-black mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black">{item.title}</h3>
                <p className="text-gray-400 mt-2 sm:mt-3 leading-relaxed text-xs sm:text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Trusted By Section */}
        <Section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl sm:rounded-[40px] p-8 sm:p-12 backdrop-blur-xl">
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <h3 className="text-4xl sm:text-5xl font-black text-emerald-400">
                  <AnimatedCounter target={50} suffix="K+" />
                </h3>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Active Users</p>
              </div>
              <div>
                <h3 className="text-4xl sm:text-5xl font-black text-cyan-400">
                  <AnimatedCounter target={99} suffix="%" />
                </h3>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Uptime Guarantee</p>
              </div>
              <div>
                <h3 className="text-4xl sm:text-5xl font-black text-emerald-400">
                  <AnimatedCounter target={24} suffix="×7" />
                </h3>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Customer Support</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Download Section */}
        <Section id="download" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto rounded-[32px] sm:rounded-[40px] overflow-hidden border border-white/10 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-black p-8 sm:p-12 text-center backdrop-blur-2xl relative">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm mb-6">
                <span>🔥</span>
                <span>Latest Android Version Available</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                DOWNLOAD
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  MATKA KING APK
                </span>
              </h2>

              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mt-4 sm:mt-6 leading-relaxed">
                Install the latest version now and access the premium mobile gaming experience.
              </p>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mt-8 sm:mt-10">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-black transition-colors shadow-[0_0_50px_rgba(16,185,129,0.35)] flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download APK
                </motion.a>

                <motion.a
                  href="https://sattamatkagovind-app-3.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-white/20 hover:bg-white/10 transition-colors px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  Open Website
                </motion.a>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-14 text-left"
              >
                {downloadFeatures.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-black/30 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                  >
                    {item.icon}
                    <p className="font-semibold text-xs sm:text-sm">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Responsible Notice */}
        <Section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <h3 className="text-xl sm:text-2xl font-black text-yellow-400">⚠️ 18+ Responsible Gaming</h3>
            <p className="text-gray-300 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
              This platform is intended only for users above 18 years of age.
              Please participate responsibly and ensure compliance with your local laws and regulations.
            </p>
          </div>
        </Section>

        {/* Support Section */}
        <Section id="support" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl text-center">
            <h3 className="text-2xl sm:text-3xl font-black">Need Help?</h3>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Our support team is available 24×7 to assist you with any questions or issues.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <motion.a
                href="#"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/10 hover:bg-white/15 transition-colors px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2"
              >
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Support
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                FAQ
              </motion.a>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-6 sm:mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              Matka<span className="text-emerald-400">King</span>
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Premium Number Game Platform
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Responsible Gaming</a>
            <a href="#support" className="hover:text-emerald-400 transition-colors">Support</a>
          </div>
        </div>

        <div className="border-t border-white/5 py-4 text-center text-gray-500 text-xs">
          © {CURRENT_YEAR} MatkaKing. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
