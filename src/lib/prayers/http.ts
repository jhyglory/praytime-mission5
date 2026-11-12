import 'server-only';
import { PrayerInputSchema } from './model';
import { validatePrayerImage } from './image';
import { CmsError } from './config';
export function cmsResponse(body:unknown,status=200) {return Response.json(body,{status,headers:{'Cache-Control':'no-store'}});}
export function cmsFailure(error:unknown) {
  if(error instanceof CmsError) return cmsResponse({error:error.message,code:error.code},error.status);
  return cmsResponse({error:'요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.',code:'REQUEST_FAILED'},502);
}
export function checkWriteOrigin(request:Request) {
  const origin=request.headers.get('origin');
  try {
    if(request.headers.get('sec-fetch-site')==='cross-site') throw Error();
    if(origin) {
      const url=new URL(request.url),source=new URL(origin);
      if(source.host!==(request.headers.get('host')||url.host)||source.protocol!==url.protocol)throw Error();
    }
  } catch {throw new CmsError('ORIGIN_REJECTED','현재 사이트에서 다시 시도해 주세요.',403);}
}
export async function parsePrayerForm(request:Request) {
  const contentType=request.headers.get('content-type')||'';
  if(!contentType.startsWith('multipart/form-data;'))throw new CmsError('INVALID_CONTENT_TYPE','폼 형식을 확인해 주세요.',415);
  const limit=3*1024*1024;
  if(Number(request.headers.get('content-length'))>limit) throw new CmsError('REQUEST_TOO_LARGE','이미지는 2 MiB 이하로 선택해 주세요.',413);
  const reader=request.body?.getReader();if(!reader) throw new CmsError('INVALID_FORM','폼 입력을 확인해 주세요.',400);
  const chunks:Uint8Array[]=[];let length=0;
  while(true) {const chunk=await reader.read();if(chunk.done)break;length+=chunk.value.byteLength;if(length>limit){await reader.cancel();throw new CmsError('REQUEST_TOO_LARGE','요청이 너무 큽니다. 이미지는 2 MiB 이하로 선택해 주세요.',413);}chunks.push(chunk.value);}
  const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  let form:FormData;
  try {form=await new Response(bytes,{headers:{'Content-Type':contentType}}).formData();}
  catch {throw new CmsError('INVALID_FORM','폼 입력을 확인해 주세요.',400);}
  const raw=Object.fromEntries(Object.keys(PrayerInputSchema.shape).map(key=>[key,form.get(key)??(key==='language'?'ko':'')]));
  const parsed=PrayerInputSchema.safeParse(raw);
  if(!parsed.success) return {fields:Object.fromEntries(parsed.error.issues.map(issue=>[String(issue.path[0]),issue.message]))};
  const action=form.get('image_action')||'keep';
  if(!['keep','replace','remove'].includes(String(action)))return{fields:{image:'이미지 변경 방식을 확인해 주세요.'}};
  const upload=form.get('image');let image:Awaited<ReturnType<typeof validatePrayerImage>>|null=null;
  if(upload instanceof File && (upload.size>0 || upload.name)) {
    if(action!=='replace')return {fields:{image:'새 파일을 업로드하려면 이미지 교체를 선택해 주세요.'}};
    try {image=await validatePrayerImage(upload);}catch(error){return{fields:{image:(error as Error).message}};}
  }
  if(action==='replace'&&!image)return{fields:{image:'교체할 이미지를 선택해 주세요.'}};
  return{input:parsed.data,image,action:action as 'keep'|'replace'|'remove'};
}
