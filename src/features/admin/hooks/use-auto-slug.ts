import { useState } from "react";

import { slugify } from "../lib/slugify";

type Options = {
  // Whether the slug starts out following the title (new records only).
  followTitle: boolean;
  setSlug: (slug: string) => void;
};

// Keeps the slug in sync with the title until the admin edits the slug.
export const useAutoSlug = ({ followTitle, setSlug }: Options) => {
  const [isFollowing, setIsFollowing] = useState(followTitle);

  return {
    isFollowing,
    onTitleChange: (event: { target: { value: string } }) => {
      if (isFollowing) setSlug(slugify(event.target.value));
    },
    onSlugChange: () => setIsFollowing(false),
    restart: () => setIsFollowing(followTitle),
  };
};
