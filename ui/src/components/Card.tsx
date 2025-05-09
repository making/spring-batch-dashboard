import React from 'react'

interface CardProps {
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', footer }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}
