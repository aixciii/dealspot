import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "all", label: "Все", emoji: "✦" },
  { id: "auto", label: "Авто", emoji: "🚗" },
  { id: "food", label: "Еда", emoji: "🍽️" },
  { id: "beauty", label: "Красота", emoji: "💅" },
  { id: "health", label: "Здоровье", emoji: "💆" },
  { id: "sport", label: "Спорт", emoji: "💪" },
  { id: "fun", label: "Досуг", emoji: "🎯" },
  { id: "photo", label: "Фото", emoji: "📸" },
  { id: "home", label: "Дом", emoji: "🏠" },
  { id: "pets", label: "Питомцы", emoji: "🐾" },
  { id: "kids", label: "Дети", emoji: "👶" },
  { id: "edu", label: "Обучение", emoji: "🎓" },
  { id: "travel", label: "Отдых", emoji: "🏨" },
];

const DEALS = [
  { id: 1, cat: "food", business: "Café Noir", service: "Бизнес-ланч до 15:00", discount: 35, timeLeft: 23, slots: 1, distance: "0.3 km", color: "#FF6B35", tier: "gold", hot: true },
  { id: 2, cat: "beauty", business: "Studio Bloom", service: "Маникюр в слабые часы", discount: 25, timeLeft: 110, slots: 2, distance: "0.7 km", color: "#E879A0", tier: "silver", hot: false },
  { id: 3, cat: "auto", business: "AutoWash BA", service: "Полная мойка + химчистка", discount: 30, timeLeft: 180, slots: 4, distance: "1.1 km", color: "#3B82F6", tier: "bronze", hot: false },
  { id: 4, cat: "sport", business: "FitLife Gym", service: "Дневная тренировка", discount: 40, timeLeft: 55, slots: 8, distance: "0.9 km", color: "#10B981", tier: "silver", hot: true },
  { id: 5, cat: "health", business: "Zen Spa", service: "Тайский массаж 60 мин", discount: 20, timeLeft: 240, slots: 3, distance: "1.4 km", color: "#8B5CF6", tier: "gold", hot: false },
  { id: 6, cat: "food", business: "Bistro Central", service: "Бранч + напиток", discount: 25, timeLeft: 90, slots: 5, distance: "0.5 km", color: "#F59E0B", tier: "bronze", hot: false },
  { id: 7, cat: "auto", business: "Slovakia Rent", service: "Аренда авто вторник–среда", discount: 20, timeLeft: 340, slots: 6, distance: "2.0 km", color: "#06B6D4", tier: "silver", hot: false },
  { id: 8, cat: "fun", business: "Escape Masters", service: "Квест на 4 человека", discount: 30, timeLeft: 42, slots: 2, distance: "1.6 km", color: "#EF4444", tier: "gold", hot: true },
  { id: 9, cat: "photo", business: "Flash Studio", service: "Аренда студии 2 часа", discount: 35, timeLeft: 200, slots: 1, distance: "1.8 km", color: "#F97316", tier: "silver", hot: false },
  { id: 10, cat: "pets", business: "PawCare", service: "Груминг для собаки", discount: 15, timeLeft: 300, slots: 3, distance: "0.8 km", color: "#84CC16", tier: "bronze", hot: false },
  { id: 11, cat: "kids", business: "KidSpace", service: "Занятие робототехникой", discount: 20, timeLeft: 150, slots: 7, distance: "1.2 km", color: "#EC4899", tier: "silver", hot: false },
  { id: 12, cat: "edu", business: "LangUp", service: "Урок английского 60 мин", discount: 25, timeLeft: 80, slots: 4, distance: "0.6 km", color: "#6366F1", tier: "gold", hot: false },
  { id: 13, cat: "home", business: "CleanPro", service: "Клининг квартиры 2ч", discount: 20, timeLeft: 420, slots: 2, distance: "1.5 km", color: "#14B8A6", tier: "bronze", hot: false },
  { id: 14, cat: "travel", business: "Hotel Luxe", service: "Спа-день + бассейн", discount: 45, timeLeft: 38, slots: 1, distance: "3.0 km", color: "#D97706", tier: "gold", hot: true },
];

