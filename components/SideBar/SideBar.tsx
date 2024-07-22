export const Sidebar = () => {
  return (
    <div className="w-[50%] p-20">
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
  );
};

export default Sidebar;
