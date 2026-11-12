import 'server-only';
import sharp from 'sharp';
export const MAX_PRAYER_IMAGE_BYTES = 2_097_152;
export async function validatePrayerImage(file:File):Promise<{bytes:Uint8Array;mime:string;extension:'jpg'|'png'|'webp'}> {
  if(!file.size || file.size>MAX_PRAYER_IMAGE_BYTES) throw new Error('이미지는 0바이트보다 크고 2 MiB 이하여야 합니다.');
  const suffix=file.name.split('.').pop()?.toLowerCase();
  const formats:Record<string,{mime:string;extension:'jpg'|'png'|'webp'}> = {jpeg:{mime:'image/jpeg',extension:'jpg'},png:{mime:'image/png',extension:'png'},webp:{mime:'image/webp',extension:'webp'}};
  if(!['jpg','jpeg','png','webp'].includes(suffix||'')) throw new Error('JPEG, PNG, WebP 이미지만 선택해 주세요.');
  const bytes=new Uint8Array(await file.arrayBuffer());
  try {
    const image=sharp(bytes,{limitInputPixels:25_000_000,failOn:'warning'});
    const meta=await image.metadata();
    const format=formats[meta.format||''];
    if(!format || file.type!==format.mime || (suffix==='jpg'?'jpeg':suffix)!==meta.format || (meta.pages||1)>1) throw Error();
    await image.raw().toBuffer(); // decode the complete image, not just the header
    return {bytes,...format};
  } catch {throw new Error('파일 확장자·형식이 일치하는 정상 JPEG, PNG, WebP 이미지를 선택해 주세요.');}
}
