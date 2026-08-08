interface Props {
  className?: string
  size?: number
  color?: string
}

export const VueIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M14.5 3L12 7.156L9.857 3H2L12 21L22 3H14.5ZM4.486 4.5H6.886L12 13.8L17.107 4.5H19.507L12 18.021L4.486 4.5Z" fill={color}/>
  </svg>
)
