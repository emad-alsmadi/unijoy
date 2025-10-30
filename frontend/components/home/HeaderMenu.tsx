import Link from "next/link";
import { links } from "@/constants/index";
import { usePathname } from "next/navigation";

const HeaderMenu = () => {
    const pathname = usePathname();
    return (
        <div className="hidden md:flex md:flex-row md:gap-3 md:text-base xl:gap-10 xl:text-xl lg:gap-6 lg:text-lg font-semibold items-center justify-center">
            {links.map(link =>
<<<<<<< HEAD
                <Link className={`relative group text-center text-purple-900 hover:text-purple-700 transition-colors ${pathname === link?.url && "text-purple-800"}`} key={link.id} href={link.url}>
                    {link?.title}
                    <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-1/2 group-hover:left-0 ${pathname === link?.url && "w-1/2"}`}></span>
                    <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-1/2 group-hover:right-0 ${pathname === link?.url && "w-1/2"}`}></span>
=======
                <Link className={`relative group text-center hover:text-darkColor hoverEffect ${pathname === link?.url && "text-darkColor"}`} key={link.id} href={link.url}>
                    {link?.title}
                    <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-black hoverEffect group-hover:w-1/2 group-hover:left-0 ${pathname === link?.url && "w-1/2"}`}></span>
                    <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-black hoverEffect group-hover:w-1/2 group-hover:right-0 ${pathname === link?.url && "w-1/2"}`}></span>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                </Link>
            )}
        </div>
    )
};

export default HeaderMenu;