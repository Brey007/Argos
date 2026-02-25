import { cn } from "../lib/cn";

const baseStyle = "inline-flex items-center justify-center rounded-x1 px-4 py-2 text-sm font-medium transition-all duration-300" + "focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

const VariantStyles = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-900"
};

export default function Button({ variant = "primary", className, children, ...props }) {
    if (variant === "argos"){
        return (
            <button className="relative inline-flex items-center justify-center p-[1.5px] rounded-x1 bg-gradient-to-r from-white/70 to-indigo-400 hover:from-white hover:to-indigo-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"{...props}>
        
            <span className={cn(baseStyle, className)}>
                {children}
            </span>
        </button>

    );
}

return(
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
    {children}
    </button>
)
}