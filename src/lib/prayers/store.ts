import 'server-only';
import { getPrayerClient, CmsError } from './config';
import { PAGE_SIZE, isPrayerId, type Prayer } from './model';
export { CmsError } from './config';
const columns = 'id,source_key,title,content,category,category_full,keyword,scripture_ref,scripture_text,language,image_path,source_payload,created_at,updated_at';
export async function listPrayers(requestedPage = 1) {
  const db = getPrayerClient();
  try {
    const countResult = await db.from('prayers').select('id',{count:'exact',head:true});
    if(countResult.error || countResult.count === null) throw Error();
    const total = countResult.count, pageCount = Math.max(1,Math.ceil(total/PAGE_SIZE));
    const page = Math.min(pageCount,Math.max(1,Number.isSafeInteger(requestedPage)?requestedPage:1));
    const result = await db.from('prayers').select(columns).order('updated_at',{ascending:false}).order('id',{ascending:false}).range((page-1)*PAGE_SIZE,page*PAGE_SIZE-1);
    if(result.error) throw Error();
    return {items:result.data as Prayer[],total,page,pageCount};
  } catch {throw new CmsError('DATABASE_UNAVAILABLE','기도문 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');}
}
export async function getPrayer(id:string):Promise<Prayer|null> {
  if(!isPrayerId(id)) return null;
  const db = getPrayerClient();
  try {
    const result = await db.from('prayers').select(columns).eq('id',id).maybeSingle();
    if(result.error) throw Error();
    return result.data as Prayer|null;
  } catch {throw new CmsError('DATABASE_UNAVAILABLE','기도문을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');}
}
export function safeImagePath(id:string,path:string) { return isPrayerId(id) && new RegExp(`^prayers/${id}/[0-9a-f-]{36}\\.(jpg|jpeg|png|webp)$`).test(path); }
