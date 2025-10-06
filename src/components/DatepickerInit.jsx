"use client"
import { useEffect } from 'react'

export default function DatepickerInit(){
  useEffect(()=>{
    // Guard for jQuery + datetimepicker
    if(typeof window !== 'undefined' && window.jQuery){
      const $ = window.jQuery
      if(typeof $.fn.datetimepicker === 'function'){
        $('.datetimepicker').each(function(){
          try{ $(this).datetimepicker() }catch(e){ console.warn('datetimepicker init failed', e) }
        })
      } else {
        console.warn('datetimepicker plugin not available on jQuery')
      }
    }
  },[])

  return null
}
