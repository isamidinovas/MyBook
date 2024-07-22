import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";

export const Sidebar = () => {
  return (
    <>
      <div className=" md:flex flex-col hidden w-[50%] p-20">
        <p className="font-bold text-lg">Book by Genre</p>
        <div className="mb-10 flex flex-col gap-4 cursor-pointer">
          <p>Lorem</p>
          <p>Lorem</p>
          <p>Lorem</p>
          <p>Lorem</p>
          <p>Lorem</p>
          <p>Lorem</p>
        </div>
        <div className="h-7 border-t border-gray-400 opacity-30"></div>
        <p className="font-bold">Recomendations</p>
        <div className="flex flex-col gap-4 cursor-pointer">
          <p>Ipsum</p>
          <p>Ipsum</p>
          <p>Ipsum</p>
          <p>Ipsum</p>
          <p>Ipsum</p>
        </div>
      </div>
      <div className="md:hidden pt-10 relative top-5">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Sidebar;
