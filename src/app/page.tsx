// app/page.tsx - Landing Page
import Image from 'next/image';
import Link from 'next/link';
// import { Navbar } from '@/components/layout/Navbar';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { FeatureCard } from '../../components/landing/FeatureCard';
import { StatsSection } from '../../components/landing/StatsSection';
import { Footer } from '../../components/layout/Footer';
import { FeaturePill } from '../../components/ui/FeaturePill';
import { StatsCard } from '../../components/ui/StatsCard';
import { TestimonialCard } from '@/components/landing/TestimonialCard';
import { FAQItem } from '@/components/landing/FAQItem';
import { PricingCard } from '@/components/landing/PricingCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-pink-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 hover:shadow-md transition-shadow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-blue-700">🚀 Live Collaboration Platform</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Collaborate Smarter,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Faster, Together
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              The all-in-one workspace for your team. Real-time editing, task management,
              and seamless communication — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="primary"
                className="shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300 px-8"
              >
                Get Started Free
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-gray-50 px-8"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
              <span className="font-medium text-gray-700">4.9/5</span>
              <span className="text-gray-400">·</span>
              <span>Based on 1,500+ reviews</span>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <FeaturePill icon="⚡" text="Real-time" />
              <FeaturePill icon="📋" text="Task Board" />
              <FeaturePill icon="💬" text="Collab Chat" />
              <FeaturePill icon="📊" text="Kanban" />
              <FeaturePill icon="📝" text="Notes" />
              <FeaturePill icon="💬" text="Team messaging" />
              <FeaturePill icon="🔄" text="Drag & drop" />
              <FeaturePill icon="✏️" text="Live editing" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard 
              value="10,000+"
              label="Teams Worldwide"
              icon="🌍"
              subtext="and growing rapidly"
            />
            <StatsCard 
              value="4.9/5"
              label="Average Rating"
              icon="⭐"
              subtext="Based on 1,500+ reviews"
            />
            <StatsCard 
              value="99.9%"
              label="Uptime"
              icon="📈"
              subtext="Reliable infrastructure"
            />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Work Together
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help your team collaborate seamlessly and achieve more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="💬"
              title="Real-time Chat"
              description="Instant messaging with your team. Share ideas, files, and feedback in real-time with threaded conversations."
              gradient="from-blue-500/10 to-blue-600/5"
            />
            <FeatureCard
              icon="📋"
              title="Task Board"
              description="Kanban-style boards to track progress, assign tasks, and manage projects efficiently with drag-and-drop."
              gradient="from-purple-500/10 to-purple-600/5"
            />
            <FeatureCard
              icon="📝"
              title="Collaborative Notes"
              description="Write and edit notes together with live cursor tracking, version history, and real-time updates."
              gradient="from-green-500/10 to-green-600/5"
            />
            <FeatureCard
              icon="🔄"
              title="Drag & Drop"
              description="Intuitive drag-and-drop interface for organizing tasks, files, and content across your workspace."
              gradient="from-orange-500/10 to-orange-600/5"
            />
            <FeatureCard
              icon="✏️"
              title="Live Editing"
              description="See changes in real-time as team members edit documents and projects. Never miss an update."
              gradient="from-pink-500/10 to-pink-600/5"
            />
            <FeatureCard
              icon="🎯"
              title="Team Messaging"
              description="Organized channels for different teams, projects, and discussions. Keep communication focused."
              gradient="from-indigo-500/10 to-indigo-600/5"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Teams{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our customers say about their experience with CollabBoard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Sarah Johnson"
              role="CEO, TechStart Inc."
              content="CollabBoard has transformed how our team works. We've seen a 40% increase in productivity since switching."
              rating={5}
              avatar="SJ"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Project Manager, DesignStudio"
              content="The real-time collaboration features are incredible. We can now work together seamlessly from anywhere."
              rating={5}
              avatar="MC"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Lead Developer, CodeCraft"
              content="Best collaboration tool we've ever used. The kanban board and chat integration is exactly what we needed."
              rating={5}
              avatar="ER"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose the{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Right Plan
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent pricing that grows with your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              name="Starter"
              price="$0"
              description="Perfect for small teams getting started"
              features={[
                "Up to 10 members",
                "5 projects",
                "Basic chat",
                "Task management",
                "Community support"
              ]}
              buttonText="Get Started"
              isPopular={false}
            />
            <PricingCard
              name="Pro"
              price="$29"
              description="Most popular for growing teams"
              features={[
                "Up to 50 members",
                "Unlimited projects",
                "Advanced chat",
                "Kanban boards",
                "Real-time editing",
                "Priority support"
              ]}
              buttonText="Start Free Trial"
              isPopular={true}
            />
            <PricingCard
              name="Enterprise"
              price="$99"
              description="For large organizations with needs"
              features={[
                "Unlimited members",
                "Custom integrations",
                "Advanced analytics",
                "Dedicated support",
                "SLA guarantee",
                "Custom onboarding"
              ]}
              buttonText="Contact Sales"
              isPopular={false}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about CollabBoard
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="What is CollabBoard?"
              answer="CollabBoard is an all-in-one workspace that combines real-time chat, task management, collaborative notes, and team messaging in one platform. It's designed to help teams work together more efficiently."
            />
            <FAQItem
              question="How does the free trial work?"
              answer="We offer a 14-day free trial with full access to all Pro features. No credit card required. You can cancel anytime during the trial period."
            />
            <FAQItem
              question="Can I switch plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll only pay for what you use."
            />
            <FAQItem
              question="Is my data secure?"
              answer="We take security seriously. All data is encrypted in transit and at rest. We're GDPR compliant and SOC2 certified."
            />
            <FAQItem
              question="Does it integrate with other tools?"
              answer="Yes, CollabBoard integrates with popular tools like Slack, GitHub, Jira, Trello, and many more through our API and webhooks."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Team Collaboration?
              </h2>
              <p className="text-blue-100 mb-8 text-lg max-w-md mx-auto">
                Join 10,000+ teams already collaborating smarter with CollabBoard
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 px-8"
                >
                  Start Your Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Schedule Demo
                </Button>
              </div>
              <p className="text-blue-200 text-sm mt-4">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-gray-900">Integrations</Link></li>
                <li><Link href="/changelog" className="hover:text-gray-900">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/press" className="hover:text-gray-900">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-gray-900">Status</Link></li>
                <li><Link href="/community" className="hover:text-gray-900">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
                <li><Link href="/security" className="hover:text-gray-900">Security</Link></li>
                <li><Link href="/cookies" className="hover:text-gray-900">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
                <div className="absolute inset-[3px] bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">CB</span>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Collab<span className="text-blue-600">Board</span>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 CollabBoard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}