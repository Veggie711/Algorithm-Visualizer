'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import { Editor } from "@monaco-editor/react"; // Correct import for Editor

const AlgorithmVisualizer = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(300);
  const [searchTarget, setSearchTarget] = useState('');
  const [searchIndex, setSearchIndex] = useState(-1);
  const isPlayingRef = useRef(false);

  const algorithms = {
    bubble: 'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort',
    binary: 'Binary Search'
  };

  const codeSnippets = {
    bubble: `void bubbleSort(vector<int>& v) {

    int n = v.size();

    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {

            if (v[j] > v[j+1]) {
                // Swap v[j] and v[j+1]
                int temp = v[j];
                v[j] = v[j+1];
                v[j+1] = temp;
            }
        }
    }
}`,
    selection: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            // Swap elements
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
    insertion: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    binary: `int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid; // Target found
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Target not found
}`
  };

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 5);
    setArray(newArray);
    reset();
  };

  const addElement = () => {
    const newVal = Math.floor(Math.random() * 100) + 5;
    setArray([...array, newVal]);
    reset();
  };

  const removeElement = () => {
    if (array.length > 3) {
      setArray(array.slice(0, -1));
      reset();
    }
  };

  const reset = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentStep(-1);
    setComparing([]);
    setSorted([]);
    setSearchIndex(-1);
  };

  const bubbleSort = async (arr) => {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isPlayingRef.current) return;
        
        // Highlight comparison
        setComparing([j, j + 1]);
        setCurrentStep(j);
        await sleep(speed);
        
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed / 2); // Short pause after swap
        }
      }
      // Mark as sorted
      setSorted(prev => [...prev, n - i - 1]);
    }
    setSorted(prev => [...prev, 0]);
    setComparing([]);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const selectionSort = async (arr) => {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setCurrentStep(i);
      
      for (let j = i + 1; j < n; j++) {
        if (!isPlayingRef.current) return;
        
        setComparing([minIdx, j]);
        await sleep(speed);
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        // Swap elements
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await sleep(speed / 2);
      }
      
      setSorted(prev => [...prev, i]);
    }
    setSorted(prev => [...prev, n - 1]);
    setComparing([]);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const insertionSort = async (arr) => {
    const n = arr.length;
    setSorted([0]); // First element is already "sorted"
    
    for (let i = 1; i < n; i++) {
      if (!isPlayingRef.current) return;
      
      let key = arr[i];
      let j = i - 1;
      setCurrentStep(i);
      
      // Find position to insert
      while (j >= 0 && arr[j] > key) {
        if (!isPlayingRef.current) return;
        
        setComparing([j, j + 1]);
        await sleep(speed);
        
        arr[j + 1] = arr[j];
        setArray([...arr]);
        j--;
      }
      
      arr[j + 1] = key;
      setArray([...arr]);
      setSorted(prev => [...prev, i]);
      await sleep(speed / 2);
    }
    
    setComparing([]);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const binarySearch = async (arr) => {
    if (!searchTarget) {
      alert('Please enter a search value');
      setIsPlaying(false);
      return;
    }
    
    const target = parseInt(searchTarget);
    // Sort array first for binary search
    const sortedArr = [...arr].sort((a, b) => a - b);
    setArray(sortedArr);
    await sleep(speed);
    
    let left = 0;
    let right = sortedArr.length - 1;
    let found = false;
    
    while (left <= right && isPlayingRef.current) {
      const mid = Math.floor((left + right) / 2);
      
      setCurrentStep(mid);
      setComparing([left, right]);
      await sleep(speed);
      
      if (sortedArr[mid] === target) {
        setSearchIndex(mid);
        found = true;
        break;
      } else if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (!found) {
      setSearchIndex(-1);
    }
    
    setComparing([]);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const startAlgorithm = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }
    
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    // Reset visualization state
    setComparing([]);
    setSorted([]);
    setCurrentStep(-1);
    setSearchIndex(-1);
    
    const arrCopy = [...array];
    
    try {
      switch (algorithm) {
        case 'bubble':
          await bubbleSort(arrCopy);
          break;
        case 'selection':
          await selectionSort(arrCopy);
          break;
        case 'insertion':
          await insertionSort(arrCopy);
          break;
        case 'binary':
          await binarySearch(arrCopy);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Algorithm execution error:', error);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const getBarColor = (index) => {
    if (searchIndex === index) return 'bg-green-500 shadow-green-300';
    if (sorted.includes(index)) return 'bg-emerald-400 shadow-emerald-200';
    if (comparing.includes(index)) return 'bg-yellow-400 shadow-yellow-200';
    if (currentStep === index) return 'bg-blue-500 shadow-blue-300';
    return 'bg-slate-300 dark:bg-slate-600 shadow-slate-200';
  };

  const getBarHeight = (value) => {
    const maxVal = Math.max(...array);
    const minHeight = 30;
    const maxHeight = 250;
    return Math.max((value / maxVal) * maxHeight, minHeight);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="text-left mb-8 ml-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
          Algorithm Visualizer
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Watch sorting algorithms come to life with smooth animations
        </p>
      </div>
      <div className="flex space-x-6 max-w-full mx-auto">

        {/* LEFT COLUMN */}
        <div className="w-7/10 min-w-[700px] flex-shrink-0">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl mb-8 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <div className="flex gap-2 items-center">
                <select
                  value={algorithm}
                  onChange={(e) => { setAlgorithm(e.target.value); reset(); }}
                  disabled={isPlaying}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                >
                  {Object.entries(algorithms).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
                
                {algorithm === 'binary' && (
                  <input
                    type="number"
                    placeholder="Search value"
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    disabled={isPlaying}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all w-32 disabled:opacity-50"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={startAlgorithm}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={reset}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                <button
                  onClick={generateRandomArray}
                  disabled={isPlaying}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  Randomize
                </button>
                
                <button
                  onClick={addElement}
                  disabled={isPlaying || array.length >= 12}
                  className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  <Plus size={16} />
                </button>
                
                <button
                  onClick={removeElement}
                  disabled={isPlaying || array.length <= 3}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-slate-600 dark:text-slate-300 text-sm">Speed:</label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  disabled={isPlaying}
                  className="w-24 accent-blue-500 disabled:opacity-50"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 w-12">
                  {speed}ms
                </span>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-end justify-center gap-2 h-80 mb-6 px-4">
              {array.map((value, index) => (
                <div
                  key={`${index}-${value}`}
                  className="relative flex flex-col items-center transition-all duration-300 ease-out"
                >
                  <div
                    className={`w-12 rounded-t-lg transition-all duration-300 ease-out transform hover:scale-105 ${getBarColor(index)}`}
                    style={{ height: `${getBarHeight(value)}px` }}
                  />
                  <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded min-w-8 text-center">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            {isPlaying && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Running {algorithms[algorithm]}...
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <span className="text-slate-600 dark:text-slate-300">Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-slate-600 dark:text-slate-300">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-300">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                <span className="text-slate-600 dark:text-slate-300">Sorted</span>
              </div>
              {algorithm === 'binary' && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-slate-600 dark:text-slate-300">Found</span>
                </div>
              )}
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
              {algorithms[algorithm]}
            </h3>
            <div className="text-slate-600 dark:text-slate-300">
              {algorithm === 'bubble' && (
                <p>Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. Time complexity: O(n²)</p>
              )}
              {algorithm === 'selection' && (
                <p>Selection Sort finds the minimum element and places it at the beginning, then repeats for the remaining elements. Time complexity: O(n²)</p>
              )}
              {algorithm === 'insertion' && (
                <p>Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position. Time complexity: O(n²)</p>
              )}
              {algorithm === 'binary' && (
                <p>Binary Search efficiently finds a target value in a sorted array by repeatedly dividing the search interval in half. Time complexity: O(log n)</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-3/10 min-w-[525px] bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-4">
            Code :
          </h2>
          <div className="flex-grow rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
            <Editor
              height="100%"
              width ="100%"
              language="cpp"
              theme="vs-dark"
              value={codeSnippets[algorithm]}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                domReadOnly: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;