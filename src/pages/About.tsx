import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Target, Award, Users, TrendingUp, Globe, CheckCircle2 } from "lucide-react";
import teamImage from "@/assets/team.jpg";

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description: "Every project is thoroughly vetted with full disclosure of risks and opportunities.",
  },
  {
    icon: Target,
    title: "Expert Management",
    description: "Our experienced team actively manages and monitors all investment projects.",
  },
  {
    icon: Award,
    title: "Proven Results",
    description: "Track record of successful projects with verified returns for our investors.",
  },
];

const stats = [
  { value: "$125M+", label: "Total Investments" },
  { value: "240+", label: "Projects Completed" },
  { value: "5,000+", label: "Active Investors" },
  { value: "18.5%", label: "Average ROI" },
];

const milestones = [
  { year: "2018", event: "InvestFlow founded with a vision to democratize investment opportunities" },
  { year: "2019", event: "Reached $10M in total investments across 50 projects" },
  { year: "2020", event: "Launched premium database and advanced analytics tools" },
  { year: "2021", event: "Expanded to international markets with 100+ projects" },
  { year: "2022", event: "Surpassed $75M in investments with 1,000+ active investors" },
  { year: "2023", event: "Introduced AI-powered ROI calculator and portfolio management" },
  { year: "2024", event: "Achieved $125M milestone with enhanced security features" },
];

const teamMembers = [
  {
    name: "Sarah Mitchell",
    role: "CEO & Founder",
    description: "15+ years in investment banking and venture capital",
  },
  {
    name: "David Chen",
    role: "CTO",
    description: "Former tech lead at major fintech companies",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Investments",
    description: "MBA from Harvard, 12+ years in portfolio management",
  },
  {
    name: "Michael Thompson",
    role: "Chief Risk Officer",
    description: "Expert in financial risk assessment and compliance",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                About InvestFlow
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Empowering investors with transparent, managed, and verified investment opportunities
                since 2018
              </p>
            </div>
          </div>
        </section>

        {/* Main Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                    Our Story
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    InvestFlow was founded with a simple yet powerful vision: to make high-quality
                    investment opportunities accessible to everyone, not just institutional investors
                    and the ultra-wealthy.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    We manage and operate all investment projects with complete transparency and verified
                    results. Our platform connects investors with carefully selected opportunities that
                    have been thoroughly vetted by our expert team.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Since our founding in 2018, we've successfully managed over $125 million in
                    investments across 240+ projects, consistently delivering above-market returns
                    while maintaining the highest standards of transparency and investor protection.
                  </p>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div className="relative rounded-2xl overflow-hidden shadow-card">
                    <img
                      src={teamImage}
                      alt="InvestFlow team"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
                Our Impact in Numbers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-card rounded-xl shadow-card border border-border animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border animate-fade-in">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Target className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize access to premium investment opportunities through transparent,
                  expert-managed projects that deliver consistent returns while prioritizing
                  investor protection and education.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-card border border-border animate-fade-in" style={{ animationDelay: "150ms" }}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
                  <Globe className="text-secondary" size={32} />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the world's most trusted investment platform, where anyone can build
                  wealth through carefully curated, professionally managed projects backed by
                  complete transparency and proven results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in border border-border"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-4">
                      <value.icon className="text-secondary" size={28} />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                Our team brings decades of combined experience in finance, technology, and investment management
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-6 shadow-card border border-border text-center hover:shadow-hover transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                      <Users className="text-white" size={32} />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline/Milestones */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
                Our Journey
              </h2>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex gap-6 items-start animate-fade-in"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {milestone.year}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-secondary mt-2 relative">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-border" />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-card rounded-lg p-4 shadow-card border border-border">
                        <p className="text-foreground leading-relaxed">{milestone.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
                Why Choose InvestFlow
              </h2>
              <div className="space-y-4">
                {[
                  "All projects are vetted and managed by our expert team",
                  "Complete transparency with verified returns and detailed reporting",
                  "Diversified portfolio opportunities across multiple sectors",
                  "Advanced analytics and ROI calculation tools",
                  "Secure platform with bank-level encryption",
                  "Dedicated customer support and investor education",
                  "Flexible investment options for all experience levels",
                  "Regular updates and real-time project monitoring",
                ].map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-card p-4 rounded-lg border border-border animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle2 className="text-secondary flex-shrink-0 mt-0.5" size={24} />
                    <p className="text-foreground text-lg">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
