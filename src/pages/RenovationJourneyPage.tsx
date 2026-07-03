import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { EditableField } from "@/components/common/EditableField";
import { AppliancesStage } from "@/components/stages/AppliancesStage";
import { ConstructionStage } from "@/components/stages/ConstructionStage";
import { DesignStage } from "@/components/stages/DesignStage";
import { MaterialsStage } from "@/components/stages/MaterialsStage";
import { PeopleIntroStage } from "@/components/stages/PeopleIntroStage";
import { SoftFurnishingStage } from "@/components/stages/SoftFurnishingStage";
import type { RenovationPageData } from "@/types/renovation";
import { formatDate } from "@/utils/format";

type RenovationJourneyPageProps = {
  data: RenovationPageData;
  editMode: boolean;
  bannerMessage?: string;
  error?: string;
  updatedAt: string;
  onChange: (next: RenovationPageData) => void;
};

const navItems = [
  { key: "people", label: "人员介绍" },
  { key: "design", label: "设计阶段" },
  { key: "materials", label: "主材选购" },
  { key: "appliances", label: "电器选购" },
  { key: "construction", label: "施工流程" },
  { key: "soft", label: "软装选取" },
];

export function RenovationJourneyPage({
  data,
  editMode,
  bannerMessage,
  error,
  updatedAt,
  onChange,
}: RenovationJourneyPageProps) {
  const [activeModuleKey, setActiveModuleKey] = useState<(typeof navItems)[number]["key"]>("people");
  const navRef = useRef<HTMLDivElement | null>(null);
  const activeModuleRef = useRef<HTMLDivElement | null>(null);

  const modules = [
    {
      key: "people" as const,
      element: (
        <PeopleIntroStage
          people={data.people}
          editMode={editMode}
          onChange={(people) => onChange({ ...data, people })}
        />
      ),
    },
    {
      key: "design" as const,
      element: (
        <DesignStage
          design={data.design}
          editMode={editMode}
          onChange={(design) => onChange({ ...data, design })}
        />
      ),
    },
    {
      key: "materials" as const,
      element: (
        <MaterialsStage
          materials={data.materials}
          editMode={editMode}
          onChange={(materials) => onChange({ ...data, materials })}
        />
      ),
    },
    {
      key: "appliances" as const,
      element: (
        <AppliancesStage
          appliances={data.appliances}
          editMode={editMode}
          onChange={(appliances) => onChange({ ...data, appliances })}
        />
      ),
    },
    {
      key: "construction" as const,
      element: (
        <ConstructionStage
          construction={data.construction}
          editMode={editMode}
          onChange={(construction) => onChange({ ...data, construction })}
        />
      ),
    },
    {
      key: "soft" as const,
      element: (
        <SoftFurnishingStage
          items={data.softFurnishings}
          editMode={editMode}
          onChange={(softFurnishings) => onChange({ ...data, softFurnishings })}
        />
      ),
    },
  ];

  const activeModule =
    modules.find((module) => module.key === activeModuleKey) ?? modules[0];

  const scrollActiveModuleIntoSafePosition = () => {
    const moduleNode = activeModuleRef.current;
    const navNode = navRef.current;
    if (!moduleNode || !navNode) return;

    const navHeight = navNode.getBoundingClientRect().height;
    const stickyTopOffset = 16;
    const safeGap = 16;
    const targetTop =
      window.scrollY +
      moduleNode.getBoundingClientRect().top -
      (navHeight + stickyTopOffset + safeGap);

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  const handleModuleChange = (nextKey: (typeof navItems)[number]["key"]) => {
    setActiveModuleKey(nextKey);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollActiveModuleIntoSafePosition();
      });
    });
  };

  return (
    <PageShell>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[36px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(246,238,228,0.88)_50%,_rgba(234,223,206,0.78))] p-6 shadow-soft sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr,0.8fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent shadow-sm">
                可分享装修记录页
              </div>
              <EditableField
                value={data.meta.title}
                editMode={editMode}
                onChange={(value) =>
                  onChange({
                    ...data,
                    meta: { ...data.meta, title: value },
                  })
                }
                placeholder="请输入页面标题"
                displayClassName="text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl"
              />
              <EditableField
                value={data.meta.subtitle}
                editMode={editMode}
                onChange={(value) =>
                  onChange({
                    ...data,
                    meta: { ...data.meta, subtitle: value },
                  })
                }
                placeholder="请输入副标题"
                displayClassName="text-lg leading-8 text-[#5f5245]"
              />
              <EditableField
                label="页面导语"
                value={data.meta.intro}
                editMode={editMode}
                onChange={(value) =>
                  onChange({
                    ...data,
                    meta: { ...data.meta, intro: value },
                  })
                }
                placeholder="描述这次装修的目标、风格和记录方式"
                multiline
                className="max-w-3xl"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-soft"
            >
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                    分享说明
                  </div>
                  <EditableField
                    value={data.meta.shareCopy}
                    editMode={editMode}
                    onChange={(value) =>
                      onChange({
                        ...data,
                        meta: { ...data.meta, shareCopy: value },
                      })
                    }
                    placeholder="介绍这个页面适合分享给谁、为什么值得看"
                    multiline
                  />
                </div>
                <div className="rounded-[24px] bg-[#f7efe5] px-4 py-4 text-sm leading-7 text-[#6a5a4b]">
                  最近更新：{formatDate(updatedAt)}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div
          ref={navRef}
          className="sticky top-4 z-30 overflow-x-auto rounded-full border border-white/60 bg-white/75 px-2 py-2 shadow-soft backdrop-blur sm:px-3 sm:py-3 md:overflow-visible"
        >
          <nav className="flex min-w-max gap-2 md:min-w-0 md:flex-wrap md:justify-center">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleModuleChange(item.key)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  item.key === activeModule.key
                    ? "bg-[#f3ebdf] text-ink"
                    : "text-[#5b4b3e] hover:bg-[#f3ebdf] hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {bannerMessage ? (
          <div className="rounded-[24px] border border-[#e6d6c2] bg-[#f7efe5] px-5 py-4 text-sm leading-7 text-[#6f5d4b]">
            {bannerMessage}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[24px] border border-[#e7cdc4] bg-[#f8e9e4] px-5 py-4 text-sm leading-7 text-[#965645]">
            {error}
          </div>
        ) : null}

        <div ref={activeModuleRef} className="pt-4">
          {activeModule.element}
        </div>
      </div>
    </PageShell>
  );
}
