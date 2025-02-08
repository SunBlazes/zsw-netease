import { _IconProps } from "../types"
import Icon from "../Icon"

const SeqPlayIcon: React.FC<_IconProps> = ({ ...props }) => {
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
          d="M106 85.5c-22.1 0-40 17.9-40 40v760.6c0 22.1 17.9 40 40 40s40-17.9 40-40V125.5c0-22.1-17.9-40-40-40z m351.3 0c-22.1 0-40 17.9-40 40v760.6c0 22.1 17.9 40 40 40s40-17.9 40-40V125.5c0-22.1-17.9-40-40-40z m497.8 575.9c-7.1-12.4-20.3-20-34.6-20h-72c0-0.8 0.1-1.5 0.1-2.3V125.5c0-22.1-17.9-40-40-40s-40 17.9-40 40v513.6c0 0.8 0 1.5 0.1 2.3h-87c-14.3 0-27.5 7.6-34.6 20-7.1 12.4-7.1 27.6 0 40l119.4 206.8c7.1 12.4 20.3 20 34.6 20s27.5-7.6 34.6-20l119.4-206.8c7.2-12.4 7.2-27.7 0-40z m-154 146.8L751 721.4h100.2l-50.1 86.8z"
          fill="currentColor"
        ></path>
      </svg>
    </Icon>
  )
}

export default SeqPlayIcon
