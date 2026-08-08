interface Props {
  className?: string
  size?: number
  color?: string
}

export const HeelIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M21.5 10.5V20M14.5915 10C15.632 7.527 18.175 5.3335 19.5 4C20.052 4.3335 22 5.302 22 7.5C22 9.5 21.2725 11.0555 20.5 11.5L17.5065 13.5955C16.1837 14.5215 15.0707 15.7158 14.24 17.1005L12.5 20H2V18C3.2145 17.3335 6.91 15.0665 8.5 14C12 16 13.75 12 14.5915 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
