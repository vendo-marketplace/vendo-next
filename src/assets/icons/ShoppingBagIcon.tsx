interface Props {
  className?: string
  size?: number
  color?: string
}

export const ShoppingBagIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 4C10.8953 4 9.99983 4.89543 9.99983 6V7H13.9998V6C13.9998 4.89543 13.1044 4 11.9998 4ZM15.9998 7V6C15.9998 3.79086 14.209 2 11.9998 2C9.79069 2 7.99983 3.79086 7.99983 6V7H5.99983C5.47729 7 5.04285 7.40231 5.00278 7.9233L4.0856 19.8466C3.99625 21.0082 4.91469 22 6.07971 22H17.92C19.085 22 20.0034 21.0082 19.9141 19.8466L18.9969 7.9233C18.9568 7.40231 18.5224 7 17.9998 7H15.9998ZM13.9998 9V10C13.9998 10.5523 14.4475 11 14.9998 11C15.5521 11 15.9998 10.5523 15.9998 10V9H17.0738L17.92 20H6.07971L6.92586 9H7.99983V10C7.99983 10.5523 8.44755 11 8.99983 11C9.55212 11 9.99983 10.5523 9.99983 10V9H13.9998Z" fill={color}/>
  </svg>
)
