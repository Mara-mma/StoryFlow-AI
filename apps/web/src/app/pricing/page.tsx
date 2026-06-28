'use client'

import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <div className="text-xs font-bold text-[#FF6719] uppercase tracking-[0.1em] mb-3">
          Pricing
        </div>
        <h1 className="text-[42px] font-black tracking-[-1.5px] leading-[1.1] text-[#0A0A0A] dark:text-white mb-3">
          Simple pricing for every stage
        </h1>
        <p className="text-[17px] text-[#555555] dark:text-[#A0A0A0] max-w-[500px] mx-auto">
          Start free. Upgrade when you&apos;re ready to post every day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-7">
          <div className="text-xs font-bold text-[#999999] dark:text-[#666666] uppercase tracking-[0.1em] mb-2">
            Free
          </div>
          <div className="text-[40px] font-black tracking-[-2px] text-[#0A0A0A] dark:text-white mb-1">
            <span className="text-[20px] font-semibold align-top">$</span>0
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666] mb-5">forever</div>
          <ul className="list-none flex flex-col gap-2.5 mb-7">
            {[
              ['5 stories per month', true],
              ['3 platforms', true],
              ['Basic scene scripts', true],
              ['Camera directions', false],
              ['Narration scripts', false],
              ['PDF / TXT export', false],
            ].map(([text, ok]) => (
              <li key={text as string} className={`text-[13px] flex gap-2 items-start ${ok ? 'text-[#555555] dark:text-[#A0A0A0]' : 'text-[#999999] dark:text-[#666666]'}`}>
                <span className={`font-bold shrink-0 ${ok ? 'text-[#FF6719]' : 'text-[#999999] dark:text-[#666666]'}`}>
                  {ok ? '✓' : '✕'}
                </span>
                {text as string}
              </li>
            ))}
          </ul>
          <Link
            href="/generate"
            className="block text-center bg-[#F7F7F8] dark:bg-[#161616] hover:bg-[#EDEDED] dark:hover:bg-[#1E1E1E] text-[#0A0A0A] dark:text-white font-bold px-5 py-3 rounded-xl text-sm transition-all no-underline border border-[#E5E5E5] dark:border-[#2A2A2A]"
          >
            Get started free
          </Link>
        </div>

        <div className="bg-[rgba(255,103,25,0.03)] border-2 border-[#FF6719] rounded-2xl p-7 relative">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#FF6719] text-white text-[10px] font-extrabold tracking-[0.07em] uppercase px-3.5 py-1.5 rounded-b-lg">
            Most popular
          </div>
          <div className="text-xs font-bold text-[#999999] dark:text-[#666666] uppercase tracking-[0.1em] mb-2">
            Creator
          </div>
          <div className="text-[40px] font-black tracking-[-2px] text-[#0A0A0A] dark:text-white mb-1">
            <span className="text-[20px] font-semibold align-top">$</span>19
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666] mb-5">per month</div>
          <ul className="list-none flex flex-col gap-2.5 mb-7">
            {[
              'Unlimited stories',
              'All 6 platforms',
              'Full production scripts',
              'Camera & scene directions',
              'Narration with pacing cues',
              'PDF, TXT & Teleprompter export',
            ].map((text) => (
              <li key={text} className="text-[13px] text-[#555555] dark:text-[#A0A0A0] flex gap-2 items-start">
                <span className="text-[#FF6719] font-bold shrink-0">✓</span>
                {text}
              </li>
            ))}
          </ul>
          <Link
            href="/generate"
            className="block text-center bg-[#FF6719] hover:bg-[#FF7A2E] text-white font-bold px-5 py-3 rounded-xl text-sm transition-all no-underline"
          >
            Upgrade now
          </Link>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-7">
          <div className="text-xs font-bold text-[#999999] dark:text-[#666666] uppercase tracking-[0.1em] mb-2">
            Agency
          </div>
          <div className="text-[40px] font-black tracking-[-2px] text-[#0A0A0A] dark:text-white mb-1">
            <span className="text-[20px] font-semibold align-top">$</span>79
          </div>
          <div className="text-[13px] text-[#999999] dark:text-[#666666] mb-5">per month</div>
          <ul className="list-none flex flex-col gap-2.5 mb-7">
            {[
              'Everything in Creator',
              'Up to 10 team seats',
              'Brand voice profiles',
              'Bulk story generation',
              'Priority queue',
              'Dedicated onboarding call',
            ].map((text) => (
              <li key={text} className="text-[13px] text-[#555555] dark:text-[#A0A0A0] flex gap-2 items-start">
                <span className="text-[#FF6719] font-bold shrink-0">✓</span>
                {text}
              </li>
            ))}
          </ul>
          <Link
            href="/generate"
            className="block text-center bg-[#F7F7F8] dark:bg-[#161616] hover:bg-[#EDEDED] dark:hover:bg-[#1E1E1E] text-[#0A0A0A] dark:text-white font-bold px-5 py-3 rounded-xl text-sm transition-all no-underline border border-[#E5E5E5] dark:border-[#2A2A2A]"
          >
            Contact sales
          </Link>
        </div>
      </div>
    </div>
  )
}
