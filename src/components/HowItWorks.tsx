import { Search, Calculator, Crown } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Verified Projects",
    description:
      "Explore our curated selection of investment opportunities, each thoroughly vetted by our expert team for transparency and potential.",
  },
  {
    icon: Calculator,
    title: "Simulate Your ROI",
    description:
      "Use our advanced calculators to forecast returns based on historical data and realistic projections tailored to each project.",
  },
  {
    icon: Crown,
    title: "Subscribe for Premium Insights",
    description:
      "Unlock our complete project database with exclusive analytics, detailed reports, and priority access to new opportunities.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start your investment journey with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connection Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary to-secondary/20" />
              )}

              <div className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/70 mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="text-primary-foreground" size={28} />
                </div>

                <div className="absolute top-8 right-8 text-6xl font-display font-bold text-muted/20">
                  {index + 1}
                </div>

                <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
