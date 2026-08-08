interface Props {
  className?: string
  size?: number
  color?: string
}

export const SmartphoneIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M11 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H11C12.1046 20 13 19.1046 13 18V6C13 4.89543 12.1046 4 11 4Z" stroke={color} strokeWidth="1.8"/>
<path d="M9 4H18C19.1046 4 20 4.89543 20 6V16C20 17.1046 19.1046 18 18 18H12" stroke={color} strokeWidth="1.8"/>
<path d="M8.0001 17.9001C8.49715 17.9001 8.9001 17.4972 8.9001 17.0001C8.9001 16.503 8.49715 16.1001 8.0001 16.1001C7.50304 16.1001 7.1001 16.503 7.1001 17.0001C7.1001 17.4972 7.50304 17.9001 8.0001 17.9001Z" fill={color}/>
  </svg>
)
