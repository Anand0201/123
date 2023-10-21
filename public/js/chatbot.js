// This code is for v4 of the openai package: npmjs.com/package/openai
const OpenAI = require('openai');
const readline = require('readline');


const openai = new OpenAI({
  apiKey: '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',
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question('User: ', async(input) => {
    prompt = input;
    rl.close(); // Close the readline interface

    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        console.log(`The best completion is "${response.choices[0].text}"`);
        } catch (error) {
            console.error(error);
        }
    });