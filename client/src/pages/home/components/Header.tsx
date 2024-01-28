import MainMenu from "./dropdown";
import AddChat from "./addchat";


export default function HomeHeader() {

  return (
    <div className="flex  items-center justify-between  dark:bg-neutral-900 bg-neutral-100 w-full p-2 gap-2">
      <MainMenu />
      <div className="flex gap-2 items-center">
        <img src="/logo1.png" alt="Chatterly" className="size-12 pointer-events-none mix-blend-normal" />
        <h1 className="text-3xl font-semibold">Chatterly</h1>
      </div>
      <AddChat />
    </div>
  )
}
