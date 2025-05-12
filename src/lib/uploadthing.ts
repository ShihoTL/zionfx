import {
  generateReactHelpers
} from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers({
    url: "https://fd586825-0d73-4971-99bb-4dfb1e26c3f0-00-slfd6nsxdkqv.picard.replit.dev:3000/api/uploadthing"
  });
