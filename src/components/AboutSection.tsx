import { Shield, Target, Award } from "lucide-react";
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

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                About InvestFlow
              </h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                We manage and operate all investment projects with complete transparency and verified
                results. Our platform connects investors with carefully selected opportunities that
                have been thoroughly vetted by our expert team.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2018, we've successfully managed over $125 million in investments across
                240+ projects, consistently delivering above-market returns while maintaining the
                highest standards of transparency and investor protection.
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
  );
};

export default AboutSection;
