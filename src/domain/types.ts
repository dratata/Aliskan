import {z} from 'zod';
import {sleepMinutes} from './dates';
export const timeSchema=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const dateSchema=z.iso.date();
export const habitIds=['study','exerciseLunch','exerciseEvening','smoking','nutrition','water','night','family','morning'] as const;
export type HabitId=typeof habitIds[number];
export const eventTypes=['study','exercise','smoking','water','weight','meal','snack','sleep','breathing','family','routine','mood'] as const;
export const habitSchema=z.object({id:z.enum(habitIds),title:z.string(),active:z.boolean(),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),target:z.number().positive().max(10000),initial:z.number().positive(),max:z.number().positive(),unit:z.string(),days:z.array(z.number().int().min(0).max(6)),remind:z.boolean(),level:z.number().int().min(0)}).refine(h=>h.target<=h.max&&h.initial<=h.max,'Hedef sınırı').refine(h=>h.max<=({study:120,exerciseLunch:15,exerciseEvening:45,smoking:10,nutrition:1,water:10000,night:1,family:60,morning:30}[h.id]),'Modül sınırı');
export const eventSchema=z.object({id:z.string().min(1),type:z.enum(eventTypes),date:dateSchema,at:z.string().datetime({offset:true}),value:z.number().finite().min(0).max(100000),source:z.enum(['manual','voice','text']),data:z.record(z.string(),z.union([z.string(),z.number().finite(),z.boolean(),z.array(z.string())])).default({})}).superRefine((e,ctx)=>{
 const limits:Partial<Record<typeof eventTypes[number],number>>={study:240,exercise:120,smoking:100,water:10000,weight:400,sleep:1080,breathing:60,family:180,mood:10,routine:60};
 if(e.value>(limits[e.type]??10000)||(e.type==='weight'&&e.value<20))ctx.addIssue({code:'custom',message:'Kayıt miktarı sınır dışında',path:['value']});
 if(e.type==='sleep'){const a=timeSchema.safeParse(e.data.asleep),b=timeSchema.safeParse(e.data.wake);if(!a.success||!b.success||sleepMinutes(a.data,b.data)!==e.value||e.value<=0)ctx.addIssue({code:'custom',message:'Uyku saati/süre uyumsuz',path:['data']})}
 for(const k of ['effort','urge','stress','energy','stressBefore','stressAfter','hunger','fullness'])if(typeof e.data[k]==='number'&&(e.data[k]<0||e.data[k]>10))ctx.addIssue({code:'custom',message:'Puan 0–10 arasında olmalı',path:['data',k]});
});
export const taskStateSchema=z.object({id:z.string(),date:dateSchema,habitId:z.enum(habitIds),status:z.enum(['done','skipped','snoozed']),derived:z.boolean().optional(),target:z.number().positive().max(10000).optional(),time:timeSchema.optional()});
export const timerSchema=z.object({id:z.string(),habitId:z.enum(habitIds).optional(),kind:z.enum(['study','breathing','delay','exercise','routine']),total:z.number().positive(),remaining:z.number().min(0),deadline:z.number().nullable(),running:z.boolean(),saved:z.boolean(),topic:z.string(),date:dateSchema,context:z.string().default('')}).refine(t=>t.remaining<=t.total&&(!t.running||(t.deadline!==null&&!t.saved)), 'Tutarsız zamanlayıcı');
export const stateSchema=z.object({
 version:z.literal(1),onboarded:z.boolean(),profile:z.object({name:z.string(),age:z.number().min(0).max(120).nullable(),height:z.number().min(0).max(250).nullable(),weight:z.number().min(0).max(400).nullable(),goalWeight:z.number().min(0).max(400).nullable(),occupation:z.string(),childAge:z.number().min(0).max(18).nullable(),exerciseHistory:z.string(),pain:z.string(),restrictions:z.string(),equipment:z.string(),diet:z.string(),medical:z.string(),childAwakeStart:timeSchema,childAwakeEnd:timeSchema,bedtime:timeSchema}),
 habits:z.array(habitSchema).refine(h=>h.length===habitIds.length&&new Set(h.map(i=>i.id)).size===habitIds.length,'Eksik veya tekrarlanan alışkanlık'),events:z.array(eventSchema).refine(e=>new Set(e.map(x=>x.id)).size===e.length,'Tekrarlanan kayıt'),taskStates:z.array(taskStateSchema),timer:timerSchema.nullable(),timerArchive:z.array(timerSchema).default([]),guideProgress:z.record(z.string(),z.number().int().min(0)).default({}),acceptedProposals:z.array(z.string()).default([]),suggestedActivities:z.array(z.string()).default([]),
 settings:z.object({theme:z.enum(['light','dark','system']),notifications:z.boolean(),quietStart:timeSchema,quietEnd:timeSchema,sound:z.boolean(),waterGoal:z.number().positive().max(10000),weeklyStudyGoal:z.number().min(0).max(10000),reminderLimit:z.number().int().min(0).max(20).default(3),smokingBaseline:z.number().min(0).max(100).nullable().default(null),smokingGoal:z.number().min(0).max(100).nullable().default(null)}),
 nightSteps:z.array(z.object({id:z.string(),title:z.string(),time:timeSchema,minutes:z.number().positive(),kind:z.enum(['routine','breathing','exercise'])})).min(1),rejectedProposals:z.array(z.string()),
});
export type AppState=z.infer<typeof stateSchema>;
export type Habit=z.infer<typeof habitSchema>;
export type HabitEvent=z.infer<typeof eventSchema>;
export type TimerState=z.infer<typeof timerSchema>;
export type Task={id:string;habitId:HabitId;date:string;title:string;time:string;target:number;unit:string;status:'pending'|'done'|'skipped'|'snoozed'};
export type Proposal={id:string;habitId:HabitId;target:number;level:number;reason:string;direction:'up'|'down'};
export type EntryDraft={type:HabitEvent['type'];value:number;date:string;data:HabitEvent['data'];needsConfirmation:boolean;message:string};
