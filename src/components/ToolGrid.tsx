import ToolCard from "@/components/ToolCard";
import { hubItems } from "@/utils/hubItems";

export default function ToolGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hubItems.map((item) => (
        <ToolCard key={item.id} item={item} />
      ))}
    </div>
  );
}
