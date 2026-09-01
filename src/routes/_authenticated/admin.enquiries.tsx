import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminListEnquiries,
  deleteEnquiry,
  setEnquiryHandled,
} from "../../lib/admin.functions";
import { Card, PageHeading, dangerButton, ghostButton } from "../../components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: AdminEnquiries,
});

function AdminEnquiries() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListEnquiries);
  const toggle = useServerFn(setEnquiryHandled);
  const remove = useServerFn(deleteEnquiry);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: () => list(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
  const toggleMutation = useMutation({
    mutationFn: (input: { id: string; handled: boolean }) => toggle({ data: input }),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  return (
    <div>
      <PageHeading title="Enquiries" description="Messages sent through the contact form." />
      {isPending && <p className="text-body-md text-on-surface-variant">Loading…</p>}
      {!isPending && (data ?? []).length === 0 && (
        <p className="text-body-md text-on-surface-variant">No enquiries yet.</p>
      )}
      <div className="space-y-4">
        {(data ?? []).map((enquiry) => (
          <Card key={enquiry.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-headline-sm text-deep-forest">{enquiry.name}</p>
                <p className="text-body-md text-on-surface-variant">
                  <a className="hover:text-deep-forest" href={`mailto:${enquiry.email}`}>
                    {enquiry.email}
                  </a>
                  {enquiry.phone ? ` · ${enquiry.phone}` : ""}
                </p>
                <p className="label mt-1 text-savannah-gold">
                  {new Date(enquiry.createdAt).toLocaleString("en-GB")}
                  {enquiry.handled ? " · handled" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={ghostButton}
                  disabled={toggleMutation.isPending}
                  onClick={() =>
                    toggleMutation.mutate({ id: enquiry.id, handled: !enquiry.handled })
                  }
                >
                  {enquiry.handled ? "Mark unhandled" : "Mark handled"}
                </button>
                <button
                  type="button"
                  className={dangerButton}
                  disabled={removeMutation.isPending}
                  onClick={() => {
                    if (window.confirm("Delete this enquiry?")) removeMutation.mutate(enquiry.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-body-md text-deep-forest">
              {enquiry.message}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
