interface Props {
  className?: string
  size?: number
  color?: string
}

export const CaretRightIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M7 7.11898C7 5.42874 8.96667 4.50062 10.2714 5.57512L9 7.11898V16.881L14.9269 12L9 7.11898L10.2714 5.57512L16.1984 10.4561C17.1698 11.2561 17.1698 12.7438 16.1984 13.5439L10.2714 18.4249C8.96667 19.4994 7 18.5712 7 16.881V7.11898Z" fill={color}/>
  </svg>
)
