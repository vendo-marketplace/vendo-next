interface Props {
  className?: string
  size?: number
  color?: string
}

export const IconParkOutline_muscleIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M10.685 18C11.41 15.375 13.945 13.5 16.865 13.81C19.645 14.105 21.855 16.45 21.995 19.24C22.03 19.975 21.93 20.68 21.715 21.335C21.585 21.735 21.195 22 20.77 22H5.87896C3.35496 22 1.46196 19.6905 1.95696 17.2155L4.99996 2H11L13 5.5L8.71496 8.565L7.49996 7M8.71996 8.565L11 17" stroke={color} strokeWidth="1.7" strokeMiterlimit="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
