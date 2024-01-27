import MainMenu from "./dropdown";
import AddChat from "./addchat";


export default function HomeHeader() {

  return (
    <div className="flex  items-center justify-between  dark:bg-neutral-900 bg-neutral-100 w-full p-2 gap-2">
      <MainMenu />
      <h1>Chatterly</h1>
      <AddChat />
    </div>
  )
}
