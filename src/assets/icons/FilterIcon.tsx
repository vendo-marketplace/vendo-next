interface Props {
  className?: string
  size?: number
  color?: string
}

export const FilterIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M3.69845 6.31701C2.56692 5.02384 3.48529 3 5.2036 3H18.7961C20.5144 3 21.4327 5.02384 20.3012 6.31701L14.9998 12.3757V19.5C14.9998 20.7361 13.5887 21.4416 12.5998 20.7L9.59983 18.45C9.22212 18.1667 8.99983 17.7221 8.99983 17.25V12.3757L3.69845 6.31701ZM18.7961 5H5.2036L10.505 11.0587C10.824 11.4233 10.9998 11.8913 10.9998 12.3757V17L12.9998 18.5V12.3757C12.9998 11.8913 13.1757 11.4233 13.4947 11.0587L18.7961 5Z" fill={color}/>
  </svg>
)
