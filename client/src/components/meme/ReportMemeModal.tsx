import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useReportMemeStore from './hooks/useReportMeme';
import { reportMeme } from './MemeAPI';

type ReportMemeData = {
  memeId: number;
  description: string;
};

const ReportMemeModal = (props: { id: number }) => {
  const [responseMsg, setResponseMsg] = useState<string>('');
  const [reported, setReported] = useState<boolean>(false);
  const { reporting, reportingMeme } = useReportMemeStore();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportMemeData>();

  const handleReportComment: SubmitHandler<ReportMemeData> = async (data) => {
    setReported(true);

    await reportMeme(props.id, data.description)
      .then((data: any) => {
        if (data.statusCode === 403) {
          toast.error('You must be logged in to do that!');
          reportingMeme();
          resetForm();
        } else {
          setResponseMsg(data.message);
        }
      })
      .finally(() => setTimeout(() => resetForm(), 10000));
  };

  const resetForm = () => {
    reportingMeme();
    setReported(false);
    reset({ description: '' });
  };

  return (
    <Dialog open={reporting} onClose={() => reportingMeme()} className="relative z-100">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-gray-200 p-6 w-full md:w-3/4 rounded-md">
          <button
            aria-label="Report comment"
            onClick={() => reportingMeme()}
            type="button"
            className="fixed right-6 md:right-[15%]"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Dialog.Title className="text-2xl">Report meme</Dialog.Title>
          <div className="p-4" />

          {reported ? (
            <>
              <p className="text-sm font-bold text-center border-b border-once-300 pb-2 mb-4">
                {responseMsg}
              </p>
              <Dialog.Description className="text-center">
                Thanks for helping and providing fellow kpoppers with a clean, fun, and safe
                community.
              </Dialog.Description>
            </>
          ) : (
            <form className="grid gap-2" onSubmit={handleSubmit(handleReportComment)}>
              <textarea
                placeholder="Description of the report"
                className="p-1 border border-once-300 rounded-md outline-none focus:border-once-500"
                {...register('description', { required: true })}
              />

              {errors.description && (
                <span className="text-center text-error">This field is required</span>
              )}

              <div className="flex justify-center">
                <button
                  className="w-full border bg-white border-once rounded-md text-once p-1 mr-1"
                  type="button"
                  onClick={() => reportingMeme()}
                >
                  Cancel
                </button>
                <button
                  className="w-full border bg-once p-1 rounded-md text-white ml-1"
                  type="submit"
                >
                  Report
                </button>
              </div>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportMemeModal;
