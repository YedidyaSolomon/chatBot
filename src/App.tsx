import { useState } from 'react'
import './App.css'

const randomSurpriseSelector = (options: string[]) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function App() {
  const [error, setError] = useState('Something Went Wrong! ');
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState<
    {
      role: string;
      parts: { text: string }[];
    }[]
  >([]);
  // surprise question options
  const options = [
    'When is new years ?',
    'When is halloween ?',
    'When is thanksgiving ?',
  ];

  const getResponse = async () => {
    if (!value) {
      setError('Please ask a question');
      return;
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch('http://localhost:5000/gemini', options);
      const data = await response.text();
      setChatHistory(prevHistory => [...prevHistory, {
        role: "user",
        parts: [{ text: value }]
      },
      {
        role: "model",
        parts: [{ text: data }]
      }
      ]);
      setAnswer(data);
      console.log('setted data==>', data);
    } catch (e: unknown) {
      console.log(e);
      setError('Something went wrong');
    }
  }
  return (
    <>
      <button onClick={
        () => {
          const answer = randomSurpriseSelector(options);
          setError('');
          setValue(answer);
        }
      }>Suprise me</button>
      <input type="text" name="value" id="" placeholder="when is new years ?" value={value} onChange={
        (e) => {
          setValue(e.target.value);
          setError('');
        }
      } />
      {!error && <button
        onClick={() => getResponse()}
      >Askme</button> || <button>Clear</button>}
      <p className="answer">{answer}</p>
    </>
  )
}

export default App
