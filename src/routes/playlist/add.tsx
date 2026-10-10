import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useSavePlaylist } from "@/src/utils/playlist";
import { Spinner } from "@/src/components/ui/spinner";

export const Route = createFileRoute("/playlist/add")({
  component: PlaylistAddPage,
});

const urlPattern = /^https?:\/\/\S+$/i;

function PlaylistAddPage() {
  const navigate = useNavigate();
  const createPlaylist = useSavePlaylist();
  const form = useForm({
    defaultValues: {
      name: "",
      uri: "",
    },
    onSubmit: async ({ value }) => {
      await createPlaylist.mutateAsync({
        name: value.name.trim(),
        uri: value.uri.trim(),
      });
      form.reset();
      await navigate({ to: "/playlist" });
    },
  });

  return (
    <main className="min-w-0 flex-1 space-y-4 p-6 md:space-y-8">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Add Playlist</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="add-playlist"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    value.trim().length > 0
                      ? undefined
                      : "Playlist name is required.",
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        autoComplete="off"
                        aria-invalid={isInvalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        placeholder="Name for the playlist/URL."
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors.map((error) =>
                            typeof error === "string"
                              ? { message: error }
                              : error,
                          )}
                        />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="uri"
                validators={{
                  onChange: ({ value }) =>
                    urlPattern.test(value.trim())
                      ? undefined
                      : "Enter a valid HTTP or HTTPS URL.",
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        autoComplete="off"
                        aria-invalid={isInvalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        placeholder="URL/Link for the playlist."
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors.map((error) =>
                            typeof error === "string"
                              ? { message: error }
                              : error,
                          )}
                        />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            {createPlaylist.isError &&
              createPlaylist.error.response?.data?.message && (
                <FieldError
                  errors={[
                    { message: createPlaylist.error.response.data.message },
                  ]}
                />
              )}
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                createPlaylist.reset();
                form.reset();
              }}
              disabled={createPlaylist.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="add-playlist"
              disabled={createPlaylist.isPending}
            >
              {createPlaylist.isPending && <Spinner />} Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </main>
  );
}
