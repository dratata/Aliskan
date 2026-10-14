import type {HabitId} from '../domain/types';
export type ModuleOptions={timerId?:string;mode?:'break'};
export type OpenModule=(id:string,habit?:HabitId,options?:ModuleOptions)=>void;
