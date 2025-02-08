import { _IconProps } from "../types"
import Icon from "../Icon"

const UpIcon: React.FC<_IconProps> = ({ ...props }) => {
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
          d="M512.146286 454.753524l-266.849524 266.727619L193.584762 669.744762l318.585905-318.415238 318.268952 318.415238-51.736381 51.687619z"
          fill="currentColor"
        ></path>
      </svg>
    </Icon>
  )
}

export default UpIcon
