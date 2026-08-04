import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/authContext";
import {
    deleteUser,
    getAllRoles,
    getAllUsers,
    updateUser,
    updateUserRoles,
} from "@/services/userService";
import type { AdminUser } from "@/types";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type EditFormState = {
    email: string;
    displayName: string;
    isApproved: boolean;
    emailConfirmed: boolean;
    lockoutEnabled: boolean;
    password: string;
    roles: string[];
};

/** Converts an admin user into editable form state. */
function toFormState(user: AdminUser): EditFormState {
    return {
        email: user.email,
        displayName: user.displayName ?? "",
        isApproved: user.isApproved,
        emailConfirmed: user.emailConfirmed,
        lockoutEnabled: user.lockoutEnabled,
        password: "",
        roles: [...user.roles],
    };
}

/** Renders the admin dashboard for managing users, approvals, and roles. */
export default function AdminDashboard() {
    const {user: currentUser } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [form, setForm] = useState<EditFormState | null>(null);
    const [refresh, setRefresh] = useState(0);

    /** Triggers a reload of the user list. */
    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }

    useEffect(() => {
        /** Loads all users and available roles from the server. */
        async function loadUsers() {
            setLoading(true);
            try {
                const [usersData, rolesData] = await Promise.all([getAllUsers(), getAllRoles()]);
                setUsers(usersData);
                setAvailableRoles(rolesData);
            } catch {
                toast.error("Failed to load users.");
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, [refresh]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query)
            return users;

        return users.filter((user) =>
            user.email.toLowerCase().includes(query) ||
            (user.displayName?.toLowerCase().includes(query) ?? false) ||
            user.roles.some((role) => role.toLowerCase().includes(query))
        );
    }, [search, users]);

    /** Opens the edit dialog for the given user. */
    function openEdit(user: AdminUser) {
        setEditingUser(user);
        setForm(toFormState(user));
    }

    /** Closes the edit dialog and clears the form state. */
    function closeEdit() {
        setEditingUser(null);
        setForm(null);
    }

    /** Toggles whether the given role is assigned in the edit form. */
    function toggleRole(role: string) {
        if (!form)
            return;

        setForm({
            ...form,
            roles: form.roles.includes(role)
                ? form.roles.filter((r) => r !== role)
                : [...form.roles, role],
        });
    }

    /** Saves the edited user's details and role assignments. */
    async function handleSave() {
        if (!editingUser || !form)
            return;

        setSaving(true);
        try {
            await updateUser(editingUser.id, {
                email: form.email,
                displayName: form.displayName,
                isApproved: form.isApproved,
                emailConfirmed: form.emailConfirmed,
                lockoutEnabled: form.lockoutEnabled,
                password: form.password.trim() || undefined,
            });

            await updateUserRoles(editingUser.id, { roles: form.roles });
            toast.success("User updated.");
            closeEdit();
            handleRefresh();
        } catch (err: unknown) {
            const message =
                err &&
                typeof err === "object" &&
                "response" in err &&
                err.response &&
                typeof err.response === "object" &&
                "data" in err.response &&
                err.response.data &&
                typeof err.response.data === "object" &&
                "message" in err.response.data
                    ? String(err.response.data.message)
                    : "Failed to update user.";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    /** Deletes the given user after confirmation. */
    async function handleDelete(user: AdminUser) {
        if (!window.confirm(`Delete ${user.email}? This cannot be undone.`))
            return;

        try {
            await deleteUser(user.id);
            toast.success("User deleted.");
            handleRefresh();
        } catch (err: unknown) {
            const message =
                err &&
                typeof err === "object" &&
                "response" in err &&
                err.response &&
                typeof err.response === "object" &&
                "data" in err.response &&
                err.response.data &&
                typeof err.response.data === "object" &&
                "message" in err.response.data
                    ? String(err.response.data.message)
                    : "Failed to delete user.";
            toast.error(message);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage users, approvals, and role assignments.
                </p>
            </div>

            <div className="relative w-72">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead>Email</TableHead>
                            <TableHead>Display Name</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell>{user.displayName || "—"}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.isApproved ? "default" : "secondary"}>
                                            {user.isApproved ? "Approved" : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge key={role} variant="outline">
                                                        {role}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground">None</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEdit(user)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={user.id === currentUser?.id}
                                                onClick={() => handleDelete(user)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingUser} onOpenChange={(open) => !open && closeEdit()}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update account details, approval status, password, and roles.
                        </DialogDescription>
                    </DialogHeader>

                    {form && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    value={form.displayName}
                                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.isApproved}
                                        onChange={(e) => setForm({ ...form, isApproved: e.target.checked })}
                                    />
                                    Approved
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.emailConfirmed}
                                        onChange={(e) => setForm({ ...form, emailConfirmed: e.target.checked })}
                                    />
                                    Email Confirmed
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.lockoutEnabled}
                                        onChange={(e) => setForm({ ...form, lockoutEnabled: e.target.checked })}
                                    />
                                    Lockout Enabled
                                </label>
                            </div>

                            <div className="space-y-2">
                                <Label>Roles</Label>
                                <div className="flex flex-wrap gap-4">
                                    {availableRoles.map((role) => (
                                        <label key={role} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={form.roles.includes(role)}
                                                onChange={() => toggleRole(role)}
                                            />
                                            {role}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeEdit} disabled={saving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving || !form}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
