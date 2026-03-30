import ToolCard from "@/components/ToolCard";
import type { HubItem } from "@/utils/hubItems";

type ToolGridProps = {
  items: HubItem[];
};

export default function ToolGrid({ items }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ToolCard key={item.id} item={item} />
      ))}
    </div>
  );
}
