import { Layout } from "@douyinfe/semi-ui"
import { Nav } from "../Nav"
import { Outlet } from "react-router"
import { Header } from "../Header"
import { useBgStore } from "@/store/bgStore"

const NLayout = () => {
  const { Sider, Content } = Layout
  const bg = useBgStore((state) => state.bg)

  return (
    <div className="relative">
      <Layout className="relative" style={{ zIndex: 999 }}>
        <Sider>
          <Nav />
        </Sider>
        <Layout className="pl-10 box-border">
          <Header></Header>
          <Content className="pt-6 scrollbar overflow-y-scroll h-[calc(100vh-80px)]">
            {<Outlet />}
            <div className="h-20"></div>
            <div className="h-20"></div>
          </Content>
        </Layout>
      </Layout>
      <div
        className="absolute top-0 left-0 right-0 h-full blur-[999px] z-[1]"
        style={{
          background: bg,
        }}
      ></div>
    </div>
  )
}

export default NLayout