const TIERS = {
  bronze: { label: "Bronze", color: "#CD7C54", bg: "#FFF8F5", icon: "🥉", price: "9,99€", deals: 40 },
  silver: { label: "Silver", color: "#94A3B8", bg: "#F8FAFC", icon: "🥈", price: "14,99€", deals: 80 },
  gold:   { label: "Gold",   color: "#F59E0B", bg: "#FFFBEB", icon: "🥇", price: "19,99€", deals: 120 },
};

function fmtTime(m) {
  if (m < 60) return `${m} мин`;
  return `${Math.floor(m / 60)}ч ${m % 60}м`;
}

function PulseDot({ color = "#EF4444" }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10, flexShrink: 0 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.4, animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
      <span style={{ borderRadius: "50%", background: color, width: 10, height: 10, display: "block" }} />
    </span>
  );
}

function TierBadge({ tier, small }) {
  const t = TIERS[tier];
  return (
    <span style={{
      background: t.bg, border: `1px solid ${t.color}55`,
      borderRadius: 6, padding: small ? "2px 6px" : "3px 9px",
      fontSize: small ? 9 : 10, fontWeight: 800,
      color: t.color, letterSpacing: "0.07em",
      fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap",
    }}>{t.icon} {t.label.toUpperCase()}</span>
  );
}

