"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, ArrowRight, Upload, X, ImagePlus, Music, Palette, Check, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GalleryData, generateSlug, saveGallery } from "@/lib/gallery-store";
import ThemeEffect from "@/components/ThemeEffect";

const themes = [
    // First Love Package (Free)
    { id: "rose-red" as const, name: "Rose Red", colors: "from-rose to-rose-dark", package: "first-love" },
    { id: "soft-pink" as const, name: "Soft Pink", colors: "from-blush to-rose-light", package: "first-love" },
    { id: "candle-light" as const, name: "Candle Light", colors: "from-candle to-gold", package: "first-love" },

    // True Love Package (Premium)
    { id: "midnight-passion" as const, name: "Midnight Passion", colors: "from-slate-900 via-rose-950 to-black", package: "true-love" },
    { id: "ocean-romance" as const, name: "Ocean Romance", colors: "from-cyan-900 via-blue-900 to-indigo-950", package: "true-love" },
    { id: "golden-sunset" as const, name: "Golden Sunset", colors: "from-orange-500 via-red-500 to-pink-600", package: "true-love" },
    { id: "enchanted-forest" as const, name: "Enchanted Forest", colors: "from-green-900 via-emerald-900 to-teal-950", package: "true-love" },
    { id: "lavender-dream" as const, name: "Lavender Dream", colors: "from-indigo-300 via-purple-300 to-pink-300", package: "true-love" },
    { id: "velvet-night" as const, name: "Velvet Night", colors: "from-violet-950 via-fuchsia-950 to-black", package: "true-love" },
    { id: "classic-love" as const, name: "Classic Love", colors: "from-gray-100 via-gray-200 to-gray-300", package: "true-love" },
    { id: "cherry-blossom" as const, name: "Cherry Blossom", colors: "from-pink-200 via-rose-200 to-red-100", package: "true-love" },
    { id: "starry-sky" as const, name: "Starry Sky", colors: "from-slate-900 via-indigo-950 to-slate-900", package: "true-love" },
    { id: "autumn-warmth" as const, name: "Autumn Warmth", colors: "from-orange-700 via-amber-700 to-yellow-800", package: "true-love" },
    { id: "mystic-aura" as const, name: "Mystic Aura", colors: "from-teal-900 via-purple-900 to-indigo-900", package: "true-love" },
    { id: "pure-elegance" as const, name: "Pure Elegance", colors: "from-neutral-100 via-stone-100 to-zinc-100", package: "true-love" },
];

const musicOptions = [
    { id: "romantic" as const, name: "Romantic Instrumental", emoji: "🎻" },
    { id: "piano" as const, name: "Soft Piano", emoji: "🎹" },
    { id: "love-song" as const, name: "Love Song", emoji: "🎵" },
];

