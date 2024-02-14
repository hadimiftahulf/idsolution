// customTypes.d.ts

import { NextApiRequest } from "next";

interface CustomNextApiRequest extends NextApiRequest {
  user?: {
    id: number;
    permissions: string[];
  };
}

export default CustomNextApiRequest;
