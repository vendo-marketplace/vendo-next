interface Props {
  className?: string
  size?: number
  color?: string
}

export const PyjamasIcon = ({ className, size = 24, color = "currentColor" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M11.6163 12.087L7.22025 9.35346L7.85968 6.9556L5.39787 5.9325L6.27736 4.55773L7.85968 2H16.0444L17.7709 4.62167M7.85968 2L11.8561 11.6554M11.3758 12.7425L11.3766 12.5187L11.6163 12.087L11.8561 11.6554L16.0444 2M11.3446 21.8863V21.4707L11.3758 12.7425M11.3446 21.8863H18.5702M11.3446 21.8863H4C3.44771 21.8863 3 21.4386 3 20.8863V7.4032M17.7709 4.62167L20.0499 4.87489C20.5549 4.931 20.9375 5.35689 20.9394 5.86499L20.9962 20.8825C20.9983 21.4363 20.55 21.8863 19.9962 21.8863H19.5613M17.7709 4.62167L18.5062 5.9325L16.2362 6.9556L16.7478 9.35346L11.3758 12.7425M6.27736 4.55773L3.87419 4.86249C3.37455 4.92586 3 5.35091 3 5.85455V6.25222" stroke={color} strokeWidth="1.3"/>
<ellipse cx="14.6394" cy="14.6394" rx="0.639432" ry="0.639432" stroke={color} strokeWidth="0.6"/>
<ellipse cx="14.6394" cy="17.6394" rx="0.639432" ry="0.639432" stroke={color} strokeWidth="0.6"/>
  </svg>
)
