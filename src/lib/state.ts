import { atom, useAtom } from "jotai";

export const createFormAtom = atom<boolean>(false);

export const useCreateForm = () => {
  const [open, setOpen] = useAtom(createFormAtom);

  return {
    open,
    setOpen,
  };
};

export const entryImageAtom = atom<string | null>(null);
export const entryImageUploadingAtom = atom<boolean>(false);

export const useEntryImage = () => {
  const [image, setImage] = useAtom(entryImageAtom);
  const [uploading, setUploading] = useAtom(entryImageUploadingAtom);

  return {
    image,
    setImage,
    uploading,
    setUploading,
  };
};
