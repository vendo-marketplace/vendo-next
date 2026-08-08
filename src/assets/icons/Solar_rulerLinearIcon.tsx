interface Props {
  className?: string
  size?: number
  color?: string
}

export const Solar_rulerLinearIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4.045 18.508C2.682 17.145 2 16.463 2 15.616C2 14.768 2.682 14.086 4.045 12.723L12.723 4.045C14.087 2.682 14.768 2 15.616 2C16.464 2 17.145 2.682 18.508 4.045L19.955 5.492C21.318 6.855 22 7.537 22 8.384C22 9.231 21.318 9.914 19.955 11.277L11.277 19.955C9.913 21.318 9.23 22 8.384 22C7.538 22 6.855 21.318 5.492 19.955L4.045 18.508Z" stroke={color} strokeWidth="1.5"/>
<path d="M8.46417 8.46398L9.88017 9.87998M12.7072 4.22198L14.1212 5.63598M4.22217 12.707L5.63617 14.121M6.34317 10.586L8.46517 12.707M10.5862 6.34298L12.7072 8.46398" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
