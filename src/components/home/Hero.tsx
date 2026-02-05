import { useNavigate } from "react-router-dom";
import BlurFade from "../ui/blur-fade";

export function Hero() {
    const navigate = useNavigate();

    const handleBrowseSpaces = () => {
        navigate('/studios');
    };

    const handleHowItWorks = () => {
        navigate('/how-it-works');
    };

    return (
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
            <div className="container mx-auto px-4 text-center z-10 relative">
                <BlurFade delay={0.25} inView>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
                        Connect, Collaborate, Create.
                    </h2>
                </BlurFade>
                <BlurFade delay={0.35} inView>
                    <span className="text-xl text-zinc-400 max-w-2xl mx-auto block mt-4 mb-8">
                        Book professional studios for music, photography, video, and editing.
                        <br className="hidden md:inline" />
                        Top-tier spaces for top-tier creators.
                    </span>
                </BlurFade>
                <BlurFade delay={0.45} inView>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={handleBrowseSpaces}
                            className="min-w-[160px] bg-white text-black hover:bg-zinc-200 font-semibold px-6 py-3 rounded-full transition-transform hover:scale-105 active:scale-95"
                        >
                            Browse Spaces
                        </button>
                        <button 
                            onClick={handleHowItWorks}
                            className="min-w-[160px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold px-6 py-3 rounded-full transition-all hover:border-zinc-700"
                        >
                            How it works
                        </button>
                    </div>
                </BlurFade>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
        </section>
    )
}
