import type { Component } from 'solid-js';
import './style.scss';

const App: Component = () => {
  return (
    <div class="container">
      <h1>Hello from SolidJS!</h1>
      <p>This application is built by Vite and served by a Deno server.</p>
      <p>Both are running inside a Docker container.</p>
    </div>
  );
};

export default App;
