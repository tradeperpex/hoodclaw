import HomeHeader from "@/components/HomeHeader";

export default function ThoughtsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader />
      {children}
    </>
  );
}
