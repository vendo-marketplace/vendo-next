interface Props {
  className?: string
  size?: number
  color?: string
}

export const JeansIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_1433_4929)">
<path d="M4.36997 2.5H19.63M13.5 0.5V2.5M10.5 0.5V2.5M8.99997 2.5L5.99997 7.5H4.04297M15 2.5L18 7.5H19.956" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11 10.5L12 8.5L13 10.5L13.858 21.6534C13.9381 22.6954 14.807 23.5 15.8521 23.5H18.8653C20.0211 23.5 20.9363 22.5232 20.8611 21.3698L19.5 0.5H4.5L3.13892 21.3698C3.06371 22.5232 3.9789 23.5 5.13468 23.5H8.14794C9.19301 23.5 10.0619 22.6954 10.142 21.6534L11 10.5Z" stroke={color} strokeWidth="1.7" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1433_4929">
<rect width="24" height="24" fill={color}/>
</clipPath>
</defs>
  </svg>
)
