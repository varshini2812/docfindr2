import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/contexts/DocumentContext";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openFileUpload } = useDocuments();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background z-10 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-primary">DocuFindr</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-800 bg-background">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={openFileUpload}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
