import { useRef, useState } from "react";

interface Iitem {
  name: any;
}

export const DropFileInput = (props: any, images: any) => {
  const wrapperRef: any = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e: any) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList: any = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const fileRemove = (file: never) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <p>Drag and Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item: Iitem, index) => (
            <div key={index} className="drop-file-preview__item">
              <img src={images} alt="" />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};
