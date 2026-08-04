import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Calendar, CalendarDays, FileText, LayoutDashboard, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBadgeVariant } from "@/helpers/componentHelpers";
import { formatCurrency } from "@/helpers/formatHelpers";

const TAGLINE_FADE_MS = 2000;
const TAGLINE_HOLD_MS = 3000;
const TAGLINE_INTERVAL_MS = TAGLINE_FADE_MS + TAGLINE_FADE_MS + TAGLINE_HOLD_MS;

const taglines = [
    "I wanted to track my job search, so baw gawd I made a way.",
    "\"We'll be in touch\" is not a pipeline stage.",
    "My therapist said stop doom-scrolling LinkedIn. I built this instead.",
    "LinkedIn says Applied. Your spreadsheet says ???",
    "Finally, a home for every ghosted recruiter.",
    "Every application deserves a next step.",
    "Your job search, organized from first apply to final offer.",
    "Turn fifty open tabs into one clear pipeline.",
    "Know exactly where every opportunity stands.",
    "Never let a follow-up slip through the cracks again.",
    "Built for people who take the process seriously.",
    "Ghosted by a recruiter? At least you'll remember their name.",
];

const features = [
    {
        icon: <LayoutDashboard className="h-5 w-5" />,
        title: "Visual pipeline",
        desc: "Drag and drop applications through custom stages as you progress.",
        color: "bg-violet-50 text-violet-700",
    },
    {
        icon: <Bell className="h-5 w-5" />,
        title: "Follow-up alerts",
        desc: "Never let an application go cold. Get warned when it's time to reach out.",
        color: "bg-emerald-50 text-emerald-700",
    },
    {
        icon: <Calendar className="h-5 w-5" />,
        title: "Event calendar",
        desc: "Keep interviews, calls, and deadlines organized in one place.",
        color: "bg-amber-50 text-amber-700",
    },
    {
        icon: <FileText className="h-5 w-5" />,
        title: "Resume generator",
        desc: "Generate a tailored resume for each role with AI assistance.",
        color: "bg-blue-50 text-blue-700",
    },
];

const stats = [
    { value: "2,400+", label: "Applications tracked" },
    { value: "98%", label: "Never miss a follow-up" },
    { value: "Free", label: "Always" },
];

const previewColumns = [
    {
        label: "Wishlist",
        step: "Step 1",
        stepColor: "text-violet-600",
        headerBg: "bg-violet-50",
        labelColor: "text-violet-700",
        cards: [
            { company: "Optomi", title: ".Net Developer", locationType: "Hybrid", address: null, salary: 130000, appliedDate: null, hasNotes: true },
            { company: "Humana", title: "Lead Full Stack Engineer", locationType: "Remote", address: null, salary: 135000, appliedDate: null, hasNotes: true },
        ],
    },
    {
        label: "Applied",
        step: "Step 2",
        stepColor: "text-blue-600",
        headerBg: "bg-blue-50",
        labelColor: "text-blue-700",
        cards: [
            { company: "Crate And Barrel", title: "Lead Software Engineer", locationType: "Remote", address: null, salary: 130000, appliedDate: "Jun 4, 2026", hasNotes: false },
            { company: "Source Code Technologies", title: ".Net Architect", locationType: "Remote", address: "Lake Forest, CA, USA", salary: 130000, appliedDate: "Jun 5, 2026", hasNotes: false },
        ],
    },
    {
        label: "Accepted",
        step: "Step 7",
        stepColor: "text-emerald-600",
        headerBg: "bg-emerald-50",
        labelColor: "text-emerald-700",
        cards: [
            { company: "Acme Corp", title: "Senior Software Engineer", locationType: "Remote", address: "Austin, TX, USA", salary: 175000, appliedDate: "Jun 10, 2026", hasNotes: false },
        ],
    },
];


