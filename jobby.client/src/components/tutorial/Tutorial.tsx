import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Archive,
    ArrowRight,
    CalendarDays,
    Check,
    Columns3,
    Eye,
    GripVertical,
    Pencil,
    Plus,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TutorialAction = {
    to: string;
    label: string;
};

type TutorialSection = {
    id: string;
    title: string;
    summary: string;
    icon: LucideIcon;
    steps: string[];
    note?: string;
    action: TutorialAction;
};

const sections: TutorialSection[] = [
    {
        id: "stages",
        title: "Create pipeline stages",
        summary: "Stages are the columns on your dashboard. Each one is a step in your search, such as Saved, Applied, or Interview.",
        icon: Columns3,
        steps: [
            "Open Dashboard from the sidebar.",
            "Click the + button beside Job Application Pipeline. If you have no stages yet, you can also click Create stage in the empty board.",
            "In Create New Stage, enter a name and choose a color. The color is how that column appears on the board.",
            "Click Save. The stage shows up as a new column.",
            "To rename or recolor a stage, open the three-dot menu on the column header, choose Edit, then Save.",
            "To change the order of columns, drag a stage by the grip on its header.",
        ],
        note: "Delete is in the same column menu. A stage can be deleted only after every application has been moved out of it.",
        action: { to: "/dashboard", label: "Open the dashboard" },
    },
    {
        id: "applications",
        title: "Add an application",
        summary: "Applications live inside a stage. A new application starts as In Progress.",
        icon: Plus,
        steps: [
            "On the stage where the application belongs, open the three-dot menu on the column header.",
            "Choose New Application.",
            "Pick Scrape from URL to paste a job posting link and fill the form from the page, or Enter details yourself to type them in.",
            "If you scrape a URL, review the filled form before saving. You can still change any field.",
            "Fill in company name, title, summary, posting URL, and location type. Address, target salary, apply date, contact, and notes are optional.",
            "Click Save. A card for that job appears in the stage.",
        ],
        note: "The Search box above the board filters cards by company, title, and other text on the application.",
        action: { to: "/dashboard", label: "Add an application" },
    },
    {
        id: "moving",
        title: "Move an application",
        summary: "Drag a card from one stage column to another when the role moves forward, or back.",
        icon: GripVertical,
        steps: [
            "On the dashboard, press and hold an application card.",
            "Drag it onto the stage column where it belongs, then release.",
            "The card stays in the new stage.",
        ],
        note: "If a column is off to the side, use the arrow buttons on the left and right of the board to scroll to it.",
        action: { to: "/dashboard", label: "Open the pipeline" },
    },
    {
        id: "editing",
        title: "Edit an application",
        summary: "Update the details on a card any time the posting, salary, or your notes change.",
        icon: Pencil,
        steps: [
            "Open the three-dot menu on the application card.",
            "Choose Edit.",
            "Change the fields in the Edit Application sheet.",
            "Click Save. The card updates with the new details.",
        ],
        action: { to: "/dashboard", label: "Open your applications" },
    },
    {
        id: "viewing",
        title: "View an application",
        summary: "Open a card to read the full record without changing it.",
        icon: Eye,
        steps: [
            "Click the application card itself. The three-dot menu stays separate, so it will not open the details.",
            "The Application Details sheet shows the company, title, location, salary, apply date, contact, and notes.",
            "Upcoming events for that job are listed in the same sheet.",
            "If you saved a posting URL, Open Job Posting opens it in a new tab.",
        ],
        note: "Choose History from the card menu to see how the application's status has changed over time.",
        action: { to: "/dashboard", label: "View an application" },
    },
    {
        id: "archiving",
        title: "Archive an application",
        summary: "Archive a role you are done tracking. It leaves the pipeline and stays available under Archives.",
        icon: Archive,
        steps: [
            "Open the three-dot menu on the application card.",
            "Choose Archive. The card disappears from the dashboard.",
            "Open Archives in the sidebar to see every archived application.",
            "Use Search archived to find one by company or title.",
            "Click the restore icon to put it back on the pipeline, or the trash icon to delete it permanently.",
        ],
        note: "Archive keeps the record. Delete, from the card menu or from Archives, removes it for good.",
        action: { to: "/archive", label: "Open archives" },
    },
    {
        id: "status",
        title: "Set the outcome",
        summary: "Mark a role as still in process, accepted, or rejected. The current status is hidden from the menu, so you only see the other choices.",
        icon: Check,
        steps: [
            "Open the three-dot menu on the application card.",
            "Choose In Progress while you are still working the role.",
            "Choose Accepted when you get the offer. The card turns green.",
            "Choose Rejected when the role is closed. The card turns red and counts in the Rejected total at the top of the dashboard.",
        ],
        note: "Active on the dashboard is every application that is not rejected. Applied counts applications that have an apply date, in any status.",
        action: { to: "/dashboard", label: "Update a status" },
    },
    {
        id: "calendar",
        title: "Schedule an event",
        summary: "Calendar events are interviews, follow-ups, and other dates tied to one job application.",
        icon: CalendarDays,
        steps: [
            "Open Calendar from the sidebar.",
            "Click the + button beside Events Calendar.",
            "In Create New Event, choose the application. Each option is listed as company and job title.",
            "Enter a title, a description, and the date and time.",
            "Click Create. The event appears on the month view.",
            "Click the event on the calendar to read its details and the linked application. You can delete it from that dialog.",
        ],
        note: "The same event also shows on the application card and under Upcoming Events in Application Details. A date within two days is shown in red, and a date within a week is shown in yellow.",
        action: { to: "/calendar", label: "Open the calendar" },
    },
    {
        id: "recruiters",
        title: "Add a recruiter",
        summary: "The Recruiters panel on the dashboard keeps the people you are working with next to the pipeline.",
        icon: Users,
        steps: [
            "On the dashboard, find the Recruiters column on the left.",
            "Click the + button. If you have none yet, you can also click Add recruiter.",
            "Enter the recruiter's name, agency, phone number, and email.",
            "Set the last contact date and the next contact date, and add any notes.",
            "Click Save. The recruiter appears as a card in the panel.",
            "Click the card to read the details. The three-dot menu on the card can edit or delete that recruiter.",
        ],
        action: { to: "/dashboard", label: "Open recruiters" },
    },
];

