import type { Recruiter } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/button";
import { DateTimePicker } from "../ui/date-time";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export type RecruiterCreateProps = {
    title: string;
    item: Recruiter;
    setItem: Dispatch<SetStateAction<Recruiter>>;
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>
    action: () => void;
}
export default function RecruiterForm({ title, item, setItem, dialogOpen, setDialogOpen, action }: RecruiterCreateProps) {
    const [nextOpen, setNextOpen] = useState<boolean>(false);
    const [lastOpen, setLastOpen] = useState<boolean>(false);
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>           
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-name">Name</FieldLabel>
                    <FieldDescription>
                        The name of the recruiter contact.
                    </FieldDescription>
                    <Input
                        id="input-recruiter-name"
                        type="text"
                        placeholder="Enter the recruiter name."
                        value={item.name}
                        onChange={(e) => setItem({ ...item, name: e.target.value })}
                    />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-agency">Agency</FieldLabel>
                    <FieldDescription>
                        The name of the agency the recruiter is with.
                    </FieldDescription>
                    <Input
                        id="input-recruiter-agency"
                        type="text"
                        placeholder="Enter the agency name."
                        value={item.agency}
                        onChange={(e) => setItem({...item, agency: e.target.value })}
                    />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-phone">Phone Number</FieldLabel>
                    <FieldDescription>
                        The recruiter contact phone number.
                    </FieldDescription>
                    <Input
                        id="input-recruiter-phone"
                        type="text"
                        maxLength={12}
                        placeholder="Enter the recruiter contact phone number."
                        value={item.phoneNumber}
                        onChange={(e) => setItem({...item, phoneNumber: e.target.value })}
                    />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-email">Email</FieldLabel>
                    <FieldDescription>
                        The email of the recruiter.
                    </FieldDescription>
                    <Input
                        id="input-recruiter-email"
                        type="text"
                        placeholder="Enter the recruiter email."
                        value={item.email}
                        onChange={(e) => setItem({ ...item, email: e.target.value })}
                    />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-last">Last Contact Date</FieldLabel>
                    <FieldDescription>
                        The last date of contact with the recruiter.
                    </FieldDescription>
                    <DateTimePicker dateTime={item.lastContact} isOpen={lastOpen} setIsOpen={setLastOpen} action={(date) =>
                        setItem({
                            ...item,
                            lastContact: date,
                        })
                    } />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-next">Next Contact Date</FieldLabel>
                    <FieldDescription>
                        The next date of contact with the recruiter.
                    </FieldDescription>
                    <DateTimePicker dateTime={item.nextContact} isOpen={nextOpen} setIsOpen={setNextOpen} action={(date) =>
                        setItem({
                            ...item,
                            nextContact: date,
                        })
                    } />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-recruiter-notes">Notes</FieldLabel>
                    <FieldDescription>
                        Notes on the recruiter.
                    </FieldDescription>
                    <Input
                        id="input-recruiter-notes"
                        type="textarea"
                        placeholder="Enter the notes."
                        value={item.notes}
                        onChange={(e) => setItem({...item, notes: e.target.value })}
                    />
                </Field>
                <DialogFooter>
                    <Button className="w-full" onClick={action} type="submit">Save</Button>
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