/** Renders the marketing landing page with a rotating tagline and feature preview. */
export default function LandingPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let fadeOutTimeout: number | undefined;
        let fadeInFrame: number | undefined;

        const interval = window.setInterval(() => {
            setVisible(false);

            fadeOutTimeout = window.setTimeout(() => {
                setCurrentIndex((current) => (current + 1) % taglines.length);

                fadeInFrame = window.requestAnimationFrame(() => {
                    fadeInFrame = window.requestAnimationFrame(() => {
                        setVisible(true);
                    });
                });
            }, TAGLINE_FADE_MS);
        }, TAGLINE_INTERVAL_MS);

        return () => {
            clearInterval(interval);
            if (fadeOutTimeout !== undefined)
                clearTimeout(fadeOutTimeout);
            if (fadeInFrame !== undefined)
                cancelAnimationFrame(fadeInFrame);
        };
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="flex flex-col items-center text-left px-6 pt-16 pb-10">
                <div className="flex items-center gap-4 px-4 py-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <span className="text-2xl font-bold">J</span>
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-bold tracking-tight text-slate-600">
                            Jobby
                        </h1>
                        <p className="truncate text-sm text-slate-600">
                            Track every opportunity.
                        </p>
                    </div>
                </div>
                <h1 className="mb-4 h-35 max-w-xl overflow-hidden text-4xl leading-tight font-bold tracking-tight">
                    <span
                        aria-live="polite"
                        style={{
                            opacity: visible ? 1 : 0,
                            transition: `opacity ${TAGLINE_FADE_MS}ms ease-in-out`,
                        }}
                        className="block text-primary"
                    >
                        {taglines[currentIndex]}
                    </span>
                </h1>
                <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
                    Track every application, never miss a follow-up, and land your next role faster with a visual pipeline built for job seekers.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center mb-10">
                    <Button asChild size="lg">
                        <Link to="/register">Get started free</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link to="/login">Sign in</Link>
                    </Button>
                </div>

                {/* Board preview */}
                <div className="w-full max-w-3xl border rounded-xl bg-muted/30 p-3">
                    <div className="flex gap-2 overflow-hidden">
                        {previewColumns.map((col) => (
                            <div key={col.label} className="flex-1 min-w-0">
                                <div className={`${col.headerBg} rounded-lg px-3 py-2 mb-3 flex items-center justify-between`}>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-xs font-semibold ${col.labelColor}`}>{col.label}</span>
                                        <span className="text-xs text-muted-foreground">{col.cards.length}</span>
                                    </div>
                                    <span className={`text-xs font-medium ${col.stepColor}`}>{col.step}</span>
                                </div>
                                <div className="space-y-2 p-4">
                                    {col.cards.map((card) => (
                                        <Card key={card.company + card.title} className="w-full shadow-none">
                                            <CardHeader className="px-3 pb-0 pt-3">
                                                <div className="flex min-w-0 items-start justify-between gap-1">
                                                    <div className="flex min-w-0 items-start gap-2">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                                                            {card.company.slice(0, 1)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="truncate text-xs font-bold leading-tight">{card.title}</div>
                                                            <div className="truncate text-xs text-muted-foreground flex justify-start">{card.company}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="px-3 pb-3 pt-3">
                                                <div className="mb-2">
                                                    <Badge variant={getBadgeVariant(card.locationType)} className="text-xs rounded-full">
                                                        {card.locationType}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-xs text-muted-foreground">
                                                    {card.address && (
                                                        <div className="flex items-start gap-1">
                                                            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                                            <span className="truncate">{card.address}</span>
                                                        </div>
                                                    )}
                                                    {card.salary && (
                                                        <div className="font-semibold text-foreground text-xs">{formatCurrency(card.salary)}</div>
                                                    )}
                                                    {card.appliedDate && (
                                                        <div className="flex items-center gap-1 border-t pt-1.5 mt-1.5">
                                                            <CalendarDays className="h-3 w-3" />
                                                            <span>{card.appliedDate}</span>
                                                        </div>
                                                    )}
                                                    {card.hasNotes && (
                                                        <div className="border-t pt-1.5 mt-1.5">
                                                            <Badge variant="outline" className="text-xs">Notes</Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t mx-6" />

            {/* Features */}
            <section className="px-6 py-12 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((f) => (
                        <Card key={f.title} className="shadow-none">
                            <CardContent className="p-5">
                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${f.color}`}>
                                    {f.icon}
                                </div>
                                <p className="font-semibold text-sm mb-1">{f.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <div className="border-t mx-6" />

            {/* Stats */}
            <section className="px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground mb-6">Trusted by job seekers</p>
                <div className="flex justify-center gap-12 flex-wrap">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-muted/40 border-t px-6 py-12 text-center">
                <h2 className="text-xl font-bold mb-2">Ready to take control of your job search?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Start tracking applications in minutes. No credit card required.
                </p>
                <Button asChild size="lg">
                    <Link to="/register">Create your free account</Link>
                </Button>
            </section>
        </div>
    );
}