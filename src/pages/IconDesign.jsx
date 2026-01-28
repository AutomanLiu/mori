import React from 'react';

export default function IconDesign() {
    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
            {/* Icon Container (1024x1024) scaled down for view if needed, but designed for capture */}
            <div id="app-icon" className="relative w-[512px] h-[512px] bg-black rounded-[110px] flex items-center justify-center overflow-hidden shadow-2xl border border-neutral-900/50">

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black  z-0" />
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_0%,_rgba(52,211,153,0.15),_transparent_70%)] z-0" />

                {/* Battery Container */}
                <div className="relative z-10 flex flex-col items-center transform scale-110">
                    {/* Nipple */}
                    <div className="w-24 h-8 bg-neutral-800 rounded-t-xl mb-1 mx-auto border-t border-x border-neutral-700/50" />

                    {/* Body */}
                    <div className="w-64 h-[22rem] bg-neutral-900/90 backdrop-blur-xl rounded-[3rem] border-[6px] border-neutral-800/80 relative overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.15)] flex items-center justify-center">

                        {/* Background Grid (Very faint) */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-transparent" />

                        {/* Hourglass SVG */}
                        <div className="relative z-20 w-48 h-48 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <defs>
                                    <linearGradient id="sandGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" /> {/* Emerald 400 */}
                                        <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan 500 */}
                                    </linearGradient>
                                </defs>
                                {/* Top Bulb Sand */}
                                <path d="M7 2h10v2h-1l-2 4h-4l-2-4h-1V2z" fill="url(#sandGradient)" opacity="0.3" />

                                {/* Bottom Bulb Sand (Accumulating) */}
                                <path d="M7 22h10v-2h-1l-2-4h-4l-2 4h-1v2z" fill="url(#sandGradient)" />

                                {/* Trickle */}
                                <rect x="11.5" y="10" width="1" height="8" fill="#34d399" opacity="0.8" />

                                {/* Glass Frame */}
                                <path d="M17 2H7v2h1l3.5 7L8 18H7v4h10v-4h-1l-3.5-7L16 4h1V2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
                            </svg>
                        </div>

                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

                        {/* Inner Bevel Highlight */}
                        <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 pointer-events-none" />

                    </div>
                </div>

                {/* Glossy Reflection (Icon Overlay) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[110px]" />
            </div>
        </div>
    );
}
