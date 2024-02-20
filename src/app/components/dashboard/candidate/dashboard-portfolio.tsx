// @ts-nocheck
'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image, { StaticImageData } from 'next/image';
import { ArrowUp } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { Iportfolio } from '@/database/resume.model';

// portfolio item
export function PortfolioItem({
  img,
  alt,
  onLoad,
  removeFile
}: {
  img: StaticImageData;
  alt: string;
  onLoad?: () => void | undefined;
  removeFile?: (() => void) | undefined;
}) {
  return (
    <div className="col-lg-3 col-6">
      <div className="candidate-portfolio-block position-relative mb-25">
        <a href="#" className="d-block">
          <Image
            src={img}
            alt={alt}
            className="lazy-img w-100"
            onLoad={onLoad}
            width={300}
            height={300}
            // style={{ width: '100%', height: 'auto' }}
          />
        </a>
        <button
          onClick={(e) => {
            e.preventDefault();
            removeFile(alt);
          }}
          className="remove-portfolio-item rounded-circle d-flex align-items-center justify-content-center tran3s"
        >
          <i className="bi bi-x"></i>
        </button>
      </div>
    </div>
  );
}

interface IDashboardPortfolio {
  className: string;
  setValue: UseFormSetValue<any>;
  portfolios: Iportfolio[];
}

const DashboardPortfolio = ({
  className,
  setValue,
  portfolios
}: IDashboardPortfolio) => {
  const [files, setFiles] = useState(portfolios || []);
  const [rejected, setRejected] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles: any, rejectedFiles: any) => {
      if (acceptedFiles?.length) {
        setFiles((previousFiles: any[]) => [
          ...previousFiles,
          ...acceptedFiles.map((file: any) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        ]);

        const portfolioFiles = [];
        acceptedFiles.map((file: File) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file as File);
          return (fileReader.onload = () => {
            const base64 = fileReader.result;
            portfolioFiles.push({
              imageUrl: base64
            });
            setValue('portfolio', [...portfolioFiles, ...files]);
          });
        });
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }
    },
    [setValue, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 1000,

    onDrop
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files?.forEach((file) => URL.revokeObjectURL(file?.preview));
  }, [files]);

  const removeFile = (name: string, publicId: string) => {
    const hasNameProperty = files.some((file) => file.name !== undefined);

    if (hasNameProperty) {
      const newFiles = files.filter((file) => file.name !== name);
      setFiles(newFiles);

      setValue('portfolio', [...newFiles]);
    } else {
      const newFiles = files.filter((file) => file.public_id !== publicId);
      setFiles(newFiles);
      setValue('portfolio', [...newFiles]);
    }
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
    setValue('portfolio', []);
  };

  const removeRejected = (name: string) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  return (
    <div className="bg-white card-box border-20 mt-40">
      <h4 className="dash-title-three">Portfolio</h4>
      <div
        {...getRootProps({
          className
        })}
      >
        <input {...getInputProps()} />
        <div className="d-flex flex-column align-items-center justify-content-center gap-4">
          <ArrowUp className="w-5 h-5 fill-current" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Accepted files */}
      <h3 className="title fs-lg font-weight-bold text-neutral-600 mt-10 border-b pb-3">
        Accepted Files
      </h3>
      <div className="row">
        {files?.map((file, index) => (
          <div
            key={file.name + index + file.public_id}
            className="col-lg-3 col-6"
          >
            <div className="candidate-portfolio-block position-relative mb-25">
              <a href="#" className="d-block">
                <Image
                  src={file.imageUrl || file.preview}
                  alt={file?.name}
                  className="lazy-img w-100"
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                  width={300}
                  height={300}
                  // style={{ width: '100%', height: 'auto' }}
                />
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFile(file?.name, file?.public_id);
                }}
                className="remove-portfolio-item rounded-circle d-flex align-items-center justify-content-center tran3s"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Rejected Files */}
      <h3 className="title fs-lg font-weight-bold text-neutral-600 mt-24 border-b pb-3">
        Rejected Files
      </h3>
      <ul className="mt-6 d-flex flex-column">
        {rejected?.map(({ file, errors }: { file: never; error: any }) => (
          <li key={file?.name} className="d-flex justify-content-between">
            <div>
              <p className="mt-2 text-neutral-500 text-sm font-medium">
                {file?.name}
              </p>
              <ul className="text-sm text-danger">
                {errors.map((error: any) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="mt-1 py-1 text-sm text-uppercase fw-bold text-secondary border border-secondary rounded-md px-3 hover-bg-secondary hover-text-white transition-colors"
              onClick={() => removeRejected(file?.name)}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      {/* Preview */}
      <section className="mt-10 mb-10">
        <div className="d-flex gap-4">
          <h2 className="title fs-3 font-weight-bold">Preview</h2>
          <button
            type="button"
            onClick={removeAll}
            className="mt-1 text-sm text-uppercase fw-bold text-secondary border border-secondary rounded-md px-3 hover-bg-secondary hover-text-white transition-colors"
          >
            Remove all files
          </button>
          <button
            type="submit"
            className="ms-auto mt-1 text-sm text-uppercase fw-bold text-secondary border border-purple rounded-md px-3 hover-bg-purple hover-text-white transition-colors"
          >
            Upload to Cloudinary
          </button>
        </div>
      </section>
      <a href="#" className="dash-btn-one">
        <i className="bi bi-plus"></i> Add more
      </a>
    </div>
  );
};

export default DashboardPortfolio;
