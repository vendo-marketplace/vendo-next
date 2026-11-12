"use client";

import { Dialog } from "radix-ui";
import { useRef, useState, type DragEvent } from "react";

import { CloseIcon, CropIcon, NavSearchSmallIcon, PhotoSearchIcon, UploadSmallIcon } from "@/assets/icons/NavIcons";
import { Button } from "@/components/ui/button/button";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import { ACCEPTED_PHOTO_TYPES, cropPhoto, getPhotoError, type CropArea } from "../lib/photo-file";
import { closePhotoSearch, setSearchPhoto, usePhotoSearch } from "../lib/photo-search-store";
import { PhotoCropper } from "./PhotoCropper";

const INITIAL_CROP: CropArea = { x: 0.06, y: 0.08, width: 0.88, height: 0.84 };

// Figma 5124-26353 (upload) and 5129-27063 (crop): the camera in the search field opens this;
// a picked photo is cropped and becomes the search photo shown in the field.
export function PhotoSearchDialog() {
  const { isDialogOpen } = usePhotoSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropArea>(INITIAL_CROP);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const reset = () => {
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(null);
    setCrop(INITIAL_CROP);
    setError(null);
    setIsDragging(false);
    setIsSearching(false);
  };

  const close = () => {
    reset();
    closePhotoSearch();
  };

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    const fileError = getPhotoError(file);
    setError(fileError);
    if (fileError) return;
    setPhoto(URL.createObjectURL(file));
    setCrop(INITIAL_CROP);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    pickFile(event.dataTransfer.files[0]);
  };

  const search = async () => {
    if (!photo) return;
    setIsSearching(true);
    const cropped = await cropPhoto(photo, crop);
    URL.revokeObjectURL(photo);
    setPhoto(null);
    setIsSearching(false);
    setSearchPhoto(cropped);
    router.push({ pathname: "/search", query: { photo: "1" } });
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-60 flex w-[calc(100vw-2rem)] max-w-[535px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-surface-primary px-4 py-5 shadow-md outline-none"
        >
          <div className="relative flex items-center justify-center px-8">
            <Dialog.Title className="text-center text-sm font-medium text-text-secondary">
              {photo ? "Оберіть, що шукати" : "Завантажте фото, і ми знайдемо схожі оголошення"}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Закрити"
              className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
            >
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>

          {photo ? (
            <>
              <div className="rounded-md border border-stroke-primary-subtle bg-surface-secondary p-5">
                <PhotoCropper src={photo} area={crop} onChange={setCrop} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <CropIcon size={14} />
                  Потягніть за кути, щоб обрізати
                </p>
                {/* Both buttons use the design-system "sm" size (14px), pushed right. */}
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="text-secondary" size="sm" onClick={reset} className="font-medium">
                    Скасувати
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => void search()}
                    disabled={isSearching}
                    className="gap-1.5 font-medium"
                  >
                    <NavSearchSmallIcon size={14} />
                    {isSearching ? "Шукаємо…" : "Шукати"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex h-58 flex-col items-center justify-center gap-4 rounded-md border border-dashed bg-surface-secondary px-4 py-10 text-center transition-colors",
                isDragging ? "border-stroke-brand bg-surface-brand-subtle" : "border-stroke-primary-subtle",
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <PhotoSearchIcon size={24} className="text-text-primary" />
                <p className="text-xs font-medium text-text-primary">
                  Оберіть фото або перетягніть сюди
                </p>
                <p className={cn("text-xs", error ? "text-text-error" : "text-text-secondary")} role={error ? "alert" : undefined}>
                  {error ?? "JPG, PNG, WEBP · до 10 МБ"}
                </p>
              </div>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => inputRef.current?.click()}
                className="h-8 gap-2 font-medium"
              >
                <UploadSmallIcon size={14} />
                Завантажити
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_PHOTO_TYPES.join(",")}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(event) => {
                  pickFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
