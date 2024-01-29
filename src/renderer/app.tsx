import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { TestTaskButton } from './components/TestTaskButton/TestTaskButton';


const reactRoot = document.getElementById('react');
const root = createRoot(reactRoot);
root.render(
    <div>
        <h2>Hello from React!</h2>
        <TestTaskButton />
    </div>
);