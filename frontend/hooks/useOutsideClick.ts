import { useEffect, useRef } from "react";

export function  useOutSidClick<T extends HTMLElement> 
(callback: () => void){
<<<<<<< HEAD
    const ref = useRef<T | null>(null);
=======
    const ref =useRef<T>(null);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

    useEffect(() =>{
        const handleClickOutside =(e:MouseEvent)=>{
            if(ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return ()=>{
        document.removeEventListener('mousedown',handleClickOutside);
        }
    },[callback]);

    return ref;
}