'use client'

import { useState } from "react";
import Link from "next/link";
import { MeshGradient } from "@paper-design/shaders-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TwitchIcon } from '@/components/icons/twitch-icon';
import { ValorantIcon } from '@/components/icons/valorant-icon';

export default function Page() {
  const [isHoveredTwitch, setIsHoveredTwitch] = useState(false);
  const [isHoveredValorant, setIsHoveredValorant] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background animations */}
      <MeshGradient
        color1="#0F0F1B"  // Very dark blue-black
        color2="#1F1F3A"  // Dark navy blue
        color3="#2A1F3D"  // Dark purple
        color4="#1A1A2F"  // Dark blue-gray
        speed={0.10}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="py-6 text-center">
          <h1 className="font-bold text-2xl">Nexus</h1>
        </header>

        {/* Main Content */}
        <main className="py-20 flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="max-w-4xl w-full">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Twitch Card */}
              <Card 
                className="bg-white/10 backdrop-blur-xl border-white/20 relative overflow-hidden group"
                onMouseEnter={() => setIsHoveredTwitch(true)}
                onMouseLeave={() => setIsHoveredTwitch(false)}
              >
                {/* Animated blob background */}
                <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-purple-400/10" />
                  <div 
                    className="absolute size-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4), transparent 70%)',
                      filter: 'blur(40px)',
                      animation: isHoveredTwitch ? 'blob 7s infinite' : 'none',
                    }}
                  />
                  <div 
                    className="absolute size-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3), transparent 70%)',
                      filter: 'blur(40px)',
                      animation: isHoveredTwitch ? 'blob 7s infinite reverse' : 'none',
                      animationDelay: '-3.5s',
                    }}
                  />
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white relative z-10">
                    <TwitchIcon className="w-8 h-8 text-purple-400" />
                    <span>Twitch</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-300">
                    Experience a sleek Twitch chat UI interface. Engage with streamers and fellow viewers in real-time, with customizable themes and emote support.
                  </CardDescription>
                  <Link href="/twitch/chat">
                    <Button variant="outline" className="mt-4 bg-purple-400 text-white border-purple-400 hover:bg-transparent hover:text-purple-400">
                      Open Twitch Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Valorant Card */}
              <Card 
                className="bg-white/10 backdrop-blur-xl border-white/20 relative overflow-hidden group"
                onMouseEnter={() => setIsHoveredValorant(true)}
                onMouseLeave={() => setIsHoveredValorant(false)}
              >
                {/* Animated blob background */}
                <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-red-500/10" />
                  <div 
                    className="absolute size-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4), transparent 70%)',
                      filter: 'blur(40px)',
                      animation: isHoveredValorant ? 'blob 7s infinite' : 'none',
                    }}
                  />
                  <div 
                    className="absolute size-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3), transparent 70%)',
                      filter: 'blur(40px)',
                      animation: isHoveredValorant ? 'blob 7s infinite reverse' : 'none',
                      animationDelay: '-3.5s',
                    }}
                  />
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white relative z-10">
                    <ValorantIcon className="w-8 h-8 text-red-500" />
                    <span>Valorant</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-300">
                    Dive into detailed Valorant player statistics. Track performance, analyze match history, and compare stats with friends or pro players.
                  </CardDescription>
                  <Link href="/valorant/stats">
                    <Button variant="outline" className="mt-4 bg-red-500 text-white border-red-500 hover:bg-transparent hover:text-red-500">
                      Check Valorant Stats
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          33% {
            transform: translate(-50%, -50%) scale(1.1) translate(10%, 10%);
          }
          66% {
            transform: translate(-50%, -50%) scale(0.9) translate(-10%, -10%);
          }
        }
      `}</style>
    </div>
  );
}