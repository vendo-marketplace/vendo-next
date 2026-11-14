import { notFound } from "next/navigation";

// Any address no other route matches lands here, so it shows our 404 inside the public layout.
export default function UnknownPage() {
  notFound();
}
