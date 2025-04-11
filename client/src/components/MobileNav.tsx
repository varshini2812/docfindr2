import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Upload,
  Search,
  FileText,
} from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Upload", icon: Upload },
    { href: "/search", label: "Search", icon: Search },
    { href: "/summarize", label: "Summarize", icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-gray-800 flex justify-around p-2">
      {navItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
        >
          <a className={cn(
            "flex flex-col items-center p-2 rounded",
            location === item.href ? "text-primary" : "text-muted-foreground"
          )}>
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default MobileNav;
