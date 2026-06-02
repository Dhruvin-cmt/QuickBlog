type ButtonProps = {
  label?: string;
  onClick?: (e : React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "danger";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  label,
  onClick,
  variant,
  className,
  disabled,
  children,
  type = "button",
}: ButtonProps) {
  const baseStyle = "rounded";

  const styles = {
    primary: "bg-blue-500 hover:bg-blue-600",
    danger: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variant ? styles[variant] : ""} ${className}`}
      disabled={disabled}
    >
      {children ?? label}
    </button>
  );
}
