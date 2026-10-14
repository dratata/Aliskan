import {Sparkles} from 'lucide-react';
import {useStore} from '../app/Store';
import {guideCoach} from '../content/guides';
export function GuideCoach({module}:{module:string}){const {state}=useStore();return <div className="guide-coach"><Sparkles size={18}/><div><span className="eyebrow">KENDİ HIZINDA</span><p>{guideCoach(state,module)}</p></div></div>}
