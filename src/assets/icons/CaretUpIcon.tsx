interface Props {
  className?: string
  size?: number
  color?: string
}

export const CaretUpIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M7.11904 17C5.4288 17 4.50068 15.0333 5.57518 13.7286L7.11904 15L16.8811 15L12.0001 9.07305L7.11904 15L5.57518 13.7286L10.4562 7.80164C11.2562 6.83019 12.7439 6.83019 13.5439 7.80164L18.4249 13.7286C19.4994 15.0333 18.5713 17 16.8811 17L7.11904 17Z" fill={color}/>
  </svg>
)
