import React from 'react'
import { format, parseISO } from 'date-fns'

interface DateTimeProps {
  date: string
  format?: string
  className?: string
}

export const DateTime: React.FC<DateTimeProps> = ({ 
  date, 
  format: formatStr = 'yyyy-MM-dd HH:mm:ss',
  className = ''
}) => {
  if (!date) return null

  try {
    const parsedDate = parseISO(date)
    return (
      <span className={className} title={date}>
        {format(parsedDate, formatStr)}
      </span>
    )
  } catch {
    console.error('Invalid date format:', date)
    return <span className={className}>{date}</span>
  }
}
