"use client";

import {
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Tag,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
};

type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  online: boolean;
  verified: boolean;
  product: string;
  price: string;
  productColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "olena",
    name: "Олена Коваль",
    initials: "ОК",
    color: "bg-rose-100 text-rose-700",
    online: true,
    verified: true,
    product: "iPhone 13, 128 ГБ",
    price: "18 500 грн",
    productColor: "from-slate-200 to-slate-400",
    lastMessage: "Так, ще актуальний 🙂",
    time: "12:42",
    unread: 2,
    messages: [
      { id: "1", text: "Добрий день! Підкажіть, будь ласка, телефон ще продається?", time: "12:34", fromMe: false },
      { id: "2", text: "Вітаю! Так, ще актуальний 🙂", time: "12:38", fromMe: true },
      { id: "3", text: "А батарея добре тримає заряд? Є якісь подряпини?", time: "12:40", fromMe: false },
      { id: "4", text: "Так, ще актуальний 🙂", time: "12:42", fromMe: false },
    ],
  },
  {
    id: "andriy",
    name: "Андрій Мельник",
    initials: "АМ",
    color: "bg-blue-100 text-blue-700",
    online: false,
    verified: false,
    product: "Гірський велосипед Trek Marlin 7",
    price: "21 500 грн",
    productColor: "from-emerald-100 to-emerald-300",
    lastMessage: "Можу відправити Новою поштою",
    time: "Вчора",
    unread: 0,
    messages: [
      { id: "1", text: "Вітаю! Чи можна оглянути велосипед у суботу?", time: "17:10", fromMe: false },
      { id: "2", text: "Так, домовились. Напишіть, будь ласка, ближче до зустрічі.", time: "17:18", fromMe: true },
      { id: "3", text: "Можу відправити Новою поштою", time: "17:24", fromMe: true },
    ],
  },
  {
    id: "maria",
    name: "Марія Савчук",
    initials: "МС",
    color: "bg-violet-100 text-violet-700",
    online: true,
    verified: true,
    product: "Кавомашина De’Longhi",
    price: "6 200 грн",
    productColor: "from-amber-100 to-orange-200",
    lastMessage: "Дякую, заберу завтра!",
    time: "Пн",
    unread: 0,
    messages: [
      { id: "1", text: "Доброго дня! Кавомашина справна?", time: "10:02", fromMe: false },
      { id: "2", text: "Так, усе працює, можу надіслати відео.", time: "10:11", fromMe: true },
      { id: "3", text: "Дякую, заберу завтра!", time: "10:18", fromMe: false },
    ],
  },
  {
    id: "maksym",
    name: "Максим",
    initials: "М",
    color: "bg-cyan-100 text-cyan-700",
    online: false,
    verified: false,
    product: "Навушники Sony WH-1000XM4",
    price: "7 800 грн",
    productColor: "from-slate-200 to-slate-400",
    lastMessage: "Надішліть, будь ласка, ще фото",
    time: "Нд",
    unread: 0,
    messages: [
      { id: "1", text: "Добрий вечір! Є коробка та чек?", time: "19:01", fromMe: false },
      { id: "2", text: "Коробка є, чека вже немає.", time: "19:12", fromMe: true },
      { id: "3", text: "Надішліть, будь ласка, ще фото", time: "19:16", fromMe: false },
    ],
  },
];

