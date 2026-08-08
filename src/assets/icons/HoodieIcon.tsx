interface Props {
  className?: string
  size?: number
  color?: string
}

export const HoodieIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M17.64 12C17.54 12.745 17.58 13.5 17.659 15.011L18 19.522C18 20.229 17.88 20.607 17.245 20.948C14.632 22.351 9.368 22.351 6.755 20.948C6.12 20.607 6 20.228 6 19.522L6.341 15.012C6.421 13.501 6.46 12.745 6.359 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14 17C14 17.875 14.419 18.419 15 19M10 17C10 17.875 9.581 18.419 9 19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
<path d="M7.39997 6.89701L11.282 8.74701C11.636 8.91601 11.813 9.00001 12 9.00001C12.187 9.00001 12.364 8.91601 12.718 8.74701L16.6 6.89701C17.46 6.48801 17.89 6.28301 17.982 5.75901C18.075 5.23401 17.802 4.92601 17.258 4.30901C14.536 1.23001 9.46397 1.23001 6.74197 4.30901C6.19697 4.92601 5.92497 5.23401 6.01797 5.75901C6.11097 6.28401 6.54097 6.48801 7.39997 6.89701Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14.0002 6L12.0002 9L10.0002 6M6.3842 6.5C5.0342 6.767 3.8272 8.02 2.9892 9.142C2.4522 9.86 2.1842 10.22 2.0512 10.883C1.9182 11.547 2.0582 12.101 2.3382 13.208L3.6382 18.338C3.8682 19.246 5.0002 19.111 6.0002 18.102M17.6162 6.5C18.9662 6.767 20.1732 8.02 21.0112 9.142C21.5482 9.86 21.8162 10.22 21.9492 10.883C22.0822 11.547 21.9422 12.101 21.6622 13.208L20.3622 18.338C20.1322 19.246 19.0002 19.103 18.0002 18.606" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
