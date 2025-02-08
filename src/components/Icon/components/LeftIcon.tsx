import { _IconProps } from "../types"
import Icon from "../Icon"

const LeftIcon: React.FC<_IconProps> = ({ ...props }) => {
  return (
    <Icon {...props}>
      <svg
        className="w-full h-full"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
      >
        <path
          d="M659.748571 245.272381l-51.687619-51.687619-318.439619 318.585905 318.415238 318.268952 51.712-51.736381-266.703238-266.556952z"
          fill="currentColor"
        ></path>
      </svg>
    </Icon>
  )
}

export default LeftIcon
