import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

// FAQ data organized by categories
const faqData = {
  "Getting Started": [
    {
      question: "What is InvestFlow?",
      answer: "InvestFlow is a managed investment platform that connects investors with carefully vetted and professionally managed investment projects. We handle all aspects of project management, from due diligence to execution, providing complete transparency and verified returns."
    },
    {
      question: "How do I create an account?",
      answer: "Click the 'Get Started' button on our homepage and fill out the registration form with your name, email, and password. Once registered, you'll receive a welcome email and can immediately start exploring investment opportunities."
    },
    {
      question: "Is InvestFlow free to use?",
      answer: "Yes, creating an account and browsing projects is completely free. We offer multiple subscription tiers (Free, Basic, Plus, and Premium) with different features and benefits. You can upgrade anytime to access advanced tools and premium investment opportunities."
    },
    {
      question: "What are the minimum investment requirements?",
      answer: "Minimum investment amounts vary by project, typically starting from $1,000. Each project page clearly displays the minimum and maximum investment amounts. Some premium projects may have higher minimums."
    }
  ],
  "Investments": [
    {
      question: "How are projects vetted?",
      answer: "Every project undergoes rigorous due diligence by our expert team. We analyze market potential, financial projections, management team credentials, legal compliance, and risk factors. Only projects meeting our strict criteria are listed on the platform."
    },
    {
      question: "What types of investments are available?",
      answer: "We offer diverse investment opportunities across multiple sectors including real estate, technology startups, renewable energy, infrastructure, and business expansion projects. Each project is categorized and tagged for easy discovery."
    },
    {
      question: "How do I invest in a project?",
      answer: "Once you've found a project you're interested in, click 'Invest Now' on the project page. Enter your investment amount, review the terms, and confirm your investment. Funds are securely processed, and you'll receive immediate confirmation."
    },
    {
      question: "Can I withdraw my investment early?",
      answer: "Investment terms vary by project. Some projects have lock-in periods while others allow early withdrawal with potential penalties. All terms are clearly disclosed on the project page before you invest. Contact our support team for specific withdrawal requests."
    },
    {
      question: "How and when do I receive returns?",
      answer: "Returns are distributed according to the project's payment schedule, which can be monthly, quarterly, or at project completion. You'll receive notifications when distributions are made, and funds are automatically deposited to your account."
    }
  ],
  "Subscription Plans": [
    {
      question: "What's included in the Free plan?",
      answer: "The Free plan includes access to browse all projects, basic search filters, up to 10 project views per month, 5 ROI calculator simulations, and our standard support. It's perfect for exploring the platform and learning about investment opportunities."
    },
    {
      question: "What are the benefits of Premium membership?",
      answer: "Premium members get unlimited project views, all advanced search filters, unlimited ROI simulations, early access to new projects, priority support, detailed analytics, quarterly market reports, and access to exclusive high-value investment opportunities."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your subscription plan at any time from your account settings. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period. Unused time is prorated."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings under 'Manage Subscription'. Your access will continue until the end of your current billing period, and you won't be charged again."
    }
  ],
  "Security & Safety": [
    {
      question: "Is my investment secure?",
      answer: "Yes. We use bank-level encryption (256-bit SSL) for all transactions and data storage. All projects are insured where applicable, and we maintain strict compliance with financial regulations. Your personal and financial information is never shared with third parties."
    },
    {
      question: "How is my personal data protected?",
      answer: "We follow GDPR and other data protection regulations. All personal information is encrypted, stored securely, and accessed only by authorized personnel. We never sell or share your data. Read our Privacy Policy for complete details."
    },
    {
      question: "What happens if a project fails?",
      answer: "While we thoroughly vet all projects, investments carry inherent risks. If a project underperforms, we work to recover value through our network and expertise. All risks are disclosed upfront, and we recommend diversifying your investments across multiple projects."
    },
    {
      question: "Are you regulated?",
      answer: "Yes, InvestFlow operates under strict financial regulations and holds necessary licenses for investment management. We comply with all applicable securities laws and regularly undergo third-party audits."
    }
  ],
  "Platform Features": [
    {
      question: "What is the ROI Calculator?",
      answer: "Our ROI Calculator is an advanced tool that helps you project potential returns based on investment amount, expected ROI, duration, and compounding frequency. Premium members can run unlimited simulations and save scenarios for comparison."
    },
    {
      question: "What's the Premium Database?",
      answer: "The Premium Database is an advanced search feature that lets you filter projects by multiple criteria including ROI range, amount range, duration, multiple categories, and custom sorting. It's available to Basic plan subscribers and above."
    },
    {
      question: "How do notifications work?",
      answer: "You'll receive email notifications for important events like new projects matching your interests, investment confirmations, distribution payments, and project updates. You can customize notification preferences in your account settings."
    },
    {
      question: "Can I track my portfolio performance?",
      answer: "Yes, your dashboard provides real-time portfolio tracking with detailed analytics including total invested amount, returns to date, active investments, and projected earnings. Premium members get enhanced analytics and custom reports."
    }
  ],
  "Support": [
    {
      question: "How can I contact support?",
      answer: "You can reach our support team via the Contact page, email at contact@investflow.com, or phone at +1 (234) 567-890. Premium members have access to priority support with faster response times."
    },
    {
      question: "What are your business hours?",
      answer: "Our support team is available Monday-Friday 9:00 AM - 6:00 PM, Saturday 10:00 AM - 4:00 PM (EST). We're closed on Sundays and major holidays. Email inquiries are typically responded to within 24-48 hours."
    },
    {
      question: "Do you offer educational resources?",
      answer: "Yes! We provide investment guides, webinars, market analysis reports, and a comprehensive knowledge base. Premium members get access to exclusive educational content, quarterly market reports, and one-on-one consultation sessions."
    }
  ]
};

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const categories = Object.keys(faqData);

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const filterFAQs = () => {
    if (!searchQuery && !activeCategory) {
      return faqData;
    }

    const filtered: Record<string, Array<{ question: string; answer: string }>> = {};

    Object.entries(faqData).forEach(([category, questions]) => {
      // Filter by category if active
      if (activeCategory && category !== activeCategory) {
        return;
      }

      // Filter by search query
      const matchingQuestions = questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingQuestions.length > 0) {
        filtered[category] = matchingQuestions;
      }
    });

    return filtered;
  };

  const filteredFAQs = filterFAQs();
  const totalQuestions = Object.values(filteredFAQs).reduce((sum, items) => sum + items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <HelpCircle className="text-secondary" size={32} />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers to common questions about InvestFlow, investing, and our platform features
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg"
                />
              </div>

              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-4">
                  Found {totalQuestions} result{totalQuestions !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => setActiveCategory(null)}
                className="rounded-full"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {Object.keys(filteredFAQs).length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-6">
                    No FAQs found matching your search
                  </p>
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(filteredFAQs).map(([category, questions]) => (
                    <div key={category} className="animate-fade-in">
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        {category}
                      </h2>
                      <div className="space-y-4">
                        {questions.map((item, index) => {
                          const questionId = `${category}-${index}`;
                          const isExpanded = expandedQuestions.has(questionId);

                          return (
                            <div
                              key={questionId}
                              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <button
                                onClick={() => toggleQuestion(questionId)}
                                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-muted/30 transition-colors"
                              >
                                <h3 className="text-lg font-semibold text-foreground flex-1">
                                  {item.question}
                                </h3>
                                {isExpanded ? (
                                  <ChevronUp className="text-primary flex-shrink-0" size={24} />
                                ) : (
                                  <ChevronDown className="text-muted-foreground flex-shrink-0" size={24} />
                                )}
                              </button>
                              {isExpanded && (
                                <div className="px-6 pb-4 pt-2 border-t border-border bg-muted/10 animate-fade-in">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {item.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border">
              <MessageCircle className="mx-auto mb-6 text-secondary" size={48} />
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    Contact Support
                  </Button>
                </Link>
                <a href="mailto:contact@investflow.com">
                  <Button size="lg" variant="outline">
                    Email Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
