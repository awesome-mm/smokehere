import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "smokehere",
  description: "Find a smoking area near you.",
};

export default function MapLayout({ children }: LayoutProps<"/map">) {
  return children;
}
