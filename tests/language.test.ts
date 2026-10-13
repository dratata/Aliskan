import {describe,it,expect} from 'vitest';
import {parseEntry,confirmDraft} from '../src/domain/language';
import {summarize,chartData} from '../src/domain/analytics';
import {createInitialState} from '../src/domain/defaults';
const now=new Date(2026,9,14,12);
describe('Türkçe giriş',()=>{
 it('ders süresini ve onay gereğini ayrıştırır',()=>{const d=parseEntry('Bugün 20 dakika ders çalıştım.',now);expect(d?.type).toBe('study');expect(d?.value).toBe(20);expect(d?.date).toBe('2026-10-14');expect(d?.needsConfirmation).toBe(true)});
 it('sigara günlük toplamını çoğaltmaz',()=>{const s=createInitialState(),d=parseEntry('Bugün 6 sigara içtim.',now)!;const e=confirmDraft(d,s,'text',now);expect(e.value).toBe(6);s.events=[e];expect(confirmDraft(d,s,'text',now).value).toBe(0)});
 it('dün gece birde ve sabah sekiz ifadesini doğrulamalı yorumlar',()=>{const d=parseEntry('Dün gece birde yattım, sabah sekizde kalktım.',now);expect(d?.type).toBe('sleep');expect(d?.value).toBe(420);expect(d?.data.asleep).toBe('01:00');expect(d?.needsConfirmation).toBe(true)});
 it('egzersiz ve oyun kaydını tanır',()=>{expect(parseEntry('Akşam egzersizimi yaptım.',now)?.data.habitId).toBe('exerciseEvening');expect(parseEntry('Bugün kızımla 15 dakika oyun oynadık.',now)?.value).toBe(15)});
 it('belirsiz veya tehlikeli miktarı kaydetmez',()=>{expect(parseEntry('Bir ara çalıştım',now)).toBe(null);expect(parseEntry('Bugün 9000 dakika ders çalıştım',now)).toBe(null)});
});
describe('gerçek analiz',()=>{
 it('kayıtsız günü bilinmiyor olarak gösterir',()=>{const s=createInitialState();expect(chartData(s,'2026-10-14',7)[0].study).toBe(null);expect(summarize(s,'2026-10-08','2026-10-14').studyDays).toBe(0)});
 it('gerçek net süreleri toplar',()=>{const s=createInitialState();s.events=[{id:'1',type:'study',date:'2026-10-14',at:now.toISOString(),value:20,source:'text',data:{}}];expect(summarize(s,'2026-10-08','2026-10-14').studyMinutes).toBe(20);expect(chartData(s,'2026-10-14',7).at(-1)?.study).toBe(20)});
});
