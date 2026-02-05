type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  text,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className="btn">
      {text}
    </button>
  );
}