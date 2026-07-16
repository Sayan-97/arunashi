export default function SectionLoading({
  className = "py-20",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
