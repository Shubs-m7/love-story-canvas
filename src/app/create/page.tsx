"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, ArrowRight, Upload, X, ImagePlus, Music, Palette, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GalleryData, generateSlug, saveGallery } from "@/lib/gallery-store";
import HeartParticles from "@/components/HeartParticles";

const themes = [
    { id: "rose-red" as const, name: "Rose Red", colors: "from-rose to-rose-dark" },
    { id: "soft-pink" as const, name: "Soft Pink", colors: "from-blush to-rose-light" },
    { id: "candle-light" as const, name: "Candle Light", colors: "from-candle to-gold" },
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
        if (step === 2) return photos.length > 0;
        return true;
    };

    const handleGenerate = () => {
        const slug = generateSlug(formData.yourName, formData.partnerName);
        const gallery: GalleryData = {
            ...formData,
            photos: photos.map((p) => ({ id: p.id, url: p.url })),
            theme,
            music,
            slug,
        };
        saveGallery(gallery);
        router.push(`/gallery/${slug}`);
    };

    return (
        <div className="min-h-screen romantic-gradient-soft relative">
            <HeartParticles />

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
                    {[1, 2, 3].map((s) => (
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
                        animate={{ width: `${((step - 1) / 2) * 100}%` }}
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

                    {step === 3 && (
                        <motion.div
                            key="step3"
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
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={`relative rounded-xl p-4 text-center border-2 transition-all ${theme === t.id ? "border-primary shadow-lg" : "border-transparent"
                                            }`}
                                    >
                                        <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${t.colors} mb-2`} />
                                        <span className="font-body text-sm text-foreground">{t.name}</span>
                                        {theme === t.id && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full romantic-gradient flex items-center justify-center">
                                                <Check className="w-3 h-3 text-primary-foreground" />
                                            </div>
                                        )}
                                    </button>
                                ))}
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

                    {step < 3 ? (
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
