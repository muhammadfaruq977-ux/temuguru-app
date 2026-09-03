import JoinTutorForm from "@/components/JoinTutorForm";

export default async function JoinTutorPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const isSuccess = params?.success === "true";
  const errorParam = params?.error;

  return <JoinTutorForm isSuccess={isSuccess} errorParam={errorParam} />;
}