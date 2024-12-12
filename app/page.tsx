import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { theme } from '@/lib/theme'

export default function Home() {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <h1 className="text-4xl md:text-6xl font-bold">
          Earn Money by Watching
          <span className="bg-clip-text text-transparent block" 
            style={{ backgroundImage: theme.gradients.primary }}>
            Video Ads
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of users who are earning money by simply watching video advertisements. 
          Start earning today with just a few simple steps.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/how-it-works">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-xl bg-white shadow-sm border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Earn Money</h3>
          <p className="text-gray-600">Get paid for every video ad you watch. Earn up to 200 XAF daily!</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white shadow-sm border">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Quick Withdrawals</h3>
          <p className="text-gray-600">Withdraw your earnings instantly to your mobile money account.</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white shadow-sm border">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Refer Friends</h3>
          <p className="text-gray-600">Earn 1000 XAF for each friend you refer who joins the platform.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="text-center space-y-8 py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Trusted by Thousands</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-primary">10K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary">₣50M+</div>
            <div className="text-gray-600">Paid Out</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent">100K+</div>
            <div className="text-gray-600">Videos Watched</div>
          </div>
        </div>
      </section>
    </div>
  )
}

