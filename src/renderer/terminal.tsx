import * as React from 'react';
import { createRoot } from 'react-dom/client';


const reactRoot = document.getElementById('react');
const root = createRoot(reactRoot);
root.render(
    <div>
        <h2>Hello from Terminal!</h2>
    
    </div>
);