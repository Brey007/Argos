import { cn } from "../lib/cn";

export default function Input ({ label, id, className, ...props }) {
    const inputId = id ?? props.name;

    return (
        <div className= "grid gap-1.5">
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium leading-6 text-gray-300">
                    {label}
                </label>
            ) : null}

            <input
                id={inputId}
                className={cn("flex h-10 w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm ring-offset-gray-800 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
                {...props}
            />
        </div>
    );
}