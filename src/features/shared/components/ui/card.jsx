import  { cn } from "../lib/cn";

export default function Card ({ className, ...props }) {
    return (
    <div className= { cn ("rounded-lg border border-gray-100 bg-gray-800 shadow-sm", className) } {...props}/>
    );
}