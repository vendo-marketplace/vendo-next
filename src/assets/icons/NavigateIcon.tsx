interface Props {
  className?: string
  size?: number
  color?: string
}

export const NavigateIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C12.4124 2 12.7826 2.25318 12.932 2.63755L19.932 20.6376C20.078 21.0129 19.9846 21.4391 19.695 21.719C19.4055 21.9989 18.9763 22.0778 18.6061 21.9191L12 19.088L5.39395 21.9191C5.0238 22.0778 4.59461 21.9989 4.30505 21.719C4.01549 21.4391 3.92207 21.0129 4.06803 20.6376L11.068 2.63755C11.2175 2.25318 11.5876 2 12 2ZM13 17.3406L17.2048 19.1426L12 5.75903L6.7953 19.1426L11 17.3406V13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13V17.3406Z" fill={color}/>
  </svg>
)
