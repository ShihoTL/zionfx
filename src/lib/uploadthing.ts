import {
  generateReactHelpers
} from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers({
    url: "https://zionfx-node.onrender.com/api/uploadthing"
  });
