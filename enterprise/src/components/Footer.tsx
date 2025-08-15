"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  platform: [
    
    { name: "Join Us", href: "/join" },
    { name: "Community", href: "/community" },
    { name: "Events", href: "/events" },
    
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Global Chat", href: "/chat" },
    { name: "FAQ", href: "/faq" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact", href: "/contact" }
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.1] bg-black">
      <div className="container flex flex-col gap-8 px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Branding & Newsletter */}
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white">
              <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                OPENGEEK <span className="text-xs sm:text-sm text-white/40">Community</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-white/70">
              Empowering the next generation of developers with real-world projects and opportunities.
            </p>
            <div className="flex gap-4">
              <Link 
                href="https://github.com/opengeekv2" 
                target="_blank"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link 
                href="https://linkedin.com/company/opengeek" 
                target="_blank"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link 
                href="https://instagram.com/opengeek.in" 
                target="_blank"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-2 sm:mb-4 text-sm font-semibold text-white">Platform</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-2 sm:mb-4 text-sm font-semibold text-white">Resources</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-2 sm:mb-4 text-sm font-semibold text-white">Legal</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.1] pt-8 md:flex-row">
          <p className="text-xs sm:text-sm text-white/70 text-center md:text-left">
            © {new Date().getFullYear()} OpenGeek. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-sm text-white/70 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-white/70 hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-white/70 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 