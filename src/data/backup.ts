import {stateSchema,type AppState} from '../domain/types';
export function validateBackup(value:unknown):AppState {return stateSchema.parse(value)}
export function mergeStates(current:AppState,incoming:AppState):AppState {const uniq=<T extends {id:string}>(a:T[],b:T[])=>Array.from(new Map([...a,...b].map(x=>[x.id,x])).values());return {...current,events:uniq(current.events,incoming.events),taskStates:uniq(current.taskStates,incoming.taskStates)}}
export function downloadBackup(state:AppState):void {const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`aliskan-yedek-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
