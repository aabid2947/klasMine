import { ReactNode } from "react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import NotificationManager from "../components/NotificationManager";

export default function StaticLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <NotificationManager />
      <Footer />
    </>
  );
}
