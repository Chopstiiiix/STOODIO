import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30">
            <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-28 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 h-full relative cursor-pointer">
                        <img
                            src={logoImg}
                            alt="STOODIO"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-56 w-auto max-w-none object-contain"
                        />
                        {/* Invisible spacer to maintain layout */}
                        <div className="w-32 h-full" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                        <Link to="/studios?type=Music" className="hover:text-blue-400 transition-colors">Music</Link>
                        <Link to="/studios?type=Photo" className="hover:text-blue-400 transition-colors">Photo</Link>
                        <Link to="/studios?type=Podcast" className="hover:text-blue-400 transition-colors">Podcast</Link>
                        <Link to="/studios?type=Make Up" className="hover:text-blue-400 transition-colors">Make Up</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Sign In
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.7)]">
                            List Property
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t border-zinc-900 py-8 mt-20">
                <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
                    <p>&copy; 2026 STOODIO. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
