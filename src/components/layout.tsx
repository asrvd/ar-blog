import Navbar from "./navbar";
import Footer from "./footer";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">{children}</main>
      <Footer />
    </div>
  );
}
