export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      data-variant={variant}
      className="px-4 py-2 rounded-md font-medium"
    >
      {children}
    </button>
  );
}
