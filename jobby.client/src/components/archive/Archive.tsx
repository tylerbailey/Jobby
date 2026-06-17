import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/helpers/formatHelpers";
import type { Application } from "@/types";
import { ArchiveRestore, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getBadgeVariant } from "@/helpers/componentHelpers";
import { Status } from "@/enum/enums";
import { deleteApp, getArchivedApps, updateApp } from "@/services/appService";
import { toast } from "sonner";

export default function ArchivedApps() {
    const [refresh, setRefresh] = useState(0);
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<Application[]>([])

    useEffect(() => {
        async function getArchived() {
            const response = await getArchivedApps();
            setItems(response.data);
        }
        getArchived();
    }, [refresh])

    function handleRefresh() {
        setRefresh(refresh + 1);
    }

    async function handleDelete(application: Application) {
        await deleteApp(application.id);
        handleRefresh();
        toast.info("Archived application deleted.")
    }

    async function handleUnarchive(application: Application) {
        await updateApp({ ...application, isArchived: false })
        handleRefresh();
        toast.info("Archived application restored.")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Archived Applications</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {items.length} archived application{items.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search archived..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-10"></TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Salary</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                                    {search ? "No applications match your search." : "No archived applications."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                            {item.companyName.slice(0, 1)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.companyName}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.jobTitle}</TableCell>
                                    <TableCell>
                                        {item.locationType && (
                                            <Badge variant={getBadgeVariant(item.locationType)}>
                                                {item.locationType}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.salary ? formatCurrency(item.salary) : "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.appliedDate ? formatDate(item.appliedDate) : "—"}
                                    </TableCell>
                                    <TableCell>
                                        {item.status == Status.Accepted ? (
                                            <Badge className="bg-emerald-50 text-emerald-700">Accepted</Badge>
                                        ) : item.status == Status.Rejected ? (
                                            <Badge className="bg-red-50 text-red-700">Rejected</Badge>
                                        ) : (
                                            <Badge variant="outline">Archived</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => handleUnarchive(item) }
                                            variant="ghost"
                                            size="icon"
                                            title="Restore application">
                                            <ArchiveRestore className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick= { () => handleDelete(item) }
                                            variant="ghost"
                                            size="icon"
                                            title="Delete application">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}