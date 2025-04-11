import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Upload,
  Search,
  FileText,
  User,
} from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Upload Doc", icon: Upload },
    { href: "/search", label: "Search Doc", icon: Search },
    { href: "/summarize", label: "Summarize Doc", icon: FileText },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-background border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="font-extrabold text-2xl text-primary">DocuFindr</h1>
        <p className="text-sm text-muted-foreground">AI-Powered Document Search</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
          >
            <a className={cn(
              "flex items-center gap-2 p-3 rounded-md transition-all hover:bg-gray-800",
              location === item.href 
                ? "bg-primary bg-opacity-20 text-primary" 
                : "text-muted-foreground"
            )}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">Guest User</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
