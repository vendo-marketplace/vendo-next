interface Props {
  className?: string
  size?: number
  color?: string
}

export const CaretDownIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M16.881 7C18.5712 7 19.4993 8.96667 18.4248 10.2714L16.881 9L7.11893 9L11.9999 14.9269L16.881 9L18.4248 10.2714L13.5438 16.1984C12.7438 17.1698 11.2561 17.1698 10.4561 16.1984L5.57507 10.2714C4.50057 8.96667 5.42869 7 7.11893 7L16.881 7Z" fill={color}/>
  </svg>
)
