import { FOOTER_NAVIGATION_COLUMNS } from "../footer.data";
import FooterNavigationColumn from "./column/FooterNavigationColumn";

const FooterNavigation = () => {
  return (
    <div className="mx-auto flex w-7xl gap-8 py-16">
      {FOOTER_NAVIGATION_COLUMNS.map((column) => (
        <FooterNavigationColumn key={column.heading} column={column} />
      ))}
    </div>
  );
};

export default FooterNavigation;
