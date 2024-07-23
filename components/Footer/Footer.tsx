import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex justify-end h-[80px] bg-orange-400 items-center w-[100%] ">
      <div className=" flex w-[50%] justify-between text-white ">
        <p>2024 MyBook</p>
        <ul className="gap-20 font-medium items-center lg:flex hidden pr-20">
          <li>
            <Link href="/">Explorer</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
export default Footer;
