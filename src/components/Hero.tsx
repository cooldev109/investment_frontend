import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Financial cityscape"
          className="w-full h-full object-cover scale-105 animate-[zoom_20s_ease-in-out_infinite]"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(102,126,234,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,147,251,0.3),transparent_50%)]" />
      </div>

      {/* Floating Animated Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white rotate-45 animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-2 border-white rounded-full animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center relative">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 animate-fade-in-down">
            <TrendingUp className="text-white" size={20} />
            <span className="text-white font-semibold">Trusted by 10,000+ investors worldwide</span>
          </div>

          {/* Main Heading with Staggered Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-[1.1] animate-fade-in-up">
            Invest in Real Projects.
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-300 bg-clip-text text-transparent">
                Build Real Wealth.
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-300 rounded-full" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Transparent investments managed by our expert team. Join today and start growing your capital with verified, high-potential projects.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              size="lg"
              onClick={scrollToProjects}
              className="bg-white hover:bg-white/90 text-[#667eea] font-bold px-10 py-7 text-lg rounded-full shadow-2xl hover:shadow-premium transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explore Projects
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={22} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white/50 text-white hover:bg-white hover:text-[#667eea] px-10 py-7 text-lg rounded-full backdrop-blur-md transition-all duration-300 hover:-translate-y-1 font-semibold"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Shield className="text-green-300" size={18} />
              <span className="text-white text-sm font-medium">SEC Regulated</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Zap className="text-yellow-300" size={18} />
              <span className="text-white text-sm font-medium">Instant Verification</span>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <div className="group backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-br from-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-3">
                $125M+
              </div>
              <div className="text-white/90 text-lg font-medium">Total Invested</div>
              <div className="text-white/60 text-sm mt-1">Across all platforms</div>
            </div>
            <div className="group backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-br from-green-200 to-green-400 bg-clip-text text-transparent mb-3">
                18.5%
              </div>
              <div className="text-white/90 text-lg font-medium">Avg. Annual Return</div>
              <div className="text-white/60 text-sm mt-1">Historical performance</div>
            </div>
            <div className="group backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-br from-pink-200 to-pink-400 bg-clip-text text-transparent mb-3">
                240+
              </div>
              <div className="text-white/90 text-lg font-medium">Active Projects</div>
              <div className="text-white/60 text-sm mt-1">Vetted opportunities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
