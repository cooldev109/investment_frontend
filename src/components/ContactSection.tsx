import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send, Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", message: "" });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'm interested in learning more about InvestFlow.");
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help you start your investment journey
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your investment goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full min-h-[150px]"
                    maxLength={1000}
                  />
                </div>

                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 group">
                  <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                  Send Message
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-4">Or reach us directly</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare className="mr-2" size={18} />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Mail className="text-secondary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <a
                        href="mailto:contact@investflow.com"
                        className="text-muted-foreground hover:text-secondary transition-colors"
                      >
                        contact@investflow.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Phone className="text-secondary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <a
                        href="tel:+1234567890"
                        className="text-muted-foreground hover:text-secondary transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <MapPin className="text-secondary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Address</h4>
                      <p className="text-muted-foreground">
                        123 Financial District
                        <br />
                        New York, NY 10004
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <h4 className="font-display font-semibold text-foreground mb-4">Business Hours</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
