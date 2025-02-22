import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify/unstyled';
import { reportMeme } from './MemeAPI';
import useReportMemeStore from './hooks/useReportMeme';

type ReportMemePayload = {
  description: string;
};

const ReportMemeModal = () => {
  const [responseMsg, setResponseMsg] = useState<string>('');
  const [reported, setReported] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const { memeId, reporting, reportingMeme } = useReportMemeStore();
  const reportingRef = useRef(null);
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportMemePayload>();
  const watchDescription = watch('description');

  const handleReportMeme: SubmitHandler<ReportMemePayload> = async (data) => {
    setReported(true);
    setProcessing(true);

    await reportMeme(memeId, data.description).then((data) => {
      if (data.statusCode === 403) {
        toast.error('You must be logged in to do that!');
        reportingMeme();
        resetForm();
      } else {
        setTimeout(() => {
          setProcessing(false);
          setResponseMsg(data.message);
        }, 200);
      }
    });
  };

  const resetForm = () => {
    if (reported || watchDescription !== '') {
      reportingMeme();
      setReported(false);
      reset({ description: '' });
    } else {
      reportingMeme();
    }
  };

  return (
    <Dialog
      open={reporting}
      onClose={() => reset({ description: '' })}
      className="relative z-100"
      initialFocus={reportingRef}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) resetForm();
        }}
      >
        <DialogPanel className="w-full rounded-md bg-gray-200 p-6 md:w-3/4" ref={reportingRef}>
          <button
            aria-label="Report meme"
            onClick={() => resetForm()}
            type="button"
            className="fixed right-6 md:right-[15%]"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <DialogTitle className="text-2xl">Report meme</DialogTitle>
          <div className="p-4" />

          {reported ? (
            <>
              <div className="flex flex-col">
                {processing && (
                  <div className="flex w-full items-center justify-center py-2">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                )}
                <p
                  className="mb-4 w-full border-b border-once-300 pb-2 text-center text-sm
                    font-bold"
                >
                  {responseMsg}
                </p>
              </div>
              <Description className="text-center">
                Thanks for helping and providing fellow kpoppers with a clean, fun, and safe
                community.
              </Description>
            </>
          ) : (
            <form className="grid gap-2" onSubmit={handleSubmit(handleReportMeme)}>
              <textarea
                placeholder="Description of the report"
                className="outline-hidden rounded-md border border-once-300 p-1
                  focus:border-once-500"
                {...register('description', { required: true })}
              />

              {errors.description && (
                <span className="text-center text-error">This field is required</span>
              )}

              <div className="flex justify-center">
                <button
                  className="mr-1 w-full rounded-md border border-once bg-white p-1 text-once
                    hover:text-thrice"
                  type="button"
                  onClick={() => resetForm()}
                >
                  Cancel
                </button>
                <button
                  className="ml-1 w-full rounded-md border-once-700/70 bg-once-700/70 p-1 text-white
                    hover:bg-once-700"
                  type="submit"
                >
                  Report
                </button>
              </div>
            </form>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ReportMemeModal;
