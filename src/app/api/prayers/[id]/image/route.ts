import { getPrayer,safeImagePath } from '@/lib/prayers/store';
import { getPrayerClient,PRAYER_BUCKET,CmsError } from '@/lib/prayers/config';
import { cmsResponse,cmsFailure } from '@/lib/prayers/http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    const{id}=await params;const prayer=await getPrayer(id);
    if(!prayer?.image_path||!safeImagePath(id,prayer.image_path))return cmsResponse({error:'대표 이미지가 없습니다.'},404);
    const file=await getPrayerClient().storage.from(PRAYER_BUCKET).download(prayer.image_path);
    if(file.error||!file.data)throw new CmsError('IMAGE_UNAVAILABLE','이미지를 불러오지 못했습니다.',502);
    return new Response(file.data,{headers:{'Content-Type':file.data.type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'"}});
  }catch(error){return cmsFailure(error);}
}