function Avatar({ conversation, size = "size-11" }: { conversation: Conversation; size?: string }) {
  return (
    <div className={`relative flex ${size} shrink-0 items-center justify-center rounded-full text-sm font-semibold ${conversation.color}`}>
      {conversation.initials}
      {conversation.online && <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-emerald-500" />}
    </div>
  );
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [draft, setDraft] = useState("");
  const selected = conversations.find((conversation) => conversation.id === selectedId);
  const visibleConversations = useMemo(() => conversations.filter((conversation) => {
    const matchesQuery = `${conversation.name} ${conversation.product} ${conversation.lastMessage}`
      .toLocaleLowerCase("uk")
      .includes(query.toLocaleLowerCase("uk"));
    return matchesQuery && (filter === "all" || conversation.unread > 0);
  }), [conversations, filter, query]);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((current) => current.map((conversation) =>
      conversation.id === id ? { ...conversation, unread: 0 } : conversation,
    ));
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selected) return;

    const time = new Intl.DateTimeFormat("uk", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setConversations((current) => current.map((conversation) => conversation.id === selected.id
      ? {
          ...conversation,
          lastMessage: text,
          time,
          messages: [...conversation.messages, { id: `${Date.now()}`, text, time, fromMe: true }],
        }
      : conversation,
    ));
    setDraft("");
  };

  return (
    <section className="mx-auto w-full max-w-330 flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-medium text-text-brand">Ваші розмови</p>
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">Повідомлення</h1>
        </div>
        <span className="rounded-full bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-secondary">Демо-версія</span>
      </div>

      <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-stroke-primary-subtle bg-surface-primary shadow-sm lg:h-[min(760px,calc(100dvh-13rem))] lg:min-h-[560px] lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className={`${selected ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-stroke-primary-subtle`}>
          <div className="border-b border-stroke-primary-subtle p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Вхідні</h2>
              <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-secondary">{conversations.length} чатів</span>
            </div>
            <label className="flex h-11 items-center gap-2.5 rounded-xl border border-stroke-primary-subtle bg-surface-secondary px-3 text-text-tertiary focus-within:border-stroke-brand-light focus-within:bg-white">
              <Search aria-hidden="true" className="size-4 shrink-0" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук у повідомленнях" className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary" />
            </label>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setFilter("all")} className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${filter === "all" ? "bg-surface-brand text-white" : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"}`}>Усі</button>
              <button type="button" onClick={() => setFilter("unread")} className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${filter === "unread" ? "bg-surface-brand text-white" : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"}`}>Непрочитані{conversations.some((conversation) => conversation.unread > 0) && <span className="ml-1.5">· {conversations.reduce((count, conversation) => count + conversation.unread, 0)}</span>}</button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {visibleConversations.length ? visibleConversations.map((conversation) => (
              <button key={conversation.id} type="button" onClick={() => selectConversation(conversation.id)} className={`flex w-full gap-3 border-b border-stroke-primary-subtle px-4 py-4 text-left transition-colors hover:bg-surface-secondary sm:px-5 ${selectedId === conversation.id ? "bg-surface-brand-subtle" : ""}`}>
                <Avatar conversation={conversation} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold text-text-primary">{conversation.name}{conversation.verified && <ShieldCheck aria-label="Перевірений користувач" className="size-4 shrink-0 fill-blue-500 text-white" />}</span>
                    <span className="shrink-0 text-xs text-text-tertiary">{conversation.time}</span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-text-tertiary">{conversation.product}</span>
                  <span className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-text-secondary">{conversation.lastMessage}</span>
                    {conversation.unread > 0 && <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-brand text-[11px] font-semibold text-white">{conversation.unread}</span>}
                  </span>
                </span>
              </button>
            )) : (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface-secondary text-text-tertiary"><Search className="size-5" /></div>
                <p className="font-medium text-text-primary">Чатів не знайдено</p>
                <p className="mt-1 text-sm text-text-tertiary">Спробуйте змінити пошук або фільтр.</p>
              </div>
            )}
          </div>
        </aside>

        {selected ? (
          <div className={`${selected ? "flex" : "hidden"} min-h-0 flex-col`}>
            <header className="flex items-center justify-between border-b border-stroke-primary-subtle px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" aria-label="До списку чатів" onClick={() => setSelectedId(null)} className="flex size-9 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary lg:hidden"><ArrowLeft className="size-5" /></button>
                <Avatar conversation={selected} size="size-10" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5"><h2 className="truncate text-sm font-semibold text-text-primary sm:text-base">{selected.name}</h2>{selected.verified && <ShieldCheck aria-label="Перевірений користувач" className="size-4 shrink-0 fill-blue-500 text-white" />}</div>
                  <p className="mt-0.5 text-xs text-text-tertiary">{selected.online ? "Зараз у мережі" : "Був(-ла) нещодавно"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Зателефонувати" className="hidden size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary sm:flex"><Phone className="size-[18px]" /></button>
                <button type="button" aria-label="Інші дії" className="flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary"><MoreHorizontal className="size-5" /></button>
              </div>
            </header>

            <div className="border-b border-stroke-primary-subtle px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 rounded-xl bg-surface-secondary p-2.5">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${selected.productColor} text-slate-700`}><Tag className="size-5" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-xs text-text-tertiary">Товар у чаті</p><p className="truncate text-sm font-medium text-text-primary">{selected.product}</p></div>
                <p className="shrink-0 text-sm font-semibold text-text-primary">{selected.price}</p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#f8fafc] px-4 py-5 sm:px-8">
              <div className="mx-auto mb-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-text-tertiary shadow-sm">Сьогодні</div>
              {selected.messages.map((message, index) => {
                const previousMessage = selected.messages[index - 1];
                const showAvatar = !message.fromMe && (!previousMessage || previousMessage.fromMe);
                return (
                  <div key={message.id} className={`flex items-end gap-2 ${message.fromMe ? "justify-end" : "justify-start"}`}>
                    {!message.fromMe && (showAvatar ? <Avatar conversation={selected} size="size-7" /> : <span className="w-7 shrink-0" />)}
                    <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 sm:max-w-[70%] ${message.fromMe ? "rounded-br-md bg-surface-brand text-white" : "rounded-bl-md border border-stroke-primary-subtle bg-white text-text-primary"}`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                      <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.fromMe ? "text-white/75" : "text-text-tertiary"}`}><span>{message.time}</span>{message.fromMe && (index === selected.messages.length - 1 ? <CheckCheck className="size-3.5" /> : <Check className="size-3" />)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMessage} className="border-t border-stroke-primary-subtle bg-white p-3 sm:px-5 sm:py-4">
              <div className="flex items-end gap-2 rounded-2xl border border-stroke-primary-subtle bg-surface-secondary p-2 focus-within:border-stroke-brand-light focus-within:bg-white">
                <button type="button" aria-label="Додати вкладення" className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary"><Plus className="size-5" /></button>
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder="Напишіть повідомлення…" className="max-h-28 min-h-9 flex-1 resize-y bg-transparent py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary" />
                <button type="button" aria-label="Емодзі" className="mb-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary sm:flex"><Smile className="size-5" /></button>
                <button type="button" aria-label="Додати фото" className="mb-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary sm:flex"><ImageIcon className="size-5" /></button>
                <button type="submit" disabled={!draft.trim()} aria-label="Надіслати повідомлення" className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-brand text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-4" /></button>
              </div>
              <p className="mt-2 text-center text-[11px] text-text-tertiary">Демо-режим: повідомлення зберігаються лише у цій сесії</p>
            </form>
          </div>
        ) : (
          <div className="hidden flex-col items-center justify-center bg-surface-secondary px-8 text-center lg:flex">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white text-text-brand shadow-sm"><Send className="size-7" /></div>
            <h2 className="text-lg font-semibold text-text-primary">Оберіть чат</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">Ваші розмови з продавцями та покупцями з’являться тут.</p>
          </div>
        )}
      </div>
    </section>
  );
}
