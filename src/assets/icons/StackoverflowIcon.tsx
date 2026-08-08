interface Props {
  className?: string
  size?: number
  color?: string
}

export const StackoverflowIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M17 20V15H19V21.988H3V15H4.98V20H17Z" fill={color}/>
<path d="M6.84 14.522L15.57 16.347L15.939 14.592L7.209 12.767L6.84 14.522Z" fill={color}/>
<path d="M7.995 10.199L16.078 13.963L16.817 12.346L8.734 8.55901L7.995 10.199Z" fill={color}/>
<path d="M11.3673 4.71809L10.2349 6.07972L17.0938 11.784L18.2262 10.4224L11.3673 4.71809Z" fill={color}/>
<path d="M15.57 17H6.655V19H15.57V17Z" fill={color}/>
<path d="M12.861 3.11101L19.054 9.52601L20.468 8.11101L14.038 1.93401L12.861 3.11101Z" fill={color}/>
  </svg>
)
