import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faSpinner,
  faCheck,
  faHourglass
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Col, Collapse, Container, Form, Image, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { submitMeme } from './MemeAPI';
import * as nsfwjs from 'nsfwjs';

export type MemeFormData = {
  title: string;
  url?: string | undefined;
  file?: FileList | undefined;
  flagged: boolean;
};

const PostMeme = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [uploadFinished, setUploadFinished] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>();
  const [postable, setPostable] = useState<boolean>(false);
  const [flagged, setFlagged] = useState<boolean>(false);
  const [detecting, setDetecting] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<MemeFormData>();

  const memeHandler: SubmitHandler<MemeFormData> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('url', data.url!);
    formData.append('file', data.file![0]);
    formData.append('flagged', JSON.stringify(flagged));

    if (postable) {
      setUploading(true);
      setUploadFinished(false);
      submitMeme(formData)
        .then((response) => {
          if (response.status >= 401 && response.status< 600) {
            window.alert('You must be logged in to submit a meme.');
            setTimeout(() => {
              setUploadFinished(false);
              setUploading(false);
            }, 500);
          }
          if (response.status === 201) {
            setTimeout(() => {
              setUploadFinished(true);
              setUploading(false);
              window.location.reload();
            }, 500);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
          alert('Failed to upload meme.');
        });
    } else {
      window.alert('Please select a different image.');
    }
  };

  const handleChangeEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlInput = document.getElementById('url-input-box')!;
    const fileInput = document.getElementById('file-input-box')!;

    if (e.currentTarget.files && e.currentTarget.files.length > 1) {
      alert('Cannot post more than 1 photo.');
      setPostable(false);
      return;
    }

    switch (e.currentTarget.id) {
      case 'url-input-box':
        if (e.target.value !== '') {
          fileInput.style.display = 'none';
          setPostable(true);
        } else {
          fileInput.style.display = 'block';
          setPostable(false);
        }
        break;

      case 'file-input-box':
        if (e.target.value !== '') {
          urlInput.style.display = 'none';
        } else {
          urlInput.style.display = 'block';
          setPostable(false);
        }
        break;
      default:
        setPostable(false);
        break;
    }
  };

  const isSFW = (predictions: Array<any>) => {
    switch (predictions[0].className) {
      case 'Porn':
      case 'Hentai':
        if (predictions[0].probability > 0.8) {
          setFlagged(true);
          return false;
        } else if (predictions[0].probability > 0.5) {
          setFlagged(true);
          return true;
        } else {
          return true;
        }
      case 'Sexy':
        if (predictions[0].probability > 0.5) {
          setFlagged(true);
          return true;
        } else {
          return true;
        }
      default:
        return true;
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files); // UploadMeme Image Preview
    }

    if (e.target.files && e.target.files.length >= 1) {
      setDetecting(true);
      let image = new window.Image();
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      fetch(objectUrl).then((blob) => (image.src = blob.url));
      const model = await nsfwjs.load();
      const predictions = await model.classify(image);
      setPostable(isSFW(predictions));
      setDetecting(false);
    }
  };

  return (
    <>
      <Container>
        <Collapse in={open}>
          <Form id="post-meme-form" onSubmit={handleSubmit(memeHandler)}>
            <h3 className="mt-3 mb-4">Post meme to kpoppop</h3>

            <Form.Group id="title-input-form" className="w-75 mb-3" controlId="title-input-box">
              <Form.Label className="title required-input">title</Form.Label>
              <Form.Control
                required
                as="textarea"
                className="required-input"
                {...register('title')}
              />
            </Form.Group>

            <Form.Group id="url-input-box" className="w-75 mb-3" controlId="url-input-box">
              <Form.Label>url</Form.Label>
              <Form.Control type="url" {...register('url')} onChange={handleChangeEvent} />
            </Form.Group>

            <Form.Group id="file-input-box" className="w-75 mb-3" controlId="file-input-box">
              <Form.Control
                multiple
                type="file"
                accept="image/gif, image/jpeg, image/png"
                {...register('file')}
                onChange={handleChangeEvent}
                onInput={handleImageSelect}
              />
            </Form.Group>

            <Form.Group id="file-image-preview" controlId="file-image-preview" className="w-75">
              {files &&
                Array.from(files).map((file) => {
                  return (
                    <Image
                      key={file.name}
                      className="file-image-item mx-1 mb-3 rounded-3"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fluid
                    />
                  );
                })}
                {detecting && <FontAwesomeIcon className="ms-3" icon={faHourglass} />}
            </Form.Group>

            <div id="items-required" className="w-75 mb-3">
              {' '}
              is required
            </div>

            <Form.Group className="w-75 mb-4">
              <Button className="btn btn-pink btn-sm" type="submit">
                Post
              </Button>
              {isUploading && <FontAwesomeIcon className="ms-3" icon={faSpinner} spin />}
              {uploadFinished && <FontAwesomeIcon className="ms-3" icon={faCheck} />}
            </Form.Group>
          </Form>
        </Collapse>
      </Container>

      <Container>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <Button
              className="mt-3 mb-4 btn-pink btn-sm"
              onClick={() => setOpen(!open)}
              aria-controls="post-meme-form"
              aria-expanded={open}
            >
              {open ? 'Hide Form ' : 'Show Form '}
              {open ? (
                <FontAwesomeIcon icon={faAngleDoubleUp} />
              ) : (
                <FontAwesomeIcon icon={faAngleDoubleDown} />
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PostMeme;
