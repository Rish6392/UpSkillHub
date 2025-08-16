import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log("File dropped:", file);
    
    if (file) {
      // Check file size for videos (limit to 100MB)
      if (video && file.size > 100 * 1024 * 1024) {
        toast.error("Video file size should be less than 100MB");
        return;
      }
      
      // Check file type
      if (video) {
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Please upload a valid video file (MP4, AVI, MOV, WMV)");
          return;
        }
      }
      
      setIsUploading(true);
      
      try {
        previewFile(file);
        setSelectedFile(file);
        setValue(name, file, { shouldValidate: true });
        toast.success(`${video ? 'Video' : 'Image'} uploaded successfully`);
        console.log("File set successfully:", file.name);
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4", ".avi", ".mov", ".wmv"] },
    onDrop,
    maxSize: video ? 100 * 1024 * 1024 : 5 * 1024 * 1024, // 100MB for videos, 5MB for images
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        toast.error(`File is too large. Maximum size is ${video ? '100MB' : '5MB'}`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        toast.error(`Invalid file type. Please upload a ${video ? 'video' : 'image'} file.`);
      }
    }
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        {...getRootProps()}
        className={`$ {
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        <input {...getInputProps()} 
        // ref={inputRef}
         />
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="relative">
                <ReactPlayer 
                  url={previewSource} 
                  controls 
                  width="100%" 
                  height="300px"
                  onError={(error) => {
                    console.error("Video preview error:", error);
                    toast.error("Error loading video preview");
                  }}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white">Processing video...</div>
                  </div>
                )}
              </div>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                  console.log("Upload cancelled for:", name);
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              {!video ? (
                <>
                  <li>Aspect ratio 16:9</li>
                  <li>Recommended size 1024x576</li>
                  <li>Max size: 5MB</li>
                </>
              ) : (
                <>
                  <li>Formats: MP4, AVI, MOV, WMV</li>
                  <li>Max size: 100MB</li>
                  <li>Recommended: MP4</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}