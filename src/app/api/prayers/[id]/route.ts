import { getPrayer } from '@/lib/prayers/store';
import { isPrayerId } from '@/lib/prayers/model';
import { savePrayer,deletePrayer } from '@/lib/prayers/mutations';
import { checkWriteOrigin,cmsResponse,cmsFailure,parsePrayerForm } from '@/lib/prayers/http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_request:Request,{params}:Context) {
  try {const{id}=await params;const prayer=await getPrayer(id);return prayer?cmsResponse(prayer):cmsResponse({error:'기도문을 찾을 수 없습니다.'},404);}catch(error){return cmsFailure(error);}
}
export async function PUT(request:Request,{params}:Context) {
  try {checkWriteOrigin(request);const{id}=await params;if(!isPrayerId(id))return cmsResponse({error:'기도문을 찾을 수 없습니다.'},404);
    const form=await parsePrayerForm(request);if('fields' in form)return cmsResponse({error:'입력 내용을 확인해 주세요.',fields:form.fields},422);
    return cmsResponse(await savePrayer(form.input,form.image,form.action,id));
  }catch(error){return cmsFailure(error);}
}
export async function DELETE(request:Request,{params}:Context) {
  try {checkWriteOrigin(request);const{id}=await params;if(!isPrayerId(id))return cmsResponse({error:'기도문을 찾을 수 없습니다.'},404);return cmsResponse(await deletePrayer(id));}catch(error){return cmsFailure(error);}
}