function DealCard({ deal, onTap }) {
  const urgent = deal.timeLeft < 60;
  const catEmoji = CATEGORIES.find(c => c.id === deal.cat)?.emoji;
  const catLabel = CATEGORIES.find(c => c.id === deal.cat)?.label;
  return (
    <div onClick={() => onTap(deal)} style={{
      background: "#fff", borderRadius: 22, overflow: "hidden", cursor: "pointer",
      border: urgent ? `2px solid ${deal.color}` : "2px solid #F1F5F9",
      boxShadow: urgent ? `0 4px 20px ${deal.color}25` : "0 2px 10px rgba(0,0,0,0.06)",
      transition: "all 0.2s",
    }}>
      <div style={{ height: 6, background: deal.color }} />
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: `${deal.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{catEmoji}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", fontFamily: "'Syne', sans-serif" }}>{deal.business}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{catLabel} · {deal.distance}</div>
            </div>
          </div>
          <TierBadge tier={deal.tier} small />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <div style={{ background: deal.color, color: "#fff", borderRadius: 12, padding: "8px 14px", fontWeight: 900, fontSize: 24, lineHeight: 1, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>−{deal.discount}%</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#334155", lineHeight: 1.4 }}>{deal.service}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {urgent && <PulseDot color={deal.color} />}
            <span style={{ fontSize: 11, fontWeight: 700, color: urgent ? deal.color : "#94A3B8" }}>
              {urgent ? `Горит! ${fmtTime(deal.timeLeft)}` : `⏱ ${fmtTime(deal.timeLeft)}`}
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: deal.slots <= 2 ? "#EF4444" : "#94A3B8" }}>
            {deal.slots <= 2 ? `🔥 Осталось ${deal.slots}!` : `${deal.slots} мест`}
          </span>
        </div>
      </div>
    </div>
  );
}

function DealModal({ deal, onClose }) {
  if (!deal) return null;
  const urgent = deal.timeLeft < 60;
  const catEmoji = CATEGORIES.find(c => c.id === deal.cat)?.emoji;
  const catLabel = CATEGORIES.find(c => c.id === deal.cat)?.label;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 480, animation: "slideUp 0.32s cubic-bezier(.4,0,.2,1)", paddingBottom: 40 }}>
        <div style={{ height: 6, background: deal.color, borderRadius: "28px 28px 0 0" }} />
        <div style={{ padding: "24px 28px 0" }}>
          <div style={{ width: 44, height: 4, background: "#E2E8F0", borderRadius: 4, margin: "0 auto 24px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>{catEmoji} {catLabel} · {deal.distance}</div>
              <div style={{ fontWeight: 900, fontSize: 24, color: "#0F172A", fontFamily: "'Syne', sans-serif" }}>{deal.business}</div>
            </div>
            <TierBadge tier={deal.tier} />
          </div>
          <div style={{ background: `${deal.color}10`, border: `2px solid ${deal.color}30`, borderRadius: 20, padding: "24px", marginBottom: 20 }}>
            <div style={{ fontWeight: 900, fontSize: 56, color: deal.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>−{deal.discount}%</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1E293B", marginTop: 10 }}>{deal.service}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Осталось времени</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: urgent ? "#EF4444" : "#0F172A", fontFamily: "'Syne', sans-serif" }}>{fmtTime(deal.timeLeft)}</div>
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Свободных мест</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: deal.slots <= 2 ? "#EF4444" : "#0F172A", fontFamily: "'Syne', sans-serif" }}>{deal.slots}</div>
            </div>
          </div>
          <button style={{ width: "100%", padding: "18px", background: deal.color, color: "#fff", border: "none", borderRadius: 16, fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Syne', sans-serif", boxShadow: `0 8px 24px ${deal.color}50` }}>
            Активировать скидку →
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ onDeal }) {
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? DEALS : DEALS.filter(d => d.cat === cat);
  const hot = DEALS.filter(d => d.hot);
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: "-0.5px" }}>Deal<span style={{ color: "#FF6B35" }}>Spot</span></div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>📍 Bratislava · сейчас</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1E293B", borderRadius: 12, padding: "8px 14px" }}>
              <PulseDot color="#10B981" />
              <span style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>{DEALS.length} акций</span>
            </div>
            <TierBadge tier="silver" />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>🔥 ГОРЯТ ПРЯМО СЕЙЧАС</div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", marginLeft: -20, paddingLeft: 20, paddingRight: 20 }}>
          {hot.map(d => (
            <div key={d.id} onClick={() => onDeal(d)} style={{ flexShrink: 0, background: d.color, borderRadius: 18, padding: "14px 16px", width: 160, cursor: "pointer", boxShadow: `0 8px 24px ${d.color}50` }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: "#fff", fontFamily: "'Syne', sans-serif" }}>−{d.discount}%</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>{d.business}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>⏱ {fmtTime(d.timeLeft)}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", padding: "14px 20px", background: "#fff", borderBottom: "1px solid #F1F5F9", position: "sticky", top: 0, zIndex: 10 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{ flexShrink: 0, background: cat === c.id ? "#0F172A" : "#F8FAFC", color: cat === c.id ? "#fff" : "#64748B", border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Syne', sans-serif", transition: "all 0.15s" }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.06em", paddingLeft: 4 }}>{filtered.length} предложений</div>
        {filtered.map(d => <DealCard key={d.id} deal={d} onTap={onDeal} />)}
      </div>
    </div>
  );
}

function PlansScreen() {
  const [selected, setSelected] = useState("silver");
  return (
    <div style={{ padding: "32px 20px 90px", minHeight: "100%" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#0F172A", marginBottom: 6 }}>Подписка</div>
      <div style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Чем выше уровень — больше партнёров и скидки</div>
      {Object.entries(TIERS).map(([key, t]) => (
        <div key={key} onClick={() => setSelected(key)} style={{ background: "#fff", borderRadius: 22, padding: "22px", marginBottom: 14, cursor: "pointer", border: selected === key ? `2.5px solid ${t.color}` : "2.5px solid #F1F5F9", boxShadow: selected === key ? `0 8px 32px ${t.color}25` : "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: "#0F172A" }}>{t.icon} {t.label}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>до {t.deals} партнёров</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24, color: t.color }}>{t.price}</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>/месяц</div>
            </div>
          </div>
          {(key === "bronze" ? ["Горящие акции рядом", "Фильтры по 13 категориям", "Push-уведомления о скидках"] :
            key === "silver" ? ["Всё из Bronze", "Приоритет в очереди", "Скидки до 40%"] :
            ["Всё из Silver", "Эксклюзивные предложения", "Скидки до 50%"]).map(f => (
            <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${t.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.color, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{f}</span>
            </div>
          ))}
          {selected === key && (
            <button style={{ width: "100%", padding: "15px", background: t.color, color: "#fff", border: "none", borderRadius: 14, marginTop: 16, fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "'Syne', sans-serif", boxShadow: `0 6px 20px ${t.color}50` }}>
              Выбрать {t.label} →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function BusinessScreen() {
  const [discount, setDiscount] = useState(25);
  const [hours, setHours] = useState(3);
  const [slots, setSlots] = useState(5);
  const [published, setPublished] = useState(false);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (published) {
      const t = setInterval(() => setViews(v => v < 47 ? v + 1 : v), 80);
      return () => clearInterval(t);
    }
  }, [published]);

  return (
    <div style={{ padding: "28px 20px 90px", minHeight: "100%" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#0F172A", marginBottom: 2 }}>Кабинет бизнеса</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Café Noir · Bratislava</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Клиентов сегодня", value: "18", color: "#FF6B35" },
          { label: "Через DealSpot", value: "11", color: "#8B5CF6" },
          { label: "Конверсия", value: "61%", color: "#10B981" },
          { label: "Доп. выручка", value: "€340", color: "#F59E0B" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 18, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 22, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#0F172A", marginBottom: 22 }}>🔥 Запустить акцию прямо сейчас</div>
        {[
          { label: "Скидка", value: discount, set: setDiscount, min: 5, max: 50, color: "#FF6B35", fmt: v => `${v}%` },
          { label: "Длительность", value: hours, set: setHours, min: 1, max: 12, color: "#6366F1", fmt: v => `${v} ч` },
          { label: "Количество мест", value: slots, set: setSlots, min: 1, max: 30, color: "#10B981", fmt: v => `${v}` },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{s.label}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: s.color }}>{s.fmt(s.value)}</span>
            </div>
            <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => { s.set(Number(e.target.value)); setPublished(false); setViews(0); }} style={{ width: "100%", accentColor: s.color }} />
          </div>
        ))}
        <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "14px 16px", marginBottom: 20, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8, fontWeight: 700 }}>ПРЕДПРОСМОТР</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: "#FF6B35", color: "#fff", borderRadius: 10, padding: "6px 12px", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>−{discount}%</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}>Café Noir</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>⏱ {fmtTime(hours * 60)} · {slots} мест</div>
            </div>
          </div>
        </div>
        {published ? (
          <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 16, padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#166534" }}>Акция активна!</div>
            <div style={{ fontSize: 13, color: "#16A34A", marginTop: 4 }}>👁 {views} подписчиков уже видят</div>
          </div>
        ) : (
          <button onClick={() => setPublished(true)} style={{ width: "100%", padding: "17px", background: "#0F172A", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
            Опубликовать → {discount}% на {hours}ч
          </button>
        )}
      </div>
      <div style={{ background: "#fff", borderRadius: 22, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", marginBottom: 16, fontFamily: "'Syne', sans-serif" }}>Последние визиты</div>
        {[
          { name: "Martin K.", time: "14:32", saving: "€8.50", tier: "gold" },
          { name: "Zuzana M.", time: "13:15", saving: "€6.20", tier: "silver" },
          { name: "Peter N.", time: "12:48", saving: "€11.00", tier: "gold" },
        ].map((v, i) => (
          <div key={v.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}>{v.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{v.time}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <TierBadge tier={v.tier} small />
              <span style={{ fontWeight: 700, fontSize: 13, color: "#10B981" }}>+{v.saving}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV = [
  { id: "home", label: "Акции", emoji: "✦" },
  { id: "plans", label: "Тарифы", emoji: "💎" },
  { id: "business", label: "Бизнес", emoji: "🏪" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedDeal, setSelectedDeal] = useState(null);
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#F8FAFC", position: "relative", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 4px; outline: none; }
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(2.2);opacity:0} }
        @keyframes slideUp { from{transform:translateY(120px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "calc(100vh - 70px)", overflowY: "auto" }}>
        {screen === "home" && <HomeScreen onDeal={setSelectedDeal} />}
        {screen === "plans" && <PlansScreen />}
        {screen === "business" && <BusinessScreen />}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "12px 0 24px", zIndex: 50 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 20px" }}>
            <div style={{ fontSize: screen === n.id ? 22 : 20, transition: "all 0.2s", transform: screen === n.id ? "scale(1.15)" : "scale(1)", filter: screen === n.id ? "none" : "grayscale(1) opacity(0.4)" }}>{n.emoji}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: screen === n.id ? "#0F172A" : "#CBD5E1", fontFamily: "'Syne', sans-serif", letterSpacing: "0.04em" }}>{n.label}</div>
            {screen === n.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF6B35", marginTop: -2 }} />}
          </button>
        ))}
      </div>
      <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
    </div>
  );
}
