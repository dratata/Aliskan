import type {AppState,HabitEvent} from './types';
export function remainingSeconds(deadline:number,now:number):number{return Math.max(0,Math.ceil((deadline-now)/1000))}
export function completeSession(state:AppState,event:HabitEvent):AppState{return state.events.some(e=>e.id===event.id)?state:{...state,events:[...state.events,event]}}
