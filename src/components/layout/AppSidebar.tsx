import { Home, BarChart3, Activity, MessageCircle, Leaf, Settings, Plug } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, to: "/", label: "Home" },
  { icon: BarChart3, to: "/analytics", label: "Analytics" },
  { icon: Activity, to: "/activity", label: "Activity" },
  { icon: MessageCircle, to: "/chat", label: "Chat" },
  { icon: Leaf, to: "/nutrition", label: "Nutrition" },
  { icon: Plug, to: "/integrations", label: "Integrations" },
  { icon: Settings, to: "/settings", label: "Settings" },
];

const AppSidebar = () => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col items-center w-[72px] bg-card border-r border-border py-6 gap-2 fixed left-0 top-0 h-screen z-30">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-6">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-30">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default AppSidebar;
