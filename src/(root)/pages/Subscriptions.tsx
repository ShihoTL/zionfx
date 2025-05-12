import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckIcon, TrendingUp, Award, Clock, Users } from 'lucide-react';
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { useSubscription } from '@/hooks/useSubscription';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice'; // Adjust based on your path

import { useToast } from "@/components/toast-context";

const SubscriptionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <PricingSection />
      </main>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="h-fit relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-purple-600/40 to-blue-700/50 dark:from-yellow-400/30 dark:via-purple-700/50 dark:to-blue-900/70">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;20&quot; height=&quot;20&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h1v1H0V0zm19 0h1v1h-1V0zM0 19h1v1H0v-1zm19 19h1v1h-1v-1z&quot; fill=&quot;rgba(255,255,255,0.05)&quot;/%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="absolute left-0 w-full inset-0 bg-gradient-to-b from-white/40 dark:from-black/40 to-transparent blur z-[9]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background z-[8] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
              Master the Markets
            </span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl">
              with Professional Guidance
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join the elite community of traders who consistently profit from the forex market through expert mentorship and real-time analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <Card icon={<TrendingUp className="w-10 h-10 text-yellow-500 mb-4" />} title="Advanced Strategies" desc="Proven trading methods that adapt to market conditions" />
          <Card icon={<Award className="w-10 h-10 text-yellow-500 mb-4" />} title="Expert Mentorship" desc="Personal guidance from professional forex traders" />
          <Card icon={<Clock className="w-10 h-10 text-yellow-500 mb-4" />} title="Real-time Signals" desc="24/7 market analysis and trading opportunities" />
          <Card icon={<Users className="w-10 h-10 text-yellow-500 mb-4" />} title="Community Access" desc="Connect with successful traders worldwide" />
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Trusted by over 10,000+ traders worldwide • 95% client satisfaction rate
          </p>
        </div>
      </div>
    </section>
  );
};

const Card = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="backdrop-blur-sm card p-6 rounded-xl border border-gray-600">
    {icon}
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-foreground/40">{desc}</p>
  </div>
);

const PricingSection: React.FC = () => {
  const pricingPlans = [
    {
      name: "FX Signals",
      price: 50,
      features: [
        "Daily trading signals",
        "Entry and exit points",
        "Risk management guidelines",
        "24/7 signal alerts",
        "Mobile notifications"
      ]
    },
    {
      name: "Grouped Mentorship",
      price: 200,
      features: [
        "Weekly group sessions",
        "Trade analysis & reviews",
        "Strategy development",
        "Market insights newsletter",
        "Trading psychology training",
        "Private community access"
      ],
      popular: true
    },
    {
      name: "One-on-One Mentorship",
      price: 500,
      features: [
        "4 personal sessions monthly",
        "Custom strategy development",
        "Portfolio review",
        "Direct messaging with mentor",
        "Priority support",
        "Access to all platform resources"
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Trading Journey
          </h2>
          <p className="text-lg text-foreground/30 max-w-3xl mx-auto">
            Select the plan that best fits your trading goals and level of experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} index={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  features,
  popular = false,
  index,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { addToast } = useToast();

  const { updateSubscription, isLoading, error, success } = useSubscription();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMentorshipPlan = name.toLowerCase().includes('mentorship');
  const planKey = name.toLowerCase().includes('grouped')
    ? 'grouped'
    : name.toLowerCase().includes('one-on-one')
    ? 'one_on_one'
    : 'basic'; // for signals

  const currentSubscription = isMentorshipPlan
    ? user?.subscriptions?.mentorship
    : user?.subscriptions?.signals;

  const isCurrentPlan = currentSubscription?.plan === planKey && currentSubscription?.status === 'active';

  const canUpgrade =
    isMentorshipPlan &&
    planKey === 'one_on_one' &&
    currentSubscription?.plan === 'grouped' &&
    currentSubscription?.status === 'active';

  const isSubscribed = isCurrentPlan && !canUpgrade;

  const handleSubscription = async () => {
    const userId = user?.id;
    if (!userId) return;
    setIsModalOpen(false);
    
    const subscriptionType = isMentorshipPlan ? 'mentorship' : 'signals';

    const subscriptionData: SubscriptionUpdate = {
      userId,
      type: subscriptionType,
      plan: planKey,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };

    try {
      const updatedUser = await updateSubscription(subscriptionData); // make sure this returns updated user

      dispatch(setUser(updatedUser));

      addToast({
        title: "Subscription Activated",
        description: `You have successfully subscribed to ${name}.`,
        variant: "success",
      });
    } catch (err) {
      addToast({
        title: "Subscription Error",
        description: "There was an error processing your subscription.",
        variant: "error",
      });
    }
  };

  if (!user) return null;

  return (
    <>
      <div
        className="card rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-600 relative"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white text-sm font-bold py-1 px-4 rounded-full">
            Most Popular
          </div>
        )}
        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-extrabold">${price}</span>
            <span className="text-gray-500 ml-1">/mo</span>
          </div>

          <ul className="space-y-3 mb-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <CheckIcon className="h-5 w-5 text-accent flex-shrink-0 mr-2 mt-0.5" />
                <span className="text-foreground/40">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className={`rounded-full py-3 w-full font-bold ${
              isSubscribed ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
            onClick={() => !isSubscribed && setIsModalOpen(true)}
            disabled={isSubscribed}
          >
            {isSubscribed ? 'Subscribed' : canUpgrade ? 'Upgrade' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* AnimatePresence + Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-xl shadow-xl p-6 w-full max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4">Checkout</h2>
              <p className="mb-4">
                You're about to {canUpgrade ? 'upgrade to' : 'subscribe to'} <strong>{name}</strong> for{" "}
                <strong>${price}/mo</strong>.
              </p>
              <button
                className="w-full py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-600"
                onClick={handleSubscription}
              >
                Confirm & Pay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubscriptionPage;