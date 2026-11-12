import Link from "next/link";
export default function NotFound() {
  return (
    <div>
      <h1 className="!text-3xl !leading-10">기도문을 찾을 수 없습니다</h1>
      <p className="my-4">주소가 올바르지 않거나 이미 삭제된 기도문입니다.</p>
      <Link href="/admin/prayers" className="underline underline-offset-4">
        기도문 목록으로
      </Link>
    </div>
  );
}
