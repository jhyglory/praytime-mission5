import { listPrayers } from '@/lib/prayers/store';
import { savePrayer } from '@/lib/prayers/mutations';
import { checkWriteOrigin,cmsResponse,cmsFailure,parsePrayerForm } from '@/lib/prayers/http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request) {
  try {return cmsResponse(await listPrayers(Number(new URL(request.url).searchParams.get('page')||1)));}catch(error){return cmsFailure(error);}
}
export async function POST(request:Request) {
  try {
    checkWriteOrigin(request);const form=await parsePrayerForm(request);
    if('fields' in form) return cmsResponse({error:'입력 내용을 확인해 주세요.',fields:form.fields},422);
    return cmsResponse(await savePrayer(form.input,form.image,form.action),201);
  } catch(error) {return cmsFailure(error);}
}
