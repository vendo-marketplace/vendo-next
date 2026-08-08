interface Props {
  className?: string
  size?: number
  color?: string
}

export const LaravelIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M17 13L20.4641 11V7L17 5L13.5359 7V11M17 13L13.5359 11M6.53589 18.8682L9.99999 21L17 17L17 13M17 13V9M17 13L9.99999 17M6.53589 18.8682V15L10.5 12.7348L13.5359 11M9.99999 21V17M6.53589 19V18.8682M10.5 12.7348V5L7 3L3.5 5V17L6.53589 18.8682M3.5 5L6.49999 7M10.5 5L6.49999 7M17 9L20.5 7M17 9L13.5 7M9.99999 17L6.49999 15M6.49999 15.5V7" stroke={color} strokeLinejoin="round"/>
  </svg>
)
