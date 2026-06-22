'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = document.documentElement.classList.contains('dark')
    const dotColor = (base: number) => isDark ? `rgba(255,255,255,${base})` : `rgba(0,0,0,${base * 0.5})`
    const lineColor = (alpha: number) => isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.5})`

    let mouse = { x: -9999, y: -9999 }
    let W: number, H: number
    let dots: { x: number; y: number; vx: number; vy: number; r: number; base: number }[] = []

    function resize() {
      const wrap = canvas!.parentElement!
      W = canvas!.width = wrap.offsetWidth
      H = canvas!.height = wrap.offsetHeight
    }

    function makeDots() {
      dots = []
      const count = Math.floor((W * H) / 8000)
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0,
          r: Math.random() * 1.2 + 0.4, base: Math.random() * 0.25 + 0.08,
        })
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W!, H!)
      for (const d of dots) {
        const dx = mouse.x - d.x, dy = mouse.y - d.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const R = 120
        if (dist < R && dist > 0) {
          const force = (R - dist) / R
          d.vx -= (dx / dist) * force * 3.5
          d.vy -= (dy / dist) * force * 3.5
        }
        d.vx *= 0.88; d.vy *= 0.88
        d.x += d.vx; d.y += d.vy
        d.x = Math.max(0, Math.min(W!, d.x))
        d.y = Math.max(0, Math.min(H!, d.y))
        const dfm = Math.sqrt((mouse.x - d.x) ** 2 + (mouse.y - d.y) ** 2)
        const glow = dfm < 200 ? Math.max(0, (200 - dfm) / 200) * 0.6 : 0
        ctx!.beginPath()
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx!.fillStyle = glow > 0 ? `rgba(255,103,25,${d.base + glow})` : dotColor(d.base)
        ctx!.fill()
        for (const o of dots) {
          const ex = d.x - o.x, ey = d.y - o.y
          const ed = Math.sqrt(ex * ex + ey * ey)
          if (ed < 90 && ed > 0) {
            ctx!.beginPath()
            ctx!.moveTo(d.x, d.y)
            ctx!.lineTo(o.x, o.y)
            ctx!.strokeStyle = lineColor((1 - ed / 90) * 0.07)
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }
      requestAnimationFrame(draw)
    }

    const wrap = canvas.parentElement!
    wrap.addEventListener('mousemove', (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    })
    wrap.addEventListener('mouseleave', () => { mouse = { x: -9999, y: -9999 } })

    resize(); makeDots(); draw()
    window.addEventListener('resize', () => { resize(); makeDots() })
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
}

const words = ['TikTok', 'Reels', 'YouTube Shorts', 'every platform']

const TYPING_LINES = [
  "Writing camera directions for scene 2",
  "Polishing dialogue for scene 3",
  "Adjusting pacing for TikTok",
  "Adding narration voiceover cues",
]

function TypingAnimation() {
  const [display, setDisplay] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')
  const idx = useRef(0)

  useEffect(() => {
    const current = TYPING_LINES[lineIdx]

    if (phase === 'typing') {
      if (idx.current < current.length) {
        const t = setTimeout(() => {
          idx.current++
          setDisplay(current.slice(0, idx.current))
        }, 55 + Math.random() * 35)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('pause'), 300)
      return () => clearTimeout(t)
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('deleting'), 1800)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (idx.current > 0) {
        const t = setTimeout(() => {
          idx.current--
          setDisplay(current.slice(0, idx.current))
        }, 25 + Math.random() * 15)
        return () => clearTimeout(t)
      }
      setLineIdx((lineIdx + 1) % TYPING_LINES.length)
      setPhase('typing')
    }
  }, [display, phase, lineIdx])

  return <>{display}</>
}

function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setWordIndex(i => (i + 1) % words.length), 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden bg-[#F7F7F8] dark:bg-[#0A0A0A]">
      <ParticlesCanvas />
      <div className="max-w-[1160px] mx-auto px-10 pt-[110px] pb-[100px] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-[2]">
        <div>
          <div className="inline-flex items-center gap-2 bg-[rgba(255,103,25,0.12)] border border-[rgba(255,103,25,0.25)] text-[#FF9A60] text-xs font-semibold tracking-wider uppercase px-[14px] py-[6px] rounded-full mb-7 opacity-0 translate-y-5 animate-[fadeUp_0.7s_0.1s_forwards]">
            <span className="w-[6px] h-[6px] bg-[#FF6719] rounded-full animate-[pulse_2s_infinite]" />
            Now with AI voiceover scripts
          </div>
          <h1 className="text-[54px] font-black leading-[1.06] tracking-[-2.5px] mb-[22px] opacity-0 translate-y-6 animate-[fadeUp_0.7s_0.25s_forwards] text-[#0A0A0A] dark:text-white">
            Turn ideas into{' '}
            <span className="text-[#FF6719]">viral stories</span><br />
            in seconds.
          </h1>
          <p className="text-[17px] text-[#555555] dark:text-[#A0A0A0] leading-[1.7] max-w-[500px] mb-9 opacity-0 translate-y-5 animate-[fadeUp_0.7s_0.4s_forwards]">
            Generate production-ready scripts for TikTok, Reels, YouTube Shorts and more — with scenes, dialogue, narration, and camera direction built in.
          </p>
          <div className="flex items-center gap-3.5 mb-11 opacity-0 translate-y-5 animate-[fadeUp_0.7s_0.55s_forwards]">
            <Link
              href="/generate"
              className="bg-[#FF6719] hover:bg-[#FF7A2E] text-white border-none px-[30px] py-[15px] rounded-xl text-[15px] font-bold no-underline transition-all duration-250 tracking-[-0.2px] inline-block hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,103,25,0.4)]"
            >
              Create your first story →
            </Link>
          </div>
        </div>
        <div className="opacity-0 translate-y-[30px] scale-[0.97] animate-[fadeUp_0.8s_0.5s_forwards] relative">
          <div className="absolute -inset-px rounded-[22px] bg-gradient-to-br from-[rgba(255,103,25,0.3)] to-transparent pointer-events-none z-0" />
          <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-[26px] relative z-[1] overflow-hidden">
            <div className="flex items-center justify-between mb-[18px]">
              <div className="flex items-center gap-[7px] bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[7px] px-[11px] py-[5px]">
                <span className="w-[7px] h-[7px] bg-[#22C55E] rounded-full animate-[breathe_1.8s_ease-in-out_infinite]" />
                <span className="text-xs font-medium text-[#555555] dark:text-[#A0A0A0]">Generating story&hellip;</span>
              </div>
              <div className="flex gap-[6px]">
                <span className="bg-[rgba(255,103,25,0.12)] text-[#FF9A60] text-[11px] font-semibold px-[9px] py-[4px] rounded-[5px]">Horror</span>
                <span className="bg-[rgba(255,103,25,0.12)] text-[#FF9A60] text-[11px] font-semibold px-[9px] py-[4px] rounded-[5px]">60s</span>
              </div>
            </div>
            <div className="text-[17px] font-extrabold tracking-[-0.4px] mb-[10px] text-[#0A0A0A] dark:text-white">The Last Voicemail</div>
            <div className="text-[12.5px] text-[#555555] dark:text-[#A0A0A0] leading-[1.75] mb-[18px]">
              <em className="text-[#0A0A0A] dark:text-white not-italic font-medium">SCENE 1 — BEDROOM, 3AM.</em>{' '}
              Close-up of a phone screen lighting up a pitch-black room.
              Notification reads:{' '}
              <em className="text-[#0A0A0A] dark:text-white not-italic font-medium">
                &quot;Voicemail from: MOM (missed)&quot;
              </em>{' '}
              — timestamped three years after her death.
              <br />
              <br />
              <em className="text-[#0A0A0A] dark:text-white not-italic font-medium">NARRATION (V.O.):</em>{' '}
              &quot;I almost deleted it. I should have deleted it.&quot;
            </div>
            <div className="grid grid-cols-3 gap-[7px] mb-3.5">
              {['The Discovery', 'The Message', 'The Twist'].map((s, i) => (
                <div key={s} className="bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[7px] p-[9px] text-center">
                  <div className="text-[9px] text-[#999999] dark:text-[#666666] font-bold tracking-[0.1em] mb-[3px]">
                    SCENE {i + 1}
                  </div>
                  <div className="text-[11px] font-semibold text-[#0A0A0A] dark:text-white">{s}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[7px] px-[13px] py-[10px] mb-3.5">
              <span className="text-xs text-[#999999] dark:text-[#666666]">
                <TypingAnimation />
                <span className="inline-block w-[2px] h-3 bg-[#FF6719] rounded-sm ml-[2px] align-[-1px] animate-blink" />
              </span>
            </div>
            <div className="flex gap-[7px]">
              <span className="flex items-center gap-[5px] bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] px-[9px] py-[5px] text-[11px] font-semibold text-[#555555] dark:text-[#A0A0A0]">
                📱 TikTok ready
              </span>
              <span className="flex items-center gap-[5px] bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] px-[9px] py-[5px] text-[11px] font-semibold text-[#555555] dark:text-[#A0A0A0]">
                🎬 Reels ready
              </span>
              <span className="flex items-center gap-[5px] bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] px-[9px] py-[5px] text-[11px] font-semibold text-[#555555] dark:text-[#A0A0A0]">
                ▶ Shorts ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlatformCard({
  logo,
  name,
  desc,
  specs,
}: {
  logo: React.ReactNode
  name: string
  desc: string
  specs: string[]
}) {
  return (
    <div className="reveal bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-[26px] transition-all duration-300 cursor-pointer hover:border-[rgba(255,103,25,0.35)] hover:-translate-y-[5px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="mb-4">{logo}</div>
      <div className="text-[16px] font-bold text-[#0A0A0A] dark:text-white mb-[7px]">{name}</div>
      <div className="text-[13px] text-[#555555] dark:text-[#A0A0A0] leading-[1.65]">{desc}</div>
      <div className="flex gap-[5px] mt-3 flex-wrap">
        {specs.map(s => (
          <span
            key={s}
            className="bg-[#F0F0F0] dark:bg-[#222222] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#999999] dark:text-[#666666] text-[11px] font-medium px-[8px] py-[3px] rounded-[4px]"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function PlatformsSection() {
  const cards = [
    {
      logo: (
        <div className="w-[46px] h-[46px] rounded-xl bg-[#F0F0F0] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center text-[13px] font-black tracking-[-1px] text-[#0A0A0A] dark:text-white">
          TT
        </div>
      ),
      name: 'TikTok',
      desc: 'Hook-first scripts with rapid scene cuts, trending audio cues, and on-screen text prompts optimized for the For You Page.',
      specs: ['15–60s', 'Hook in 3s', 'Vertical 9:16'],
    },
    {
      logo: (
        <div className="w-[46px] h-[46px] rounded-xl bg-[#1877F2] flex items-center justify-center text-[14px] font-black text-white">
          fb
        </div>
      ),
      name: 'Facebook Reels',
      desc: 'Warmer tone, longer narrative arcs, and community-friendly story structures for Feed and Watch.',
      specs: ['Up to 90s', 'Wider audience', 'Emotional pull'],
    },
    {
      logo: (
        <div className="w-[46px] h-[46px] rounded-xl bg-[#FF0000] flex items-center justify-center text-[14px] font-black text-white">
          ▶
        </div>
      ),
      name: 'YouTube Shorts',
      desc: 'Search-optimized narratives with strong retention curves and clear chapter moments that drive replays.',
      specs: ['Up to 60s', 'SEO titles', 'Re-watch hooks'],
    },
    {
      logo: (
        <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-[13px] font-black text-white">
          ig
        </div>
      ),
      name: 'Instagram Reels',
      desc: 'Aesthetic-forward storytelling with visual direction notes, caption suggestions, and hashtag-ready beats.',
      specs: ['Up to 90s', 'Aesthetic cues', 'Captions'],
    },
    {
      logo: (
        <div className="w-[46px] h-[46px] rounded-xl bg-black border border-[#333] flex items-center justify-center text-[13px] font-extrabold text-white">
          X
        </div>
      ),
      name: 'X / Twitter',
      desc: 'Punchy, opinionated takes made to spark replies, quote-posts, and go viral in fast-moving feeds.',
      specs: ['Up to 2m20s', 'Thread format', 'Debate-ready'],
    },
    {
      logo: (
        <div className="w-[46px] h-[46px] rounded-xl bg-[#FFFC00] flex items-center justify-center text-[19px]">
          👻
        </div>
      ),
      name: 'Snapchat Spotlight',
      desc: 'Informal, playful, audience-first narratives for Snap\'s younger, mobile-native audience who reward authenticity.',
      specs: ['Up to 60s', 'Casual tone', 'Gen Z voice'],
    },
  ]

  return (
    <section id="platforms" className="max-w-[1160px] mx-auto px-10 py-[90px]">
      <div className="eye reveal">Platforms</div>
      <h2 className="st reveal">Built for how creators actually post</h2>
      <p className="ss reveal text-[#555555] dark:text-[#A0A0A0]">
        Each platform has its own pacing, format, and audience expectations.
        StoryFlow AI knows the difference.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-12">
        {cards.map(c => (
          <PlatformCard key={c.name} {...c} />
        ))}
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      n: '1',
      title: 'Set your preferences',
      desc: 'Pick platform, genre, story length, character type, and setting from guided dropdowns — or let AI suggest a mix.',
      detail: 'Genre · Tone · Character · Setting · Duration · Hook style',
    },
    {
      n: '2',
      title: 'Review the blueprint',
      desc: 'Before full generation, see a story outline — title, premise, three-act arc, and key beats. Tweak anything before it writes.',
      detail: 'Edit title · Swap genre · Adjust pacing · Regenerate beats',
    },
    {
      n: '3',
      title: 'Get your full package',
      desc: 'Receive scene-by-scene scripts, narrator lines, dialogue, camera directions, and on-screen text — in one export.',
      detail: 'PDF · TXT · Teleprompter mode · Copy to clipboard',
    },
  ]

  return (
    <div className="bg-[#F7F7F8] dark:bg-[#141414] border-y border-[#E5E5E5] dark:border-[#2A2A2A]">
      <div id="how-it-works" className="max-w-[1160px] mx-auto px-10 py-[90px]">
        <div className="eye reveal">How it works</div>
        <h2 className="st reveal">
          From blank page to ready-to-film in under a minute
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-14 relative">
          <div className="hidden md:block absolute top-[23px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-[#FF6719] via-[#999999]/30 dark:via-white/10 to-[#FF6719] opacity-60 dark:opacity-30" />
          {steps.map(s => (
            <div key={s.n} className="reveal px-[30px] text-center">
              <div className="w-[46px] h-[46px] bg-[#FF6719] rounded-full inline-flex items-center justify-center text-[15px] font-black text-white mb-[18px] relative z-[1] transition-transform duration-300 hover:scale-110">
                {s.n}
              </div>
              <h3 className="text-[16px] font-bold tracking-[-0.2px] mb-[9px] text-[#0A0A0A] dark:text-white">
                {s.title}
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-[#A0A0A0] leading-[1.65]">{s.desc}</p>
              <div className="mt-3 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[7px] px-[12px] py-[9px] text-xs text-[#999999] dark:text-[#666666] leading-[1.55] text-left">
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: '🎭',
      title: '20+ story genres',
      desc: 'Horror, romance, comedy, thriller, mystery, true crime, self-improvement, and more — each with its own pacing templates and hook styles.',
    },
    {
      icon: '🎬',
      title: 'Camera & scene direction',
      desc: 'Every scene comes with shot type, angle, and lighting notes so you know exactly how to film it — no director required.',
    },
    {
      icon: '🗣️',
      title: 'Narration & dialogue',
      desc: 'Full voiceover scripts with natural pacing breaks, emphasis markers, and character-specific dialogue in your chosen tone.',
    },
    {
      icon: '🔁',
      title: 'One-click regeneration',
      desc: 'Not quite right? Regenerate individual scenes, swap the ending, or shift the tone — without starting from scratch.',
    },
  ]

  return (
    <section id="features" className="max-w-[1160px] mx-auto px-10 py-[90px]">
      <div className="eye reveal">Features</div>
      <h2 className="st reveal">Everything a solo creator needs</h2>
      <p className="ss reveal text-[#555555] dark:text-[#A0A0A0]">
        No production team. No writer on retainer. Just you and an AI that knows
        storytelling.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-12">
        {features.map(f => (
          <div
            key={f.title}
            className="reveal bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-[26px] transition-colors duration-200 hover:border-[#D0D0D0] dark:hover:border-[#3A3A3A]"
          >
            <div className="w-10 h-10 bg-[rgba(255,103,25,0.12)] border border-[rgba(255,103,25,0.2)] rounded-xl flex items-center justify-center text-[18px] mb-3.5">
              {f.icon}
            </div>
            <div className="text-[16px] font-bold tracking-[-0.2px] mb-[7px] text-[#0A0A0A] dark:text-white">
              {f.title}
            </div>
            <div className="text-[13px] text-[#555555] dark:text-[#A0A0A0] leading-[1.65]">{f.desc}</div>
          </div>
        ))}
        <div className="reveal bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-[26px] transition-colors duration-200 hover:border-[#D0D0D0] dark:hover:border-[#3A3A3A] md:col-span-2">
          <div className="w-10 h-10 bg-[rgba(255,103,25,0.12)] border border-[rgba(255,103,25,0.2)] rounded-xl flex items-center justify-center text-[18px] mb-3.5">
            📦
          </div>
          <div className="text-[16px] font-bold tracking-[-0.2px] mb-[7px] text-[#0A0A0A] dark:text-white">
            Full production package in every export
          </div>
          <div className="text-[13px] text-[#555555] dark:text-[#A0A0A0] leading-[1.65] mb-3">
            Every story you generate includes:
          </div>
          <ul className="list-none flex flex-col gap-[7px]">
            {[
              'Scene-by-scene script with timing markers',
              'On-screen text suggestions and caption hooks',
              'Voiceover narration with emphasis cues',
              'Teleprompter-ready format for direct reading',
              'Platform-specific duration guides and character counts',
              'Hashtag clusters and caption copy for each platform',
            ].map(item => (
              <li
                key={item}
                className="text-[13px] text-[#555555] dark:text-[#A0A0A0] flex items-start gap-2 leading-[1.5]"
              >
                <span className="text-[#FF6719] font-bold shrink-0">✓</span>{' '}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="max-w-[1160px] mx-auto px-10 pb-[90px]">
      <div className="eye reveal">Pricing</div>
      <h2 className="st reveal">Simple pricing for every stage</h2>
      <p className="ss reveal text-[#555555] dark:text-[#A0A0A0]">
        Start free. Upgrade when you&apos;re ready to post every day.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-12">
        <div className="reveal bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-[26px]">
          <div className="text-xs font-bold text-[#999999] dark:text-[#666666] uppercase tracking-[0.1em] mb-[10px]">
            Free
          </div>
          <div className="text-[40px] font-black tracking-[-2px] mb-[3px] text-[#0A0A0A] dark:text-white">
<span className="text-[20px] font-semibold align-top leading-none">$</span>
            0
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666] mb-[18px]">forever</div>
          <hr className="border-t border-[#E5E5E5] dark:border-[#2A2A2A] my-4" />
          <ul className="list-none flex flex-col gap-[9px]">
            {[
              { text: '5 stories per month', ok: true },
              { text: '3 platforms', ok: true },
              { text: 'Basic scene scripts', ok: true },
              { text: 'Camera directions', ok: false },
              { text: 'Narration scripts', ok: false },
              { text: 'PDF / TXT export', ok: false },
            ].map((item, i) => (
              <li
                key={i}
                className={`text-[13px] flex gap-2 items-start ${item.ok ? 'text-[#555555] dark:text-[#A0A0A0]' : 'text-[#999999] dark:text-[#666666]'}`}
              >
                <span
                  className={`font-bold shrink-0 ${item.ok ? 'text-[#FF6719]' : 'text-[#999999] dark:text-[#666666]'}`}
                >
                  {item.ok ? '✓' : '✕'}
                </span>{' '}
                {item.text}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="w-full mt-[22px]">
            Get started free
          </Button>
        </div>

        <div className="reveal bg-[rgba(255,103,25,0.03)] border border-[rgba(255,103,25,0.4)] rounded-2xl p-[26px] relative">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#FF6719] text-white text-[10px] font-extrabold tracking-[0.07em] uppercase px-[13px] py-[5px] rounded-b-[7px]">
            Most popular
          </div>
          <div className="text-xs font-bold text-[#999999] dark:text-[#666666] uppercase tracking-[0.1em] mb-[10px]">
            Creator
          </div>
          <div className="text-[40px] font-black tracking-[-2px] mb-[3px] text-[#0A0A0A] dark:text-white">
<span className="text-[20px] font-semibold align-top leading-none">$</span>
            19
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666] mb-[18px]">per month</div>
          <hr className="border-t border-[#E5E5E5] dark:border-[#2A2A2A] my-4" />
          <ul className="list-none flex flex-col gap-[9px]">
            {[
              'Unlimited stories',
              'All 6 platforms',
              'Full production scripts',
              'Camera & scene directions',
              'Narration with pacing cues',
              'PDF, TXT & Teleprompter export',
            ].map((text, i) => (
              <li
                key={i}
                className="text-[13px] text-[#555555] dark:text-[#A0A0A0] flex gap-2 items-start"
              >
                <span className="text-[#FF6719] font-bold shrink-0">✓</span>{' '}
                {text}
              </li>
            ))}
          </ul>
          <Button className="w-full mt-[22px]">
            Start 7-day free trial
          </Button>
        </div>

        <div className="reveal bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-[26px]">
          <div className="text-xs font-bold text-[#999999] dark:text-[#666666] uppercase tracking-[0.1em] mb-[10px]">
            Agency
          </div>
          <div className="text-[40px] font-black tracking-[-2px] mb-[3px] text-[#0A0A0A] dark:text-white">
<span className="text-[20px] font-semibold align-top leading-none">$</span>
            79
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666] mb-[18px]">per month</div>
          <hr className="border-t border-[#E5E5E5] dark:border-[#2A2A2A] my-4" />
          <ul className="list-none flex flex-col gap-[9px]">
            {[
              'Everything in Creator',
              'Up to 10 team seats',
              'Brand voice profiles',
              'Bulk story generation',
              'Priority queue',
              'Dedicated onboarding call',
            ].map((text, i) => (
              <li
                key={i}
                className="text-[13px] text-[#555555] dark:text-[#A0A0A0] flex gap-2 items-start"
              >
                <span className="text-[#FF6719] font-bold shrink-0">✓</span>{' '}
                {text}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="w-full mt-[22px]">
            Contact sales
          </Button>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <div className="text-center px-10 py-[110px] relative overflow-hidden">
      <div className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,103,25,0.1)_0%,transparent_70%)] pointer-events-none" />
      <h2 className="text-[54px] font-black tracking-[-2.5px] leading-[1.08] mb-3.5 relative z-[1] text-[#0A0A0A] dark:text-white">
        Your next viral story<br />
        is <span className="text-[#FF6719]">30 seconds away.</span>
      </h2>
      <p className="text-[17px] text-[#555555] dark:text-[#A0A0A0] mb-[34px] relative z-[1]">
        No writing experience needed. Just a story worth telling.
      </p>
      <div className="flex items-center justify-center gap-3.5 relative z-[1]">
        <Link
          href="/generate"
          className="bg-[#FF6719] hover:bg-[#FF7A2E] text-white border-none px-[36px] py-[16px] rounded-xl text-[16px] font-bold no-underline transition-all duration-250 tracking-[-0.2px] inline-block hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,103,25,0.4)]"
        >
          Create your first story →
        </Link>
      </div>
      <p className="text-[13px] text-[#999999] dark:text-[#666666] mt-3.5 relative z-[1]">
        No credit card required · Free forever plan available
      </p>
    </div>
  )
}

export default function HomePage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.4; transform: scale(1.5) } }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes breathe { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.4); opacity: 0.4 } }
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .eye { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #FF6719; margin-bottom: 14px; }
        .st { font-size: 42px; font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 12px; }
        .ss { font-size: 17px; max-width: 500px; line-height: 1.65; }
      `}</style>
      <HeroSection />
      <PlatformsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <footer className="border-t border-[#E5E5E5] dark:border-[#2A2A2A] py-[38px] px-10">
        <div className="max-w-[1160px] mx-auto flex items-center justify-between">
          <div className="font-extrabold text-[17px] tracking-tight text-[#0A0A0A] dark:text-white">
            StoryFlow <span className="text-[#FF6719]">AI</span>
          </div>
          <div className="flex gap-[22px]">
            <a href="#" className="text-[#999999] dark:text-[#666666] hover:text-[#555555] dark:hover:text-[#A0A0A0] text-[13px] no-underline transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[#999999] dark:text-[#666666] hover:text-[#555555] dark:hover:text-[#A0A0A0] text-[13px] no-underline transition-colors">
              Terms
            </a>
            <a href="#" className="text-[#999999] dark:text-[#666666] hover:text-[#555555] dark:hover:text-[#A0A0A0] text-[13px] no-underline transition-colors">
              Blog
            </a>
            <a href="#" className="text-[#999999] dark:text-[#666666] hover:text-[#555555] dark:hover:text-[#A0A0A0] text-[13px] no-underline transition-colors">
              Changelog
            </a>
            <a href="#" className="text-[#999999] dark:text-[#666666] hover:text-[#555555] dark:hover:text-[#A0A0A0] text-[13px] no-underline transition-colors">
              Support
            </a>
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666]">&copy; 2025 StoryFlow AI</div>
        </div>
      </footer>
    </>
  )
}
