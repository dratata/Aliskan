export function localDate(date=new Date()):string {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export function shiftDate(date:string,days:number):string {const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+days);return localDate(d)}
export function clockMinutes(time:string):number {const [h,m]=time.split(':').map(Number);return h*60+m}
export function sleepMinutes(start:string,end:string):number {let v=clockMinutes(end)-clockMinutes(start);if(v<0)v+=1440;return v}
export function formatTime(at:string):string {return new Date(at).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}
export function dateLabel(date:string):string {return new Date(date+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'})}
export function inTimeWindow(time:string,start:string,end:string):boolean {const t=clockMinutes(time),a=clockMinutes(start),b=clockMinutes(end);if(a===b)return false;return a<b?t>=a&&t<b:t>=a||t<b}
