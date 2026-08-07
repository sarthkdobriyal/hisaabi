export function TealNoirBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 h-[80vh] w-[120vw] rounded-full bg-teal-900/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[60vh] w-[60vw] rounded-full bg-teal-800/10 blur-[100px]" />
      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
