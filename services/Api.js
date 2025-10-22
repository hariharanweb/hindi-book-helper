import config from "../config";

/**
 * Posts an image to the /translate endpoint
 * @param {Object} imageAsset - The image asset from expo-image-picker
 * @returns {Promise<Object>} The response from the server
 */
export const postImage = async (imageAsset) => {
  try {
    const formData = new FormData();

    // Extract file info from the image asset
    const uri = imageAsset.uri;
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    // Append the image to FormData
    formData.append("image", {
      uri: uri,
      name: filename,
      type: type,
    });

    // Make the POST request
    const response = await fetch(`${config.apiBaseUrl}/translate`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
