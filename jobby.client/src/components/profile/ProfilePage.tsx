import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { formatChartDayLabel } from "@/helpers/profileStatsHelpers";
import { getProfileStats, updateProfile } from "@/services/profileService";
import type { ProfileStats } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const chartConfig = {
    added: {
        label: "Added",
        color: "#3b82f6",
    },
    applied: {
        label: "Applied",
        color: "#22c55e",
    },
};

function ProfileStatCards({ added, applied }: { added: number; applied: number }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Card className="flex h-20 w-full justify-center border-none bg-stone-100 shadow-none ring-0">
                <CardContent className="flex flex-col">
                    <div className="text-3xl font-bold text-blue-900">{added}</div>
                    <div className="text-sm">Added</div>
                </CardContent>
            </Card>
            <Card className="flex h-20 w-full justify-center border-none bg-stone-100 shadow-none ring-0">
                <CardContent className="flex flex-col">
                    <div className="text-3xl font-bold text-green-900">{applied}</div>
                    <div className="text-sm">Applied</div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ProfilePage() {
    const location = useLocation();
    const { user, updateDisplayName } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [refresh, setRefresh] = useState(0);
    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }
    useEffect(() => {
        function setUserName() {
            setDisplayName(user?.displayName ?? "");
        }
        setUserName();
    }, [user?.displayName]);

    useEffect(() => {
        function loadUserStats() {
            let cancelled = false;
            setIsLoadingStats(true);

            async function loadStats() {
                try {
                    const data = await getProfileStats();
                    if (!cancelled)
                        setStats(data);
                } catch {
                    if (!cancelled)
                        toast.error("Failed to load profile statistics.");
                } finally {
                    if (!cancelled)
                        setIsLoadingStats(false);
                }
            }

            loadStats();

            return () => {
                cancelled = true;
            };
        }
        loadUserStats();
    }, [location.pathname]);

    const chartData = useMemo(() => {
        if (!stats?.dailyStats?.length)
            return [];

        return stats.dailyStats.map((point) => ({
            date: point.date,
            label: formatChartDayLabel(point.date),
            added: point.added ?? 0,
            applied: point.applied ?? 0,
        }));
    }, [stats]);

    const hasActivity = chartData.some(
        (point) => point.added > 0 || point.applied > 0,
    );

    async function handleSave() {
        const trimmed = displayName.trim();
        if (!trimmed) {
            toast.error("Display name is required.");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({ displayName: trimmed });
            updateDisplayName(trimmed);
            toast.success("Profile updated.");
        } catch {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and review your application activity.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Your email cannot be changed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email ?? ""} readOnly disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Last 30 days</h2>
                    <p className="text-muted-foreground text-sm">
                        Added counts applications by creation date. Applied counts by applied date.
                    </p>
                </div>
                {stats && (
                    <ProfileStatCards
                        added={stats.totalAdded}
                        applied={stats.totalApplied}
                    />
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity over time</CardTitle>
                    <CardDescription>
                        Daily counts of applications added and applied.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingStats ? (
                        <p className="text-muted-foreground text-sm">Loading chart...</p>
                    ) : stats && hasActivity ? (
                        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full min-h-[320px]">
                            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    interval={4}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    allowDecimals={false}
                                    width={40}
                                />
                                <ChartTooltip content={<ChartTooltipContent labelKey="label" />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Line
                                    type="linear"
                                    dataKey="added"
                                    name="added"
                                    stroke="var(--color-added)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="linear"
                                    dataKey="applied"
                                    name="applied"
                                    stroke="var(--color-applied)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No application activity recorded in the last 30 days yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
