import clsx from "clsx";

type ButtonVariants = 'primary' | 'secondary';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    size?: 'md';
    variant?: ButtonVariants;
}

export const Button = ({ children, size = 'md', variant = 'primary', ...props }: ButtonProps) => {
    const base =
    "inline-flex items-center justify-center font-semibold text-sm rounded-md transition whitespace-nowrap";

    const sizes = {
        md: "h-8 px-4"
    }

    const variants = {
        primary: 'mt-2 w-full py-2.5 rounded-lg bg-green-primary text-white font-medium hover:bg-green-700 transition-colors',
        secondary: ''
    }

    return (
        <button className={clsx(base, sizes[size], variants[variant])} {...props}>
            {children}
        </button>
    );
}