'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TwitchIcon } from '@/components/icons/twitch-icon'
import { ValorantIcon } from '@/components/icons/valorant-icon'

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient bg-gradient-dark" />
        <div className="absolute inset-0 animate-gradient opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(75,75,75,0.3),transparent_70%)]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 animate-gradient opacity-20 bg-[radial-gradient(circle_at_0%_0%,rgba(100,100,100,0.2),transparent_50%)]" style={{ animationDelay: '-10s' }} />
      </div>
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="py-6 text-center">
          <h1 className="font-bold text-2xl">Nexus</h1>
        </header>

        {/* Main Content */}
        <main className="py-20 flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="max-w-4xl w-full">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TwitchIcon className="w-8 h-8 text-purple-400" />
                    <span>Twitch</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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

              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <ValorantIcon className="w-8 h-8 text-red-500" />
                    <span>Valorant</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Dive into detailed Valorant player statistics. Track performance, analyze match history, and compare stats with friends or pro players.
                  </CardDescription>
                  <Button variant="outline" className="mt-4 bg-red-500 text-white border-red-500 hover:bg-transparent hover:text-red-500">
                    Check Valorant Stats
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}