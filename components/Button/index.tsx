
const Button: React.FC<{onClick?: () => void}> = ({
  onClick
}) => {
  return <button onClick={onClick} className="btn-secondary">Hello world from button component</button>;
}

export default Button;