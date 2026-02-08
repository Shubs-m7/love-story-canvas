-[x] Create`src/app/valentine/page.tsx` < !--id: 78 -- >
    -[x] Check for confetti library < !--id: 83 -- >
        -[x] Implement layout and styling < !--id: 84 -- >
            -[x] Implement "No" button evasion logic < !--id: 85 -- >
                -[x] Implement "Yes" button celebration < !--id: 86 -- >
                    -[] Verify functionality < !--id: 82 -- >
export default function ValentinePage() {
    const [yesPressed, setYesPressed] = useState(false);
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const [hoverCount, setHoverCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const moveNoButton = () => {
        // Ensure we have window access
        if (typeof window === 'undefined') return;

        // Calculate new position within viewport padding
        const padding = 50;
        const maxX = window.innerWidth / 2 - padding;
        const maxY = window.innerHeight / 2 - padding;

        // Generate random x/y between -max and +max
        const x = (Math.random() * 2 - 1) * maxX;
        const y = (Math.random() * 2 - 1) * maxY;

        setNoBtnPosition({ x, y });
        setHoverCount(prev => prev + 1);
    };

    if (yesPressed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 p-4 text-center overflow-hidden">
                {mounted && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative z-10"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Heart className="w-32 h-32 text-rose-500 fill-rose-500 mx-auto mb-8" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-rose-600 mb-4">
                            Yay! I knew it! 💖
                        </h1>
                        <p className="text-xl text-rose-400 font-body">
                            Best Valentine Ever!
                        </p>
                    </motion.div>
                )}

                {/* Simple particle effects - Only render on client */}
                {mounted && [...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 0
                        }}
                        animate={{
                            x: (Math.random() - 0.5) * window.innerWidth,
                            y: (Math.random() - 0.5) * window.innerHeight,
                            opacity: 0,
                            scale: Math.random() * 2
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeOut",
                            repeat: Infinity,
                            repeatDelay: Math.random() * 2
                        }}
                        style={{
                            left: "50%",
                            top: "50%"
                        }}
                    >
                        <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-200 p-4 overflow-hidden relative">
            {/* Floating background hearts - Only render on client */}
            {mounted && [...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-pink-300 pointer-events-none"
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: 0.5
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                >
                    <Heart className="w-8 h-8 fill-current" />
                </motion.div>
            ))}
