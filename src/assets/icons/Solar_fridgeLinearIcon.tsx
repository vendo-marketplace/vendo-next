interface Props {
  className?: string
  size?: number
  color?: string
}

export const Solar_fridgeLinearIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4 10C4 6.229 4 4.343 5.172 3.172C6.344 2.001 8.229 2 12 2C15.771 2 17.657 2 18.828 3.172C19.999 4.344 20 6.229 20 10V13C20 16.771 20 18.657 18.828 19.828C17.656 20.999 15.771 21 12 21C8.229 21 6.343 21 5.172 19.828C4.001 18.656 4 16.771 4 13V10Z" stroke={color} strokeWidth="1.5"/>
<path d="M17 21V22H16V21M8 21V22H7V21" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
<path d="M20 11.5H4" stroke={color} strokeWidth="1.5"/>
<path d="M17 7V9M17 14V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
