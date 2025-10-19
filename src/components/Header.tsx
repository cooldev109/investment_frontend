import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard, Upload, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.role === "admin";
  const isOnHomePage = location.pathname === "/";

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/98 backdrop-blur-xl shadow-2xl border-b border-purple-100/50"
          : "bg-white/80 backdrop-blur-lg shadow-md"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent hover:scale-105 transition-all duration-300 relative group"
          >
            InvestFlow
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#f093fb] group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation Links */}
            <Link
              to="/"
              className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/projects"
              className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/premium-database"
              className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
            >
              Premium DB
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
            </Link>
            {isOnHomePage ? (
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
              </button>
            ) : (
              <Link
                to="/about"
                className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
              </Link>
            )}
            <Link
              to="/faq"
              className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
            </Link>
            {isOnHomePage ? (
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
              </button>
            ) : (
              <Link
                to="/contact"
                className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group py-1"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
              </Link>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group flex items-center gap-1.5 py-1"
                >
                  <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/admin/import"
                  className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium relative group flex items-center gap-1.5 py-1"
                >
                  <Upload className="h-4 w-4 group-hover:-translate-y-1 transition-transform duration-300" />
                  Import
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300" />
                </Link>
              </>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                      <span className="text-xs text-primary mt-1 capitalize font-medium">
                        {user?.planKey} plan
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/projects" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      My Projects
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-investments" className="cursor-pointer">
                      <Wallet className="mr-2 h-4 w-4" />
                      My Investments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscription/manage" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Subscription
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Analytics Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/import" className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          Import Projects
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="font-medium hover:bg-purple-50 transition-all duration-300 hover:scale-105">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#764ba2] hover:to-[#f093fb] transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f093fb] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-[#667eea]" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-100 pt-4 bg-gradient-to-br from-white to-purple-50/30 rounded-b-2xl shadow-xl animate-fade-in-down">
            <div className="flex flex-col gap-2">
              {/* User Info (Mobile) */}
              {isAuthenticated && (
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-3 border border-purple-100 shadow-sm">
                  <p className="font-bold text-sm text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
                  <p className="text-xs bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mt-1.5 capitalize font-semibold">
                    {user?.role} · {user?.planKey} plan
                  </p>
                </div>
              )}

              {/* Navigation Links */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
              >
                Home
              </Link>
              <Link
                to="/projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
              >
                Projects
              </Link>
              <Link
                to="/premium-database"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
              >
                Premium Database
              </Link>
              <Link
                to="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
              >
                Pricing
              </Link>

              {isOnHomePage ? (
                <button
                  onClick={() => scrollToSection("about")}
                  className="px-4 py-2.5 text-left text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
                >
                  About
                </button>
              ) : (
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
                >
                  About
                </Link>
              )}

              <Link
                to="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
              >
                FAQ
              </Link>

              {isOnHomePage ? (
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-4 py-2.5 text-left text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
                >
                  Contact
                </button>
              ) : (
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95"
                >
                  Contact
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  to="/my-investments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95 flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  My Investments
                </Link>
              )}

              {/* Admin Links (Mobile) */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95 flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Analytics Dashboard
                  </Link>
                  <Link
                    to="/admin/import"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#667eea] rounded-xl transition-all duration-300 font-medium hover:translate-x-1 active:scale-95 flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import Projects
                  </Link>
                </>
              )}

              {/* Auth Buttons (Mobile) */}
              <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-purple-100">
                {isAuthenticated ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 active:scale-95"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 active:scale-95">
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#764ba2] hover:to-[#f093fb] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 relative overflow-hidden group">
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#f093fb] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
