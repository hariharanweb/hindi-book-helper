import OpenAI from 'openai';
import mock from './mock.json';
const OPENAI_API_KEY = "foobar";
const useFake = true

export const translateHindi = async (imageBase64) => {
  let response;
  if (!useFake) {
    const client = new OpenAI({
      apiKey: OPENAI_API_KEY
    });
    response = await client.responses.create({
      model: "gpt-4.1-mini", // or "gpt-4o-mini" for cheaper //gpt-5-vision
      input: [
        {
          role: "system",
          content: `You are a translator. Extract all Hindi text from the image and output literal, word-by-word English translation in JSON: [{eng:'...', hin:'...'}]. 
          Every line in Hindi is separated by pipe |. Dont translate multiple hindi lines together. Example: If given input is "से नहीं लिया। समय बीतता रहा।" output should be
          [
            {
              "eng": "From not took",
              "hin": "से नहीं लिया"
            },
            {
              "eng": "Time passed kept on",
              "hin": "समय बीतता रहा"
            }
          ]
        `,
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: "Translate this image" },
            { type: "input_image", image_url: `data:image/jpeg;base64,${imageBase64}` },
          ],
        },
      ],
    });
  } else {
    response = mock
  }
  // console.log(response)
  console.log(JSON.stringify(response));
  return Promise.resolve(JSON.parse(response.output_text))
}
