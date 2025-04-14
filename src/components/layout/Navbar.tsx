
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-purple-vibrant flex items-center">
              <span className="mr-2">😊</span>
              Emotify
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Github size={18} />
              <span>GitHub</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in">
          <div className="container px-4 py-3 space-y-2">
            <Button variant="ghost" className="w-full justify-start">Features</Button>
            <Button variant="ghost" className="w-full justify-start">About</Button>
            <Button variant="ghost" className="w-full justify-start">Contact</Button>
            <Button variant="outline" className="w-full justify-start flex items-center gap-2">
              <Github size={18} />
              <span>GitHub</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
