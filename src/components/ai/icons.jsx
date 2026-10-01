const Icon = ({ children, className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
)

export const SparkleIcon = props => (
  <Icon {...props}>
    <path d="M9.9 15.5A2 2 0 0 0 8.5 14.1l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6A2 2 0 0 0 9.9 8.5l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0Z" />
    <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
  </Icon>
)

export const CloseIcon = props => (
  <Icon {...props}><path d="M18 6 6 18M6 6l12 12" /></Icon>
)

export const PaperclipIcon = props => (
  <Icon {...props}><path d="m21.4 11.1-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8" /></Icon>
)

export const Spinner = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${className} animate-spin`} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-20" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)
