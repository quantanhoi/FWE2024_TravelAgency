  import React, { useEffect, useState } from 'react';
  import logo from './logo.svg';
  import { useLocalStorage } from './hooks/useLocalStorage';
  import './App.css';
import { useAuth } from './providers/authProvider';
  type TestButtonProps = {
    onClick: () => void;  // Define onClick prop
  };
  //In React, components communicate with each other through props. 
  //If you want a component to be able to perform an action that affects another component, 
  //you need to pass a function to the first component 
  //that it can call to perform the action. This function is usually passed as a prop
  const TestButton: React.FC<TestButtonProps> = ({ onClick }) => {
    return (
      <button onClick={onClick}>Click me</button>
    );
  };
  interface Reise {
    // define the properties of a Reise object here
    r_id: number;
    r_name: string;
    r_beschreibung: string;
    // etc.
  }
  function App() {
    const {accessToken} = useAuth();
    const [linkText, setLinkText] = useState('Learn React');
    const handleClick = () => {
      setLinkText(linkText === 'Learn React' ? "Don't Learn React" : 'Learn React');
    };
    //useState is a Hook in React that lets you add state to your functional components. 
    //It returns a pair: the current state value and a function that lets you update it. 
    /* reiseList is the state variable, and setReiseList is the function that updates it.
    useState([]) initializes reiseList as an empty array.
    */
    const [reiseList, setReiseList] = useState<Reise[]>([]);


    /* useEffect is a Hook in React that lets you perform side effects in function components.
    side effects are actions that affect things outside the component, like fetching data from an API,
    subscribing to a service, or updating the document title, or manipulating the DOM directly.
    */ 
    useEffect(() => {
      fetch('http://localhost:3001/api/reise', {
        headers: {
          'Authorization': `${accessToken}`
        }
      })
      /*this line is a part of promise chain, fetch returns a promise resolves to the response object
      representing tge response to the request made by fetch
      */
        .then(response => response.json())
        /* It receives the data parsed from the previous json() call. 
        You can now use this data in your application.*/ 
        .then(data => {
          if (Array.isArray(data)) {
            setReiseList(data);
          } else {
            console.error('Data is not an array:', data);
          }
        })
        .catch(error => console.error('Error:', error));
    }, []);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
          {/* In your case, you want the TestButton component 
            to be able to change the text of a link in the App component. 
            To do this, you pass a function (handleClick) from App 
            to TestButton as a prop (onClick). When the button in 
            TestButton is clicked, it calls the onClick function, 
            which changes the link text in App. */}
          <TestButton onClick={handleClick} />
          {reiseList.map((reise: any) => (
            <div key={reise.r_id}>
              <h2>{reise.r_name}</h2>
              <p>{reise.r_beschreibung}</p>
            </div>
          ))}
        </header>
      </div>
    );
  }

  export default App;
