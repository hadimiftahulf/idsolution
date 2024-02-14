import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/uploads");
    options.filename = (name, ext, path, form) => {
      return "" + path.originalFilename?.replaceAll(" ", "-");
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    try {
      await fs.readdir(path.join(process.cwd() + "/public", "/uploads"));
    } catch (error) {
      await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"));
    }
    const { files } = await readFile(req, true);
    if (files && files.file) {
      const uploadedFileName = files.file[0].newFilename;
      const imageUrl = `${process.env.NEXT_PUBLIC_URL}/images/${uploadedFileName}`;

      res.json({
        status: "success",
        url: imageUrl,
        path: "/uploads/" + uploadedFileName,
        filename: uploadedFileName,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "File not found in the request.",
      });
    }
  } else if (req.method === "DELETE") {
    // Handle file deletion
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({
        status: "error",
        message: "Missing 'filename' query parameter for file deletion.",
      });
    }

    const filePath = path.join(
      process.cwd() + "/public/uploads",
      filename.toString()
    );

    try {
      await fs.unlink(filePath);
      res.json({
        status: "success",
        message: `File '${filename}' has been deleted.`,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Error deleting the file '${filename}'.`,
      });
    }
  } else {
    res.status(405).json({
      status: "error",
      message: "Method not allowed.",
    });
  }
};

export default handler;