/** Scrolls a tutorial section into view and marks it active. */
function showSection(id: string, setActiveId: (id: string) => void) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
}

/** Renders the in-app walkthrough for pipeline, application, calendar, and recruiter features. */
export default function Tutorial() {
    const [activeId, setActiveId] = useState(sections[0].id);

    useEffect(() => {
        const nodes = sections
            .map((section) => document.getElementById(section.id))
            .filter((node): node is HTMLElement => node != null);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible?.target.id)
                    setActiveId(visible.target.id);
            },
            { rootMargin: "-15% 0px -55% 0px", threshold: [0.25, 0.6] },
        );

        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Tutorial</h1>
                    <p className="text-sm text-muted-foreground">
                        Start with a pipeline stage, add an application, then use the rest of these steps as you go. Each topic matches the controls on the dashboard, calendar, and archives.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/dashboard">
                        Go to the dashboard
                        <ArrowRight />
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                <nav aria-label="Tutorial topics" className="lg:sticky lg:top-6 lg:w-64 lg:shrink-0">
                    <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                        {sections.map((section, index) => {
                            const isActive = section.id === activeId;
                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    aria-current={isActive ? "true" : undefined}
                                    onClick={() => showSection(section.id, setActiveId)}
                                    className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm transition-colors lg:w-full ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                                >
                                    <span className="mr-2 tabular-nums">{index + 1}.</span>
                                    {section.title}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="min-w-0 flex-1 space-y-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Step {index + 1} of {sections.length}
                                                </p>
                                                <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                                                <CardDescription>{section.summary}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ol className="space-y-3">
                                            {section.steps.map((step, stepIndex) => (
                                                <li key={step} className="flex gap-3">
                                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                                        {stepIndex + 1}
                                                    </span>
                                                    <span className="pt-0.5">{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                        {section.note && (
                                            <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                                                {section.note}
                                            </p>
                                        )}
                                        <Button asChild variant="outline">
                                            <Link to={section.action.to}>
                                                {section.action.label}
                                                <ArrowRight />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
