interface Props {
  className?: string
  size?: number
  color?: string
}

export const CaretLeftIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M17 7.11898C17 5.42874 15.0333 4.50062 13.7286 5.57512L15 7.11898V16.881L9.07305 12L15 7.11898L13.7286 5.57512L7.80164 10.4561C6.83019 11.2561 6.83019 12.7438 7.80164 13.5439L13.7286 18.4249C15.0333 19.4994 17 18.5712 17 16.881V7.11898Z" fill={color}/>
  </svg>
)
