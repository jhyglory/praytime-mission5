import 'server-only';
import { randomUUID } from 'node:crypto';
import { getPrayerClient, CmsError, PRAYER_BUCKET } from './config';
import { getPrayer, safeImagePath } from './store';
import type { PrayerInput } from './model';
import type { validatePrayerImage } from './image';
type Image = Awaited<ReturnType<typeof validatePrayerImage>>;

async function cleanup(id:string,path:string) {
  if(!safeImagePath(id,path)) { console.error('PRAYER_IMAGE_CLEANUP_REJECTED',{id}); return false; }
  try {const result=await getPrayerClient().storage.from(PRAYER_BUCKET).remove([path]);if(result.error) throw Error();return true;}
  catch {console.error('PRAYER_IMAGE_CLEANUP_REQUIRED',{id,path});return false;}
}
export async function savePrayer(input:PrayerInput, image:Image|null, action:'keep'|'replace'|'remove', existingId?:string) {
  const db=getPrayerClient();
  const existing=existingId?await getPrayer(existingId):null;
  if(existingId&&!existing) throw new CmsError('NOT_FOUND','이미 삭제되었거나 존재하지 않는 기도문입니다.',404);
  const id=existing?.id||randomUUID();let newPath:string|null=null;
  if(image) {
    newPath=`prayers/${id}/${randomUUID()}.${image.extension}`;
    try {const upload=await db.storage.from(PRAYER_BUCKET).upload(newPath,image.bytes,{contentType:image.mime,upsert:false});if(upload.error) throw Error();}
    catch {await cleanup(id,newPath);throw new CmsError('UPLOAD_FAILED','이미지를 업로드하지 못했습니다. 기존 내용은 유지됩니다. 다시 시도해 주세요.',502);}
  }
  const imagePath = newPath || (action==='remove'?null:existing?.image_path||null);
  try {
    const payload={...input,image_path:imagePath};
    const result=existing?await db.from('prayers').update(payload).eq('id',id).eq('updated_at',existing.updated_at).select('id').maybeSingle():await db.from('prayers').insert({id,...payload}).select('id').single();
    if(result.error) throw Error();
    if(!result.data) throw new CmsError('CONFLICT','다른 요청에서 기도문이 변경되었습니다. 새로고침 후 다시 시도해 주세요.',409);
  } catch(error) {
    if(newPath) await cleanup(id,newPath);
    if(error instanceof CmsError) throw error;
    throw new CmsError('SAVE_FAILED','기도문을 저장하지 못했습니다. 입력을 유지한 채 다시 시도해 주세요.',502);
  }
  let warning:string|undefined;
  if(existing?.image_path&&existing.image_path!==imagePath&&!await cleanup(id,existing.image_path)) warning='기도문은 저장되었지만 이전 이미지 정리가 필요합니다.';
  return {id,...(warning?{warning}:{})};
}
export async function deletePrayer(id:string) {
  const existing=await getPrayer(id);
  if(!existing) throw new CmsError('NOT_FOUND','이미 삭제되었거나 존재하지 않는 기도문입니다.',404);
  const db=getPrayerClient();
  try {
    const deleted=await db.from('prayers').delete().eq('id',id).eq('updated_at',existing.updated_at).select('id').maybeSingle();
    if(deleted.error) throw Error();
    if(!deleted.data) throw new CmsError('CONFLICT','기도문이 변경되었습니다. 새로고침 후 다시 확인해 주세요.',409);
  } catch(error) {if(error instanceof CmsError)throw error;throw new CmsError('DELETE_FAILED','기도문을 삭제하지 못했습니다. 다시 시도해 주세요.',502);}
  const warning=existing.image_path&&!await cleanup(id,existing.image_path)?'기도문은 삭제되었지만 이미지 파일 정리가 필요합니다.':undefined;
  return {id,...(warning?{warning}:{})};
}
