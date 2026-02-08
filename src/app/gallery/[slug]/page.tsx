"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getGallery, GalleryData } from "@/lib/gallery-store";
import CountdownTimer from "@/components/CountdownTimer";
import HeartParticles from "@/components/HeartParticles";

const themeStyles: Record<string, string> = {
    "rose-red": "from-rose to-rose-dark",
    "soft-pink": "from-blush to-rose-light",
    "candle-light": "from-candle to-gold",
};

const GalleryView = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [gallery, setGallery] = useState<GalleryData | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        if (slug) setGallery(getGallery(slug));
    }, [slug]);

    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!gallery || gallery.photos.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentPhoto((prev) => (prev + 1) % gallery.photos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [gallery]);

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out our love gallery! 💕 ${shareUrl}`)}`, "_blank");
    };

    if (!gallery) {
        return (
            <div className="min-h-screen flex items-center justify-center romantic-gradient-soft">
                <div className="text-center glass-card rounded-2xl p-10">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Gallery Not Found</h2>
                    <p className="text-muted-foreground font-body mb-6">This love story might have expired or doesn't exist yet.</p>
                    <Link href="/" className="romantic-gradient text-primary-foreground px-6 py-3 rounded-full font-body font-semibold inline-block">
                        Create Your Own ❤️
                    </Link>
                </div>
            </div>
        );
    }

    const gradient = themeStyles[gallery.theme] || themeStyles["rose-red"];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <HeartParticles />

            {/* Animated intro */}
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${gradient}`}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center text-primary-foreground"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Heart className="w-16 h-16 fill-current mx-auto mb-6" />
                            </motion.div>
                            <h1 className="font-heading text-4xl sm:text-6xl font-bold mb-4">
                                {gallery.yourName} & {gallery.partnerName}
                            </h1>
                            <p className="font-body text-lg opacity-90">A Love Story</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main gallery content */}
            <div className={`min-h-screen bg-gradient-to-br ${gradient} relative z-10`}>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.2 }}
                        className="text-center mb-12"
                    >
                        <Heart className="w-10 h-10 text-primary-foreground fill-current mx-auto mb-4" />
                        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary-foreground mb-2">
                            {gallery.yourName} & {gallery.partnerName}
                        </h1>
                        {gallery.specialDate && (
                            <p className="font-body text-primary-foreground/80">
                                Together since {new Date(gallery.specialDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        )}
                    </motion.div>

                    {/* Photo slideshow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3.4 }}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl mb-12 bg-foreground/10"
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentPhoto}
                                src={gallery.photos[currentPhoto]?.url}
                                alt="Memory"
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            />
                        </AnimatePresence>
                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {gallery.photos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPhoto(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentPhoto ? "bg-primary-foreground w-6" : "bg-primary-foreground/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Photo grid */}
                    {gallery.photos.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3.6 }}
                            className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-12"
                        >
                            {gallery.photos.map((photo, i) => (
                                <button
                                    key={photo.id}
                                    onClick={() => setCurrentPhoto(i)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === currentPhoto ? "border-primary-foreground shadow-lg scale-105" : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Love message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.8 }}
                        className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-12"
                    >
                        <Heart className="w-8 h-8 text-primary-foreground fill-current mx-auto mb-4" />
                        <p className="font-heading text-xl sm:text-2xl text-primary-foreground italic leading-relaxed">
                            "{gallery.loveMessage}"
                        </p>
                        <p className="font-body text-primary-foreground/70 mt-4">
                            — {gallery.yourName}
                        </p>
                    </motion.div>

                    {/* Love timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4 }}
                        className="mb-12"
                    >
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground text-center mb-8">Our Love Story</h2>
                        <div className="space-y-6">
                            {[
                                { title: "How We Met", icon: "💫", text: "The day our paths crossed and everything changed forever." },
                                { title: "Our Best Moments", icon: "✨", text: "Every moment with you is a memory I'll treasure forever." },
                                { title: "Forever Together", icon: "💕", text: `${gallery.yourName} & ${gallery.partnerName} — now and always.` },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 flex items-start gap-4"
                                >
                                    <span className="text-3xl">{item.icon}</span>
                                    <div>
                                        <h3 className="font-heading text-lg font-bold text-primary-foreground">{item.title}</h3>
                                        <p className="font-body text-primary-foreground/80 text-sm mt-1">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Countdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4.2 }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-6">Valentine's Day Countdown</h2>
                        <CountdownTimer />
                    </motion.div>

                    {/* Share section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4.4 }}
                        className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center"
                    >
                        <Share2 className="w-8 h-8 text-primary-foreground mx-auto mb-4" />
                        <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-6">Share Your Love Story</h2>

                        <div className="flex justify-center mb-6">
                            <div className="bg-primary-foreground rounded-xl p-3">
                                <QRCodeSVG value={shareUrl} size={140} />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={copyLink}
                                className="px-6 py-3 rounded-full font-body font-semibold bg-primary-foreground text-primary flex items-center gap-2 justify-center hover:opacity-90 transition-opacity"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Link"}
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="px-6 py-3 rounded-full font-body font-semibold bg-[hsl(142,70%,45%)] text-primary-foreground flex items-center gap-2 justify-center hover:opacity-90 transition-opacity"
                            >
                                Share on WhatsApp
                            </button>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <div className="text-center py-10">
                        <p className="font-body text-primary-foreground/60 flex items-center justify-center gap-1 text-sm">
                            Made with <Heart className="w-3 h-3 fill-current" /> by LoveGallery
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryView;
