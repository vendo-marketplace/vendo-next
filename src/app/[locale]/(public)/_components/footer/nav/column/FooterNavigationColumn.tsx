import { Link } from "@/i18n/navigation";
import { FooterNavigationColumnType } from "../../footer.data";

interface Props {
  column: FooterNavigationColumnType;
}

const FooterNavigationColumn = ({ column }: Props) => {
  const { heading, links } = column;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <h3 className="font-medium text-text-primary">{heading}</h3>

      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href="/"
              className={`text-text-secondary ${link.highlighted && "bg-linear-to-r from-text-brand-dark to-text-brand-light bg-clip-text text-transparent"}`}
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