const CreateGallery = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        yourName: "",
        partnerName: "",
        loveMessage: "",
        specialDate: "",
        stories: [
            { title: "How We Met", content: "The day our paths crossed and everything changed forever.", icon: "💫" },
            { title: "Our Best Moments", content: "Every moment with you is a memory I'll treasure forever.", icon: "✨" }
        ]
    });
    const [photos, setPhotos] = useState<{ id: string; url: string; file: File }[]>([]);
    const [theme, setTheme] = useState<GalleryData["theme"]>("rose-red");
    const [music, setMusic] = useState<GalleryData["music"]>("romantic");

    const handlePhotoDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        addFiles(Array.from(e.dataTransfer.files));
    }, []);

    const addFiles = (files: File[]) => {
        const imageFiles = files.filter((f) => f.type.startsWith("image/")).slice(0, 20 - photos.length);
        const newPhotos = imageFiles.map((file) => ({
            id: Math.random().toString(36).substring(2),
            url: URL.createObjectURL(file),
            file,
        }));
        setPhotos((prev) => [...prev, ...newPhotos].slice(0, 20));
    };

    const removePhoto = (id: string) => {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
    };

    const canProceed = () => {
        if (step === 1) return formData.yourName.trim() && formData.partnerName.trim() && formData.loveMessage.trim();
        if (step === 3) return photos.length > 0;
        return true;
    };

    const handleGenerate = () => {
        const slug = generateSlug(formData.yourName, formData.partnerName);
        const gallery: GalleryData = {
            ...formData,
            photos: photos.map((p) => ({ id: p.id, url: p.url })),
            theme,
            music,
            stories: formData.stories,
            slug,
        };
        saveGallery(gallery);
        router.push(`/gallery/${slug}`);
    };

    const selectedThemeObj = themes.find(t => t.id === theme) || themes[0];

    return (
        <div className={`min-h-screen relative transition-colors duration-700 bg-gradient-to-br ${selectedThemeObj.colors}`}>
            <ThemeEffect theme={theme} />

            {/* Header */}
            <div className="relative z-10 px-4 py-6 flex items-center justify-between max-w-4xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-foreground font-body hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <div className="flex items-center gap-2 text-primary">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-heading font-bold">LoveGallery</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 mb-10">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-body font-semibold text-sm transition-colors ${s <= step ? "romantic-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {s < step ? <Check className="w-5 h-5" /> : s}
                        </div>
                    ))}
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full romantic-gradient"
                        animate={{ width: `${((step - 1) / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Steps */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 pb-20">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Heart className="w-6 h-6 text-primary fill-primary" />
                                <h2 className="font-heading text-2xl font-bold text-foreground">Couple Details</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">Your Name</label>
                                    <input
                                        type="text"
                                        value={formData.yourName}
                                        onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">Partner's Name</label>
                                    <input
                                        type="text"
                                        value={formData.partnerName}
                                        onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your partner's name"
                                    />
                                </div>
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">Short Love Message</label>
                                    <textarea
                                        value={formData.loveMessage}
                                        onChange={(e) => setFormData({ ...formData, loveMessage: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        rows={3}
                                        placeholder="Write something from your heart..."
                                    />
                                </div>
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                                        Anniversary / Special Date <span className="text-muted-foreground">(optional)</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.specialDate}
                                        onChange={(e) => setFormData({ ...formData, specialDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="w-6 h-6 text-primary" />
                                <h2 className="font-heading text-2xl font-bold text-foreground">Your Love Story</h2>
                            </div>

                            <div className="space-y-5">
                                {formData.stories.map((story, index) => (
                                    <div key={index}>
                                        <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                                            {story.title} {story.icon}
                                        </label>
                                        <textarea
                                            value={story.content}
                                            onChange={(e) => {
                                                const newStories = [...formData.stories];
                                                newStories[index].content = e.target.value;
                                                setFormData({ ...formData, stories: newStories });
                                            }}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            rows={3}
                                            placeholder={`Tell us about ${story.title.toLowerCase()}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <ImagePlus className="w-6 h-6 text-primary" />
                                <h2 className="font-heading text-2xl font-bold text-foreground">Upload Memories</h2>
                            </div>
                            <p className="text-muted-foreground font-body mb-6 text-sm">{photos.length}/20 photos added</p>

                            {/* Drop zone */}
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handlePhotoDrop}
                                onClick={() => document.getElementById("photo-input")?.click()}
                                className="border-2 border-dashed border-primary/30 rounded-xl p-10 text-center cursor-pointer hover:border-primary/60 hover:bg-secondary/50 transition-colors mb-6"
                            >
                                <Upload className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                                <p className="font-body text-foreground font-medium">Drag & drop photos here</p>
                                <p className="font-body text-muted-foreground text-sm mt-1">or click to browse</p>
                                <input
                                    id="photo-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
                                />
                            </div>

                            {/* Preview grid */}
                            {photos.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden">
                                            <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removePhoto(photo.id)}
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Palette className="w-6 h-6 text-primary" />
                                <h2 className="font-heading text-2xl font-bold text-foreground">Theme & Music</h2>
                            </div>

                            {/* Theme selector */}
                            <h3 className="font-body font-semibold text-foreground mb-3">Choose a Theme</h3>
                            {/* First Love Package */}
                            <div className="mb-8">
                                <h4 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                                    First Love Package
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {themes.filter(t => t.package === "first-love").map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={`relative rounded-xl p-4 text-center border-2 transition-all ${theme === t.id ? "border-primary shadow-lg" : "border-transparent hover:border-primary/30"
                                                }`}
                                        >
                                            <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${t.colors} mb-2 shadow-inner`} />
                                            <span className="font-body text-xs sm:text-sm text-foreground">{t.name}</span>
                                            {theme === t.id && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full romantic-gradient flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-primary-foreground" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* True Love Package (Premium) */}
                            <div className="mb-8">
                                <h4 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <span className="text-xl">👑</span>
                                    True Love Package <span className="text-xs bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-2 py-0.5 rounded-full font-sans uppercase tracking-wider font-bold shadow-sm">Premium</span>
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {themes.filter(t => t.package === "true-love").map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={`relative rounded-xl p-4 text-center border-2 transition-all group ${theme === t.id
                                                ? "border-amber-500 shadow-xl shadow-amber-500/20"
                                                : "border-amber-200 hover:border-amber-400"
                                                }`}
                                        >
                                            <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${t.colors} mb-2 shadow-inner ring-1 ring-black/5`} />
                                            <span className="font-body text-xs sm:text-sm text-foreground font-medium">{t.name}</span>
                                            {theme === t.id && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center shadow-md">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                            {/* Premium sheen effect */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Music selector */}
                            <div className="flex items-center gap-2 mb-3">
                                <Music className="w-5 h-5 text-primary" />
                                <h3 className="font-body font-semibold text-foreground">Background Music</h3>
                            </div>
                            <div className="space-y-2">
                                {musicOptions.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMusic(m.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl border-2 font-body transition-all flex items-center gap-3 ${music === m.id
                                            ? "border-primary bg-secondary"
                                            : "border-border hover:border-primary/30"
                                            }`}
                                    >
                                        <span className="text-xl">{m.emoji}</span>
                                        <span className="text-foreground">{m.name}</span>
                                        {music === m.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 rounded-full font-body font-semibold border-2 border-primary text-primary hover:bg-secondary transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </motion.button>
                    ) : (
                        <div />
                    )}

                    {step < 4 ? (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => canProceed() && setStep(step + 1)}
                            disabled={!canProceed()}
                            className="px-6 py-3 rounded-full font-body font-semibold romantic-gradient text-primary-foreground flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGenerate}
                            className="px-6 py-3 rounded-full font-body font-semibold romantic-gradient text-primary-foreground flex items-center gap-2 animate-pulse-glow"
                        >
                            Generate My Love Page <Heart className="w-4 h-4 fill-current" />
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateGallery;
