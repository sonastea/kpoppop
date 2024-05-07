import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import useRemoveMemeStore from 'hooks/useRemoveMeme';
import { Fragment, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { removeMeme } from './MemeAPI';

type RemoveMemeType = {
  memeId: number;
  success: boolean;
};

type ConfirmationDialogProps = {
  title: string;
  updateList: (memeId: number) => void;
};

const ConfirmationDialog = ({ title, updateList }: ConfirmationDialogProps) => {
  const { confirming, memeId, remove, confirmingCloseNo, confirmingCloseYes, resetMeme } =
    useRemoveMemeStore();

  const removeMemeHandler = useCallback(async () => {
    await removeMeme(memeId)
      .then((res: RemoveMemeType) => {
        if (res.success) updateList(memeId);
        if (!res.success) toast.error('Unable to remove meme');
      })
      .finally(() => resetMeme());
  }, [memeId, resetMeme, updateList]);

  useEffect(() => {
    if (remove) removeMemeHandler();
  }, [remove, removeMemeHandler]);

  return (
    <>
      <Transition appear show={confirming} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => confirmingCloseNo()}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6
                    text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle as="h3" className="mb-4 text-lg font-bold leading-6 text-gray-900">
                    Remove meme
                  </DialogTitle>
                  <div className="mb-2">
                    <p className="text-sm text-slate-600">
                      Are you sure you want to remove this post?
                    </p>
                  </div>
                  <p className="text-center text-sm font-bold">{title}</p>
                  <div className="mt-4 flex flex-row-reverse gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent
                        bg-green-600 p-2 px-4 text-sm text-white hover:bg-green-800
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500
                        focus-visible:ring-offset-2"
                      onClick={() => confirmingCloseYes()}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent
                        bg-red-600 p-2 px-4 text-sm text-white hover:bg-red-800 focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => confirmingCloseNo()}
                    >
                      No
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ConfirmationDialog;
