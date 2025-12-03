import { Link } from 'react-router-dom'

interface HomeButtonProps {
  className?: string
}

function HomeButton({ className = '' }: HomeButtonProps) {
  const baseClasses =
    'rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

  const mergedClasses = className ? `${baseClasses} ${className}` : baseClasses

  return (
    <Link to="/" className={mergedClasses}>
      Home
    </Link>
  )
}

export default HomeButton


