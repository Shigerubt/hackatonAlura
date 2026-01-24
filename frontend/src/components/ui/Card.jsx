import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={twMerge(
                "bg-navy-deep/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-neon-cyan/30 transition-colors duration-300",
                "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-neon-cyan before:to-transparent before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
