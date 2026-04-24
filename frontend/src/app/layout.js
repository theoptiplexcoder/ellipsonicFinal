import "./globals.css";
import Header from "@/components/header";
export const metadata = {
  title: "Eventbook",
  description: "Eventbook",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className={`bg-linear-to-br from-white-950 to-blue-50 text-black`}>


        <Header />

        <main className="min-h-screen relative container mx-auto pt-40 md:pt-35">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96" />
            <div className="absolute bottom-9 right-1/4 w-96 h-96 " />
          </div>

          <div className="relative z-10 min-h-[70vh]">{children}</div>

          <footer className="border-t border-white">
            <p className="text-center text-white py-8 px-6 max-w-7xl mx-auto">Made by YASHWANTH B L</p>
          </footer>
        </main>
        
      </body>

    </html>
  );
}
