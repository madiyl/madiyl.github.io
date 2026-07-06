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
  const heroRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

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
  const activeSummary = (() => {
    switch (activeModule.key) {
      case "people":
        return {
          stat: `${data.people.length} 位成员`,
          detail: `${new Set(data.people.map((item) => item.group)).size} 组协作关系`,
        };
      case "design":
        return {
          stat: `${Object.values(data.design).reduce((sum, items) => sum + items.length, 0)} 张设计稿`,
          detail: "平面 / 立面 / 效果图统一归档",
        };
      case "materials":
        return {
          stat: `${data.materials.length} 条主材记录`,
          detail: "预算、附件和对比信息集中浏览",
        };
      case "appliances":
        return {
          stat: `${data.appliances.length} 条电器记录`,
          detail: "型号、渠道和实付金额并排呈现",
        };
      case "construction":
        return {
          stat: `${data.construction.length} 个大阶段`,
          detail: `${data.construction.reduce((sum, stage) => sum + stage.tasks.length, 0)} 条施工任务`,
        };
      case "soft":
        return {
          stat: `${data.softFurnishings.length} 条软装选择`,
          detail: "尺寸、预算和选购理由同页留痕",
        };
      default:
        return { stat: "", detail: "" };
    }
  })();

  const scrollHeroIntoFullView = () => {
    const heroNode = heroRef.current;
    if (!heroNode) return;

    const topGap = window.innerWidth < 640 ? 12 : 16;
    const targetTop =
      window.scrollY +
      heroNode.getBoundingClientRect().top -
      topGap;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  const handleModuleChange = (nextKey: (typeof navItems)[number]["key"]) => {
    setActiveModuleKey(nextKey);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollHeroIntoFullView();
      });
    });
  };

  return (
    <PageShell>
      <div className="space-y-8 lg:space-y-10">
        <section ref={heroRef} className="overflow-hidden rounded-[40px] border border-[rgba(255,255,255,0.74)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(246,238,228,0.82)_52%,rgba(233,222,205,0.76))] p-6 shadow-soft sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.35fr,0.82fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a7c5f] shadow-sm">
                可分享装修记录页
              </div>
              <div className="space-y-4 border-l border-[rgba(157,136,114,0.22)] pl-4 sm:pl-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8f755b]">
                  Editorial Overview
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
                  displayClassName="font-serif text-4xl font-semibold leading-[1.02] tracking-tight text-[#1f1812] sm:text-[3.35rem]"
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
                  displayClassName="max-w-3xl text-lg leading-8 text-[#5f5245]"
              />
              </div>
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
              className="rounded-[32px] border border-white/80 bg-[rgba(255,255,255,0.78)] p-5 shadow-soft backdrop-blur"
            >
              <div className="space-y-4 rounded-[24px] border border-white/70 bg-[#fbf8f4] px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f7d69]">
                  核心摘要
                </div>
                <div className="grid gap-3">
                  <div className="rounded-[20px] border border-white/70 bg-white px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                      当前章节
                    </div>
                    <div className="mt-2 text-base font-semibold text-ink">
                      {navItems.find((item) => item.key === activeModule.key)?.label}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-white/70 bg-white px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                      内容规模
                    </div>
                    <div className="mt-2 text-base font-semibold text-ink">{activeSummary.stat}</div>
                    <div className="mt-1 text-sm text-[#6c5d50]">{activeSummary.detail}</div>
                  </div>
                  <div className="rounded-[20px] bg-[#f7efe5] px-4 py-3 text-sm leading-7 text-[#6a5a4b]">
                    最近更新：{formatDate(updatedAt)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div
          ref={navRef}
          className="sticky top-4 z-30 overflow-x-auto rounded-[28px] border border-white/65 bg-[rgba(255,255,255,0.74)] px-3 py-3 shadow-soft backdrop-blur md:overflow-visible"
        >
          <nav className="flex min-w-max items-center gap-2 md:min-w-0 md:flex-wrap md:justify-between">
            <div className="hidden pl-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8f755b] md:block">
              Chapter Navigation
            </div>
            <div className="flex gap-2 md:flex-wrap md:justify-center">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleModuleChange(item.key)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  item.key === activeModule.key
                      ? "bg-[#211b15] text-white shadow-sm"
                      : "text-[#5b4b3e] hover:bg-[#f3ebdf] hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
            </div>
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

        <div className="pt-4">
          {activeModule.element}
        </div>
      </div>
    </PageShell>
  );
}
