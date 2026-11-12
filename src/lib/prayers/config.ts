import 'server-only';
import { createClient } from '@supabase/supabase-js';

export class CmsError extends Error {
  constructor(public code: string, message: string, public status = 503) { super(message); this.name = 'CmsError'; }
}
export const PRAYER_BUCKET = 'prayer-covers';
export const DEMO_PROJECT_REF = 'cibcyeyznfmywacfiokh';
export function getPrayerClient() {
  const url = process.env.SUPABASE_URL;
  const ref = process.env.PRAYER_CMS_PROJECT_REF || DEMO_PROJECT_REF;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.PRAYER_CMS_ENABLED !== 'true' || process.env.VERCEL_ENV === 'production' || !url || !key || !/^[a-z]{20}$/.test(ref) || ref === 'yxiubxjpapiacvhbkxvd' || url !== `https://${ref}.supabase.co`) {
    throw new CmsError('CONFIGURATION_REQUIRED', '기도문 관리용 DB 연결 설정이 필요합니다. 과제용 환경변수를 확인해 주세요.');
  }
  if (!key.startsWith('sb_secret_')) {
    try { if (JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role !== 'service_role') throw Error(); }
    catch { throw new CmsError('CONFIGURATION_REQUIRED', '과제용 서버 비밀 키 설정을 확인해 주세요.'); }
  }
  return createClient(url, key, {
    auth: {persistSession:false, autoRefreshToken:false, detectSessionInUrl:false},
    global: {fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if(key.startsWith('sb_secret_') && headers.get('authorization') === `Bearer ${key}`) headers.delete('authorization');
      headers.set('apikey',key);
      return fetch(input,{...init,headers,cache:'no-store',signal:AbortSignal.timeout(15000)});
    }},
  });
}
