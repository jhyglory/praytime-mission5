/* eslint-disable @next/next/no-img-element -- Original decorative Figma assets retain intrinsic SVG bounds; below-fold cards are not LCP imagery. */
// Six reusable decorative card templates from Figma1265:8239–8244.
// Exact scaled child geometry supplements the design-context component output.
// No app actions or user data; the send mark follows the current user override.

import Image from "next/image";
import { PaperPlaneIcon } from "./paper-plane-icon";

function PhotoCard({ images = [] }: { images?: string[] }) {
  return <div className="ambient-card" style={{height:252.14116}}>
    <div style={{"left":12.1,"top":12.1,"width":196.70587,"height":13}}>
      <div style={{"left":0,"top":0.67647,"width":11.64706,"height":11.64706}}>
        <img src="/assets/card-intro/9ea18c6f-99b9-4f41-ad7d-b568a12aa7ab.svg" alt="" style={{}} />
      </div>
      <p style={{"left":17.47059,"top":0,"width":155.29411,"height":13,"opacity":0.92,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"Instagram"}</p>
    </div>
    <div style={{"left":12.1,"top":34.15882,"width":196.70587,"height":161.76469,"borderRadius":9.05882}}>
      <Image src={images[0] ?? "/assets/card-intro/8b7f22c3-e82d-4b7c-b363-071c884e5b13.png"} alt="" className="ambient-card__photo" width={197} height={208} sizes="197px" style={{"width":196.70587,"height":161.76469,"borderRadius":9.05882}} />
    </div>
    <div style={{"left":12.1,"top":204.98233,"width":196.70587,"height":13}}>
      <div style={{"left":0,"top":1.0,"width":11.0,"height":11.0}}>
        <img src="/assets/card-intro/97d1a04d-f0d6-4e14-8d2b-91863e137558.svg" alt="" style={{"left":0.15983,"top":0.82416}} />
      </div>
      <div style={{"left":20.05882,"top":1.0,"width":11.0,"height":11.0}}>
        <PaperPlaneIcon />
      </div>
      <p style={{"left":40.11765,"top":0,"width":77.64706,"height":13,"opacity":0.52,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"1,284"}</p>
    </div>
    <p style={{"left":12.1,"top":227.04115,"width":196.70587,"height":13,"opacity":0.7,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"daily.archive · 오늘의 작은 기록"}</p>
  </div>;
}

function VideoCard({ images = [] }: { images?: string[] }) {
  return <div className="ambient-card" style={{height:201.61176}}>
    <div style={{"left":12.1,"top":12.1,"width":196.70587,"height":13.58823}}>
      <div style={{"left":0,"top":0,"width":13.58823,"height":13.58823}}>
        <img src="/assets/card-intro/e968c918-9d82-4673-9d03-291ac4074af2.svg" alt="" style={{}} />
      </div>
      <p style={{"left":19.41176,"top":0.29412,"width":155.29411,"height":13,"opacity":0.92,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"YouTube"}</p>
    </div>
    <div style={{"left":12.1,"top":34.74706,"width":196.70587,"height":110.64705,"borderRadius":9.05882}}>
      <Image src={images[0] ?? "/assets/card-intro/757c185d-bdaa-48f9-83dd-767276756001.png"} alt="" className="ambient-card__photo" width={197} height={208} sizes="197px" style={{"width":196.70587,"height":110.64705,"borderRadius":9.05882}} />
      <div style={{"left":88.64706,"top":45.29411,"width":19.41176,"height":19.41176}}>
        <img src="/assets/card-intro/66d8d4ec-5256-424c-a56b-8079b3096e0f.svg" alt="" style={{}} />
      </div>
      <p style={{"left":163.05881,"top":91.88235,"width":24.58823,"height":13,"opacity":0.85,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"08:42"}</p>
      <div style={{"left":0,"top":109.35294,"width":196.70587,"height":1.29412,"background":"#f1f1ee"}}>

      </div>
      <div style={{"left":0,"top":109.35294,"width":67.29411,"height":1.29412,"background":"#ff4438"}}>

      </div>
    </div>
    <div style={{"left":12.1,"top":154.45293,"width":196.70587,"height":13}}>
      <div style={{"left":0,"top":1.0,"width":11.0,"height":11.0}}>
        <img src="/assets/card-intro/da127568-2f66-41be-af26-f9753a28ddb5.svg" alt="" style={{"left":0.15983,"top":0.82416}} />
      </div>
      <div style={{"left":20.05882,"top":1.0,"width":11.0,"height":11.0}}>
        <PaperPlaneIcon />
      </div>
      <p style={{"left":40.11765,"top":0,"width":77.64706,"height":13,"opacity":0.52,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"공유"}</p>
    </div>
    <p style={{"left":12.1,"top":176.51175,"width":196.70587,"height":13,"opacity":0.7,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"조용한 하루를 기록하는 방법"}</p>
  </div>;
}

function TextCard() {
  return <div className="ambient-card" style={{height:124.37646}}>
    <div style={{"left":12.1,"top":12.1,"width":196.70587,"height":13}}>
      <p style={{"left":0,"top":0,"width":12.94118,"height":13,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"@"}</p>
      <p style={{"left":18.76471,"top":0,"width":155.29411,"height":13,"opacity":0.92,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"Threads"}</p>
    </div>
    <p style={{"left":12.1,"top":34.15882,"width":196.70587,"height":13,"opacity":0.5,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"slow.notes · 2분"}</p>
    <p style={{"left":12.1,"top":56.21764,"width":196.70587,"height":34,"opacity":0.9,"fontSize":10.35294,"lineHeight":"16.82353px","fontWeight":400}}>{"잠깐 보려고 열었는데,\n어느새 다음 이야기를 읽고 있다."}</p>
    <div style={{"left":12.1,"top":99.27647,"width":196.70587,"height":13}}>
      <div style={{"left":0,"top":0,"width":11.0,"height":11.0}}>
        <img src="/assets/card-intro/da127568-2f66-41be-af26-f9753a28ddb5.svg" alt="" style={{"left":0.15983,"top":0.82416}} />
      </div>
      <div style={{"left":20.05882,"top":0,"width":11.0,"height":11.0}}>
        <PaperPlaneIcon />
      </div>
      <p style={{"left":40.11765,"top":0,"width":109.99999,"height":13,"opacity":0.4,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"24개의 답글"}</p>
    </div>
  </div>;
}

function ChatCard() {
  return <div className="ambient-card" style={{height:127.84705}}>
    <div style={{"left":12.1,"top":12.1,"width":196.70587,"height":13}}>
      <div style={{"left":0,"top":0.35294,"width":12.29412,"height":12.29412}}>
        <img src="/assets/card-intro/2f41d994-dc14-4ac5-a48a-9da0a6b33cf8.svg" alt="" style={{}} />
      </div>
      <p style={{"left":18.11765,"top":0,"width":155.29411,"height":13,"opacity":0.92,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"KakaoTalk"}</p>
    </div>
    <div style={{"left":12.1,"top":34.15882,"width":196.70587,"height":59.52941}}>
      <div style={{"left":0,"top":0,"width":138.47058,"height":25.94118,"borderRadius":3.88235}}>
        <div style={{"left":0,"top":0,"width":138.47058,"height":25.88235,"opacity":0.07,"borderRadius":3.88235,"background":"#f1f1ee"}}>

        </div>
        <p style={{"left":7.76471,"top":6.47059,"width":122.94117,"height":13,"opacity":0.8,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"이거 봤어요?"}</p>
      </div>
      <div style={{"left":47.88235,"top":33.64706,"width":148.82352,"height":25.94118,"borderRadius":3.88235}}>
        <div style={{"left":0,"top":0,"width":148.82352,"height":25.88235,"opacity":0.12,"borderRadius":3.88235,"background":"#f1f1ee"}}>

        </div>
        <p style={{"left":7.76471,"top":6.47059,"width":133.29411,"height":13,"opacity":0.8,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"잠깐만 볼게요."}</p>
      </div>
    </div>
    <p style={{"left":12.1,"top":102.74705,"width":196.70587,"height":13,"opacity":0.32,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"오후 9:41"}</p>
  </div>;
}

function CollectionCard({ images = [] }: { images?: string[] }) {
  return <div className="ambient-card" style={{height:284.55292}}>
    <div style={{"left":12.1,"top":13.39412,"width":196.70587,"height":13}}>
      <div style={{"left":0,"top":0.67647,"width":11.64706,"height":11.64706}}>
        <img src="/assets/card-intro/8abadb49-444e-4041-9b2c-5725185a66df.svg" alt="" style={{}} />
      </div>
      <p style={{"left":17.47059,"top":0,"width":155.29411,"height":13,"opacity":0.92,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"Instagram"}</p>
    </div>
    <p style={{"left":12.1,"top":36.74706,"width":196.70587,"height":17,"fontSize":10.35294,"lineHeight":"16.82353px","fontWeight":400}}>{"저장한 순간들"}</p>
    <div style={{"left":12.1,"top":64.09999,"width":196.70587,"height":207.05881}}>
      <div style={{"left":0,"top":0,"width":94.47058,"height":207.05881}}>
        <div style={{"left":0,"top":0,"width":94.47058,"height":81.5294,"borderRadius":9.05882}}>
          <Image src={images[0] ?? "/assets/card-intro/e34cd715-4b0f-48aa-8bb5-7fdb31f3947b.png"} alt="" className="ambient-card__photo" width={197} height={208} sizes="197px" style={{"width":94.47058,"height":81.5294,"borderRadius":9.05882}} />
        </div>
        <div style={{"left":0,"top":89.29411,"width":94.47058,"height":117.7647,"borderRadius":9.05882}}>
          <Image src={images[2] ?? "/assets/card-intro/da485400-59bb-4b95-9046-793cfca2721b.png"} alt="" className="ambient-card__photo" width={197} height={208} sizes="197px" style={{"width":94.47058,"height":117.7647,"borderRadius":9.05882}} />
        </div>
      </div>
      <div style={{"left":102.23529,"top":0,"width":94.47058,"height":152.76469}}>
        <div style={{"left":0,"top":0,"width":94.47058,"height":131.99998,"borderRadius":9.05882}}>
          <Image src={images[1] ?? "/assets/card-intro/5d584a66-37b7-4294-85a6-64760bd4fd58.png"} alt="" className="ambient-card__photo" width={197} height={208} sizes="197px" style={{"width":94.47058,"height":131.99998,"borderRadius":9.05882}} />
        </div>
        <p style={{"left":0,"top":139.76469,"width":94.47058,"height":13,"opacity":0.55,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"+16개의 저장된 순간"}</p>
      </div>
    </div>
  </div>;
}

function NotificationCard() {
  return <div className="ambient-card" style={{height:91.08235}}>
    <div style={{"left":12.1,"top":13.39412,"width":196.70587,"height":13.58823}}>
      <div style={{"left":0,"top":0,"width":13.58823,"height":13.58823}}>
        <img src="/assets/card-intro/fa5652f0-d224-4e8b-a7e9-d9b8eebec3c1.svg" alt="" style={{}} />
      </div>
      <p style={{"left":19.41176,"top":0.29412,"width":155.29411,"height":13,"opacity":0.92,"fontSize":9.05882,"lineHeight":"12.94118px","fontWeight":500}}>{"YouTube"}</p>
    </div>
    <p style={{"left":12.1,"top":37.33529,"width":196.70587,"height":17,"fontSize":10.35294,"lineHeight":"16.82353px","fontWeight":400}}>{"새 영상이 도착했어요."}</p>
    <p style={{"left":12.1,"top":64.68823,"width":196.70587,"height":13,"opacity":0.52,"fontSize":7.76471,"lineHeight":"12.94118px","fontWeight":400}}>{"구독 중인 채널 · 방금"}</p>
  </div>;
}

const cardTypes = [PhotoCard, VideoCard, TextCard, ChatCard, CollectionCard, NotificationCard];

export function AmbientCard({ kind, images, scale = 1, height }: { kind: number; images: string[]; scale?: number; height: number }) {
  const Card = cardTypes[kind];
  return <div className="ambient-card-scale" style={{ transform:"scale(" + scale + ")", height:height / scale }}><Card images={images} /></div>;
}
