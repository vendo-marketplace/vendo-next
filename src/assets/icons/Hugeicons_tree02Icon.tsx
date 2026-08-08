interface Props {
  className?: string
  size?: number
  color?: string
}

export const Hugeicons_tree02Icon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12.0001 22V9M15.0001 17H16.0001C17.24 17.001 18.436 16.5413 19.356 15.7101C20.276 14.8789 20.8544 13.7356 20.9789 12.502C21.1033 11.2684 20.7651 10.0325 20.0296 9.03433C19.2942 8.03611 18.2142 7.34673 16.9991 7.1C16.9991 4.338 15.0001 2 12.0001 2C9.00011 2 7.00111 4.338 7.00111 7.1C5.78984 7.3509 4.7145 8.04172 3.98275 9.03906C3.25101 10.0364 2.91476 11.2695 3.03896 12.5002C3.16315 13.731 3.73897 14.872 4.65521 15.7031C5.57146 16.5341 6.76313 16.9961 8.00011 17H9.00011M12.0001 15L14.5001 12.5M12.0001 13L9.50011 10.5M10.0001 22H14.0001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
