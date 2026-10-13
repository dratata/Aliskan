import {describe,it,expect} from 'vitest';
import {createInitialState} from '../src/domain/defaults';
import {dailyTasks,completeTask} from '../src/domain/tasks';
import {localDate,sleepMinutes} from '../src/domain/dates';
import {validateBackup,mergeStates} from '../src/data/backup';
import {loadState,saveState} from '../src/data/database';
import 'fake-indexeddb/auto';
describe('kalıcı temel',()=>{
 it('sabah pasiftir ve ilk çalışma 10 dakikadır',()=>{const s=createInitialState();expect(s.habits.find(h=>h.id==='morning')?.active).toBe(false);expect(dailyTasks(s,'2026-10-13').some(t=>t.habitId==='morning')).toBe(false);expect(s.habits.find(h=>h.id==='study')?.target).toBe(10)});
 it('tamamlama bir kez ve kalıcı yazılır',async()=>{let s=createInitialState();const t=dailyTasks(s,localDate())[0];s=completeTask(s,t,'done');s=completeTask(s,t,'done');expect(s.taskStates.length).toBe(1);await saveState(s);expect((await loadState()).taskStates).toEqual(s.taskStates)});
 it('yerel tarihi kullanır ve gece aşan uyku pozitif hesaplanır',()=>{expect(localDate(new Date(2026,9,13,23,45))).toBe('2026-10-13');expect(sleepMinutes('01:00','08:00')).toBe(420);expect(sleepMinutes('23:30','07:30')).toBe(480)});
 it('bozuk ve gelecek sürüm yedeğini reddeder',()=>{expect(()=>validateBackup({version:99})).toThrow();expect(()=>validateBackup({...createInitialState(),events:[{type:'unknown'}]})).toThrow();expect(validateBackup(createInitialState()).version).toBe(1)});
 it('yedek birleştirme aynı olayı çoğaltmaz',()=>{const s=createInitialState();expect(mergeStates(s,s).habits.length).toBe(s.habits.length)});
});
