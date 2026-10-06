import { FOOTER_NAVIGATION_COLUMNS } from "../footer.data";
import FooterNavigationColumn from "./column/FooterNavigationColumn";

const FooterNavigation = () => {
  return (
    <div className="mx-auto grid w-full max-w-330 grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-8 md:py-16 lg:grid-cols-5 lg:px-0">
      {FOOTER_NAVIGATION_COLUMNS.map((column) => (
        <FooterNavigationColumn key={column.heading} column={column} />
      ))}
    </div>
  );
};

export default FooterNavigation;
