import {useEffect,useState} from 'react';
import {localDate} from '../domain/dates';
export function useLocalDay(){const [day,setDay]=useState(localDate);useEffect(()=>{const check=()=>setDay(localDate());const i=setInterval(check,1000);document.addEventListener('visibilitychange',check);window.addEventListener('focus',check);return()=>{clearInterval(i);document.removeEventListener('visibilitychange',check);window.removeEventListener('focus',check)}},[]);return day}
