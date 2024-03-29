import './App.css';
import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import IntroScreen from './components/screen/IntroScreen';
import QuizScreen from './components/screen/QuizScreen';
import ResultsScreen from './components/screen/ResultsScreen';
import LoadingScreen from './components/screen/LoadingScreen';
import ErrorScreen from './components/screen/ErrorScreen';
import { fetchDebugData, fetchInitData, fetchIntroData } from './store/thunk';
import DebuggingScreen from './components/screen/DebuggingScreen';
import { useDebugging } from './devSettings';

function App() {
  const dispatch = useDispatch();
  const currentScreen = useSelector((state) => state.ui.currentScreen);

  const handleEventFromWebflow = async (event) => {
    if (event.detail) {
      let webflowDispatch = await event.detail;
      dispatch(fetchIntroData(webflowDispatch));
    }
  };
  
  useEffect(()=>{
    dispatch(fetchInitData())
    if (useDebugging) {
      dispatch(fetchDebugData()) 
      return
    }
    document.addEventListener('input', handleEventFromWebflow);
    return () => {
      document.removeEventListener('input', handleEventFromWebflow);
    };
  },[dispatch])
  
  return <div className='App'>
    {currentScreen === 'loading' && <LoadingScreen />}
    {currentScreen === 'intro' && <IntroScreen />}
    {currentScreen === 'quiz' && <QuizScreen />}
    {currentScreen === 'results' && <ResultsScreen />}
    {currentScreen === 'error' && <ErrorScreen />}
    {currentScreen === 'debugging' && <DebuggingScreen />}
  </div>;
}

export default App;
