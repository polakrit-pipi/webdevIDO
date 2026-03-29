import Link from "next/link";

type ButtonProps = {
  bg: string;
  text: string;
  hoverBg: string;
  hoverText: string;
  label: string;
  text_size: string;
  px: string;
  py: string;
  link: string;
};

const Button = ({
  bg,
  text,
  hoverBg,
  hoverText,
  label,
  text_size,
  px,
  py,
  link,
}: ButtonProps) => {
  return (
    <Link href={link}>
    <button
      className={`${bg} ${text} ${hoverBg} ${hoverText} ${px} ${py} ${text_size} rounded-4xl transition-colors duration-300 cursor-pointer`}
    >
      {label}
    </button>
    </Link>
  );
};

export default Button;
