import NumberInput from "@/components/ui/input/number-input";
import { Input } from "@/components/ui/input/input";
import type { ProductDraft } from "./form-utils";

type Props = Pick<ProductDraft, "price" | "quantity" | "condition"> & {
  onChange: (field: "price" | "quantity" | "condition", value: string) => void;
};

export default function CreateProductPricingSection({
  price,
  quantity,
  condition,
  onChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
      <div className="mb-6 flex gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand">
          <span className="text-lg font-semibold">₴</span>
        </div>
        <div>
          <p className="font-semibold">Ціна та стан</p>
          <p className="mt-1 text-sm text-text-secondary">
            Вкажіть вартість і стан речі.
          </p>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 md:grid-cols-2">
        <label
          htmlFor="product-price"
          className="flex min-w-0 flex-col gap-2 text-sm font-medium"
        >
          <span className="whitespace-nowrap">
            Ціна <span className="text-text-brand">*</span>
          </span>
          <Input
            id="product-price"
            size="sm"
            containerClassName="w-full min-w-0"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => onChange("price", event.target.value)}
            clearable={false}
            placeholder="0"
            end={<span className="text-sm text-text-tertiary">₴</span>}
            className="text-base font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>

        <div className="flex min-w-0 flex-col gap-2 text-sm font-medium">
          <span className="whitespace-nowrap">
            Стан товару <span className="text-text-brand">*</span>
          </span>
          <div className="grid w-full min-w-0 grid-cols-2 rounded-xl bg-surface-primary-subtle p-1">
            {([
              { value: "used", label: "Вживаний" },
              { value: "new", label: "Новий" },
            ] as const).map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange("condition", item.value)}
                className={`h-[30px] min-w-0 rounded-lg px-2 text-sm transition ${
                  condition === item.value
                    ? "bg-white font-medium text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2 text-sm font-medium">
          <label htmlFor="product-quantity">Кількість</label>
          <NumberInput
            id="product-quantity"
            size="sm"
            containerClassName="w-full min-w-0"
            min="1"
            step="1"
            value={quantity}
            onValueChange={(value) => onChange("quantity", value)}
          />
        </div>
      </div>
    </section>
  );
}
