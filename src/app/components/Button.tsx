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
    <button type={type} onClick={onClick} className="btn" style={{marginTop: "10px"}}>
      {text}
    </button>
  );
}