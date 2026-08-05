import Link from "next/link";
import { FooterNavigationColumnType } from "../../footer.data";

interface Props {
  column: FooterNavigationColumnType;
}

const FooterNavigationColumn = ({ column }: Props) => {
  const { heading, links } = column;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <h3 className="font-medium text-neutral-950">{heading}</h3>

      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href="/"
              className={`text-neutral-600 ${link.highlighted && "bg-linear-to-r from-purple-700 to-[#c042ed] bg-clip-text text-transparent"}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavigationColumn;
