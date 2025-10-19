import { Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#1a1f3a] via-[#2d1b4e] to-[#1a1f3a] text-white py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="text-3xl font-display font-bold mb-4 bg-gradient-to-r from-[#ffd700] via-[#ffb6c1] to-[#ff69b4] bg-clip-text text-transparent animate-fade-in">
              InvestFlow
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Transparent crowdfunding investments managed by our platform. Start growing your capital today.
            </p>
            <div className="flex gap-3 mt-4">
              <div className="w-12 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full" />
              <div className="w-8 h-1 bg-gradient-to-r from-[#764ba2] to-[#f093fb] rounded-full" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h4 className="font-display font-bold mb-6 text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("premium")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  Premium
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-display font-bold mb-6 text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                <span className="text-[#667eea]">✉</span>
                contact@investflow.com
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                <span className="text-[#764ba2]">📞</span>
                +1 (234) 567-890
              </li>
              <li className="flex items-start gap-2 hover:text-white transition-colors duration-300">
                <span className="text-[#f093fb]">📍</span>
                <span>
                  123 Financial District
                  <br />
                  New York, NY 10004
                </span>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h4 className="font-display font-bold mb-6 text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-4 transition-all duration-300" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 pt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {currentYear} InvestFlow. All rights reserved.
              </p>
              <span className="hidden md:inline text-gray-600">•</span>
              <p className="text-sm text-gray-400">
                Built with <span className="text-red-400 animate-pulse">❤</span> for investors
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group border border-white/10"
              >
                <Linkedin size={18} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group border border-white/10"
              >
                <Twitter size={18} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-[#f093fb] hover:to-[#764ba2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group border border-white/10"
              >
                <Instagram size={18} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group border border-white/10"
              >
                <Facebook size={18} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
