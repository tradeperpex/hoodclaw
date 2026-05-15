import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";

export default function ProofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader />
      <div className="subpage">
        <Link href="/" className="back-link">← Back to home</Link>
        {children}
      </div>
    </>
  );
}
