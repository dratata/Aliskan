import {openDB} from 'idb';
import {stateSchema,type AppState} from '../domain/types';
import {createInitialState} from '../domain/defaults';
const db=()=>openDB('aliskan-local',1,{upgrade(database){database.createObjectStore('app')}});
export async function loadState():Promise<AppState>{const database=await db();const raw=await database.get('app','state');return raw===undefined?createInitialState():stateSchema.parse(raw)}
export async function saveState(state:AppState):Promise<void>{const parsed=stateSchema.parse(state);const database=await db();const tx=database.transaction('app','readwrite');await tx.store.put(parsed,'state');await tx.done}
