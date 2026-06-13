import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

export default function InfoField({ label, value }: { label: string; value?: string }) {
    return (
        <Field className="py-3">
            <FieldLabel>{label}</FieldLabel>
            <FieldDescription>{value || "Not provided"}</FieldDescription>
        </Field>
    );
}