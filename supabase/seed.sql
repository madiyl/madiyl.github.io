insert into public.hub_items (id,title,description,kind,status,href,icon,order_index)
values
  ('weekend-flowers','周末赏花攻略','北京周边春季赏花路线与排雷指南','攻略','已完成','./tools/weekend-flowers.html','Flower2',10),
  ('qingming-roadtrip','清明自驾游计划','3天2夜周边自驾行程表与物资清单','攻略','规划中','./tools/qingming-roadtrip.html','Car',20),
  ('renovation-budget','装修预算计算器','软硬装费用明细预估与超支预警','工具','已完成','./tools/renovation-budget.html','Calculator',30)
on conflict (id) do update set
  title=excluded.title,
  description=excluded.description,
  kind=excluded.kind,
  status=excluded.status,
  href=excluded.href,
  icon=excluded.icon,
  order_index=excluded.order_index;

