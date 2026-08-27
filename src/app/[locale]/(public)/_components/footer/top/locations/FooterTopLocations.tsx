import { Fragment } from "react";

const LOCATIONS = ["Київ", "Львів", "Одеса", "Дніпро", "Харків", "Запоріжжя"];

const FooterTopLocations = () => {
  return (
    <div className="flex items-center gap-4">
      {LOCATIONS.map((city, index) => (
        <Fragment key={city}>
          {index > 0 && (
            <div className="size-1.5 rounded-full bg-stroke-primary" />
          )}
          <span className="text-text-primary">{city}</span>
        </Fragment>
      ))}
    </div>
  );
};

export default FooterTopLocations;
