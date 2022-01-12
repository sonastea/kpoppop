import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faSpinner,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Col, Collapse, Container, Form, Image, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { submitMeme } from './MemeAPI';
//import * as nsfwjs from 'nsfwjs';

export type MemeFormData = {
  title: string;
  url?: string | undefined;
  file?: FileList | undefined;
};

const PostMeme = () => {
  //const fr = new FileReader();
  const [open, setOpen] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [uploadFinished, setUploadFinished] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | Array<File> | null>();
  const { register, handleSubmit } = useForm<MemeFormData>();

  //const watchImg = watch('file');

  const memeHandler: SubmitHandler<MemeFormData> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('url', data.url!);
    formData.append('file', data.file![0]);
    //const img = fileReader.readAsDataURL(data.file![0]);
    //const model = await nsfwjs.load("../../../public/model.json");
    //const predictions = await model.classify(img)
    //console.log('Predictions: ', predictions);

    setUploading(true);
    setUploadFinished(false);
    await submitMeme(formData)
      .then((response) => {
        if (response.status >= 401 && response.status < 600) {
          window.alert('You must be logged in to submit a meme.');
        }
      })
      .catch(() => {
        window.alert('Failed to upload meme.');
      })
      .finally(() => {
        setTimeout(() => {
          setUploading(false);
          setUploadFinished(true);
          window.location.reload();
        }, 1000);
      });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.currentTarget.files);
  };

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlInput = document.getElementById('url-input-box')!;
    const fileInput = document.getElementById('file-input-box')!;

    switch (e.currentTarget.id) {
      case 'url-input-box':
        if (e.target.value !== '') {
          fileInput.style.display = 'none';
        } else {
          fileInput.style.display = 'block';
        }
        break;

      case 'file-input-box':
        if (e.target.value !== '') {
          urlInput.style.display = 'none';
        } else {
          urlInput.style.display = 'block';
        }
        break;
      default:
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
                className="title required-input"
                {...register('title')}
              />
            </Form.Group>

            <Form.Group id="url-input-box" className="w-75 mb-3" controlId="url-input-box">
              <Form.Label>url</Form.Label>
              <Form.Control type="url" {...register('url')} onChange={handleChangeEvent} />
            </Form.Group>

            <Form.Group id="file-input-box" className="w-75 mb-3" controlId="file-input-box">
              <Form.Control
                type="file"
                accept="image/*"
                {...register('file')}
                onChange={handleChangeEvent}
                onInput={handleImageSelect}
              />
            </Form.Group>

            <Form.Group
              id="file-image-preview"
              controlId="file-image-preview"
            >
              {files &&
                Array.from(files).map((file) => {
                  return (
                    <Image key={file.name} className="w-75 mb-3 rounded-3" src={URL.createObjectURL(file)} alt={file.name} />
                  );
                })}
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
              {open ? 'Hide Form' : 'Show Form'}
              {open ? (
                <FontAwesomeIcon style={{ marginLeft: '10' }} icon={faAngleDoubleUp} />
              ) : (
                <FontAwesomeIcon style={{ marginLeft: '10' }} icon={faAngleDoubleDown} />
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PostMeme;
