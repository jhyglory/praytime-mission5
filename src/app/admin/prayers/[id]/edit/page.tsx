import { notFound } from "next/navigation";
import { getPrayer, CmsError } from "@/lib/prayers/store";
import { isPrayerId } from "@/lib/prayers/model";
import { PrayerForm } from "@/components/prayers/prayer-form";
import { CmsConnectionError, returnPage } from "@/components/prayers/ui";
export const dynamic = "force-dynamic";
export default async function EditPrayer({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  if (!isPrayerId(id)) notFound();
  const query = await searchParams;
  let prayer;
  try {
    prayer = await getPrayer(id);
  } catch (error) {
    return (
      <CmsConnectionError
        configured={
          error instanceof CmsError && error.code !== "CONFIGURATION_REQUIRED"
        }
      />
    );
  }
  if (!prayer) notFound();
  return (
    <>
      <h1 className="mb-7 !text-3xl !leading-10">기도문 수정</h1>
      <PrayerForm prayer={prayer} page={returnPage(query.page)} />
    </>
  );
}
