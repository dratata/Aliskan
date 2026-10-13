import {it,expect} from 'vitest';
import {activities,selectActivity} from '../src/content/activities';
import {createInitialState} from '../src/domain/defaults';
import {localDate} from '../src/domain/dates';
it('60 özgün ve eksiksiz güvenli etkinlik vardır',()=>{expect(activities.length).toBeGreaterThanOrEqual(60);expect(new Set(activities.map(a=>a.name)).size).toBe(activities.length);expect(new Set(activities.map(a=>a.category)).size).toBe(10);for(const a of activities){expect(a.steps.length).toBeGreaterThanOrEqual(3);expect(a.safety.length).toBeGreaterThan(20);expect(a.easier.length).toBeGreaterThan(5);expect(a.harder.length).toBeGreaterThan(5);expect(a.minutes).toBeLessThanOrEqual(15)}});
it('yakın zamanda yapılmış etkinliği tekrar önermez',()=>{const s=createInitialState(),a=selectActivity(activities,s,localDate());s.events=[{id:'f',type:'family',date:localDate(),at:new Date().toISOString(),value:10,source:'manual',data:{activityId:a.id,feedback:'loved'}}];expect(selectActivity(activities,s,localDate()).id).not.toBe(a.id)});
