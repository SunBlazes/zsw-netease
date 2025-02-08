import { Layout } from "@douyinfe/semi-ui"
import { Searchbar } from "../Searchbar"
import { Login } from "../Login"

const NHeader = () => {
  const { Header } = Layout
  return (
    <Header className="flex items-center bg-transparent justify-between h-20">
      <Searchbar />
      <Login />
    </Header>
  )
}

export default NHeader
