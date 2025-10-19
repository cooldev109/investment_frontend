import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles } from "lucide-react";

const benefits = [
  "Access to complete project database (240+ investments)",
  "Advanced ROI comparison tools and analytics",
  "Exclusive early access to new opportunities",
  "Detailed performance reports and insights",
  "Priority customer support and consultation",
  "Monthly market analysis and trends report",
];

const PremiumSection = () => {
  return (
    <section id="premium" className="py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Crown className="text-accent" size={20} />
            <span className="text-primary-foreground font-semibold">Premium Membership</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Unlock Premium Investment Insights
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Get comprehensive access to our entire project database with exclusive analytics,
            detailed comparisons, and priority investment opportunities.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-accent/30 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-display font-bold text-foreground mb-2">Premium Access</h3>
                <p className="text-muted-foreground">Everything you need to make informed decisions</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-display font-bold text-foreground">$49</div>
                <div className="text-muted-foreground">/month</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Check className="text-accent" size={16} />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-premium text-primary font-semibold py-6 text-lg shadow-premium hover:shadow-xl transition-all group">
              <Sparkles className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
              Subscribe Now - Start Free Trial
              <Sparkles className="ml-2 group-hover:-rotate-12 transition-transform" size={20} />
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Cancel anytime. No hidden fees. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
