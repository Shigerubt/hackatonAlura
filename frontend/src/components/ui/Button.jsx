import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
    const baseStyles = "cursor-pointer px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-neon-cyan text-navy-deep shadow-[0_0_15px_rgba(100,255,218,0.5)] hover:shadow-[0_0_25px_rgba(100,255,218,0.8)] border border-transparent",
        alert: "bg-alert-red text-white shadow-[0_0_15px_rgba(255,77,77,0.5)] hover:shadow-[0_0_25px_rgba(255,77,77,0.8)] border border-transparent",
        glass: "bg-white/5 backdrop-blur-md border border-white/20 text-neon-cyan hover:bg-white/10 hover:border-neon-cyan/50"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        />
    );
}
