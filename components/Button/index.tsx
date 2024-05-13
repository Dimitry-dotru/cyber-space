
interface ButtonProps {
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  textContent: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  onClick, primary, secondary, textContent, type
}) => {
  return <button onClick={onClick} className={`${primary ? "btn-primary" : ""} ${secondary ? "btn-secondary" : ""} btn`} type={type ? type : "button"}>{textContent}</button>;
}

export default Button;