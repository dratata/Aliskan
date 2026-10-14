import {describe,it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import {exerciseGuides,familyGuide,dailyGuides,guideCoach} from '../src/content/guides';
import {videoSources} from '../src/content/videos';
import {activities} from '../src/content/activities';
import {exercises} from '../src/content/exercises';
import {createInitialState} from '../src/domain/defaults';
describe('gösteren rehberler',()=>{
 it('her hareket için 3 görsel aşama, teknik kontrol ve gerçek kaynak sunar',()=>{for(const e of exercises){const g=exerciseGuides[e.id];expect(g.frames).toHaveLength(3);expect(existsSync(`public${g.image}`)).toBe(true);expect(g.checks.length).toBeGreaterThanOrEqual(2);expect(videoSources[g.videoId!].verifiedOn).toBe('2026-10-14')}});
 it('60 oyunun kendine özgü malzemesi, örnek ebeveyn cümlesi ve görsel sahnesi vardır',()=>{const ids=new Set<string>();for(const a of activities){const g=familyGuide(a);expect(g.frames).toHaveLength(3);expect(g.frames.every(f=>f.prompt&&f.instruction)).toBe(true);expect(g.sceneId).toBe(a.id);ids.add(g.sceneId!);expect(g.materials).toBe(a.materials)}expect(ids.size).toBe(60)});
 it('kaynak bağlantıları HTTPS ve hedef-video bilgileri doğrulanmıştır',()=>{for(const v of Object.values(videoSources)){expect(new URL(v.url).protocol).toBe('https:');expect(v.evidence.length).toBeGreaterThan(20);expect(v.originalTitle).toBeTruthy();expect(v.language).toBeTruthy();expect(v.scope).toMatch(/technique|related/)}expect(videoSources.chair.url).toContain('#1763916272001')});
 it('nefes, odak, erteleme ve her rutin adımı uygulanış rehberine sahiptir',()=>{for(const id of ['breathing','study','delay','phone','teeth','stretch','breath','book','ready','wake','water','move','light','plan','nutrition'])expect(dailyGuides[id].frames.length).toBeGreaterThanOrEqual(3)});
 it('kişisel motivasyon var olmayan başarılardan söz etmez',()=>{const s=createInitialState();expect(guideCoach(s,'study')).not.toMatch(/Dün .*tamamladın/);s.events=[{id:'s',type:'study',date:'2026-10-14',at:'2026-10-14T10:00:00Z',value:10,source:'manual',data:{}}];expect(guideCoach(s,'study')).toContain('10 dakika')});
});
import {exerciseProgram} from '../src/content/exercises';
it('esneme taraf süreleri ayrılan hareket süresini aşmaz',()=>{for(const minutes of [5,15,45]){const moves=exerciseProgram(minutes).filter(e=>e.id==='stretch');for(const move of moves){const side=Number(move.reps.match(/\d+/)?.[0]);expect(side*2).toBeLessThanOrEqual(move.seconds);expect(move.steps.join(' ')).toContain(`${side} saniye sonra`)}}});
